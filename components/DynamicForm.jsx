'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { submitForm, uploadMediaFile,  deleteFileNormal } from '@services/api';
import QuestionField from './FormComponents/QuestionField';
import Icon from '@components/ui/Icon';

const DynamicForm = ({ form, onSubmitSuccess, customButtonText, customButtonColor, isPreview }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [questionFlowComplete, setQuestionFlowComplete] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [questionsFlow, setQuestionsFlow] = useState([]);
  const [normalFields, setNormalFields] = useState([]);
  const [backButtonHovered, setBackButtonHovered] = useState(false);
  const [uploadStates, setUploadStates] = useState({});
  const fileInputRefs = useRef({});
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  console.log('Form data--->', form)
  
  useEffect(() => {
    // Create a style element for our custom transitions
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .option-card {
        transition: box-shadow 0.3s ease;
        border-width: 1px;
        border-style: solid;
      }
      .option-card-hover, .option-card-selected {
        border-width: 2px !important;
        transition: border-color 0.5s ease, border-width 0.3s ease, background-color 0.3s ease !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Initialize fields and separate questions from normal fields
  useEffect(() => {
    if (form?.fields) {
      // Separate question fields from other fields
      const questions = form.fields
        .filter(field => field.type === 'question')
        .sort((a, b) => a.orderIndex - b.orderIndex);
      
      const otherFields = form.fields
        .filter(field => field.type !== 'question')
        .sort((a, b) => a.orderIndex - b.orderIndex);
      
      setQuestionsFlow(questions);
      setNormalFields(otherFields);
      
      // Set initial question if available
      if (questions.length > 0) {
        setCurrentQuestionId(questions[0].id);
      } else {
        // No questions, go directly to regular fields
        setQuestionFlowComplete(true);
      }
    }
  }, [form]);
  
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when it's changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleQuestionOptionSelect = (questionId, optionValue, nextQuestionIdFromOption, isEndOption) => {
    // Save the question answer
    handleChange(`question_${questionId}`, optionValue);

    // Determine next question
    if (isEndOption) {
      console.log(`Option selected with isEnd=true. Question ID: ${questionId}, Value: ${optionValue}. Moving to normal fields.`);
      setQuestionFlowComplete(true);
    } else if (nextQuestionIdFromOption) {
      const nextQuestionExists = questionsFlow.some(q => q.id === nextQuestionIdFromOption);
      if (nextQuestionExists) {
        console.log(`Moving to next question (from option): ${nextQuestionIdFromOption}`);
        setCurrentQuestionId(nextQuestionIdFromOption);
      } else {
        // Target question ID does not exist in the flow
        console.log(`Next question ID ${nextQuestionIdFromOption} from option does not exist. Moving to normal fields.`);
        setQuestionFlowComplete(true);
      }
    } else {
      // Find next question in sequence
      const currentIndex = questionsFlow.findIndex(q => q.id === questionId);
      if (currentIndex < questionsFlow.length - 1) {
        const nextSeqQuestionId = questionsFlow[currentIndex + 1].id;
        console.log(`Moving to next sequential question: ${nextSeqQuestionId}`);
        setCurrentQuestionId(nextSeqQuestionId);
      } else {
        // No more questions, move to regular form fields
        console.log("Last question in sequence. Moving to normal fields.");
        setQuestionFlowComplete(true);
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Only validate visible fields (if in question flow, only validate current question,
    // if question flow is complete, validate normal fields)
    const fieldsToValidate = questionFlowComplete
      ? normalFields
      : questionsFlow.filter(q => q.id === currentQuestionId);
    
    // Check required fields
    fieldsToValidate.forEach(field => {
      const fieldId = field.type === 'question' ? `question_${field.id}` : field.id;
      if (field.isRequired && !formData[fieldId]) {
        newErrors[fieldId] = 'This field is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateForm()) {
      // Find next question
      const currentIndex = questionsFlow.findIndex(q => q.id === currentQuestionId);
      if (currentIndex < questionsFlow.length - 1) {
        setCurrentQuestionId(questionsFlow[currentIndex + 1].id);
      } else {
        // No more questions, move to regular form fields
        setQuestionFlowComplete(true);
      }
    } else {
      toast.error('Please answer this question to continue');
    }
  };
  
  const handleBack = () => {
    if (questionFlowComplete) {
      // Go back to last question
      if (questionsFlow.length > 0) {
        setQuestionFlowComplete(false);
        setCurrentQuestionId(questionsFlow[questionsFlow.length - 1].id);
        // Clear answers for fields that were shown after question flow
        const normalFieldIds = normalFields.map(f => f.id);
        const newFormData = { ...formData };
        normalFieldIds.forEach(id => delete newFormData[id]);
        setFormData(newFormData);
      }
      return;
    }
    
    // Find previous question
    const currentIndex = questionsFlow.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
      const previousQuestionId = questionsFlow[currentIndex - 1].id;
      console.log(`Moving back to previous question: ${previousQuestionId}`);
      // Clear current question's answer before going back
      const currentQ = questionsFlow[currentIndex];
      handleChange(`question_${currentQ.id}`, undefined); 

      setCurrentQuestionId(previousQuestionId);
    } else {
      // Already at first question
      console.log('Already at the first question.');
      toast.info('This is the first question');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await submitForm(form.id, formData);
      
      // Clear form data
      setFormData({});
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        toast.success('Form submitted successfully');
        
        // Reset form to initial state
        if (questionsFlow.length > 0) {
          setQuestionFlowComplete(false);
          setCurrentQuestionId(questionsFlow[0].id);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileUpload = async (fieldId, file) => {
    if (!file) return;
    
    // Set loading state
    setUploadStates(prev => ({
      ...prev,
      [fieldId]: { loading: true, error: null }
    }));
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('addToMediaLibrary', 'false');
      formData.append('setAsInUse', 'false');
      
      // Upload the file
      const response = await uploadMediaFile(file, true, true);
      
      // Store the file data in formData state
      const fileData = {
        _id: response._id,
        url: response.url,
        name: file.name,
        size: file.size,
        type: file.type,
        fromMediaLibrary: response.fromMediaLibrary || false,
        mediaId: response.mediaId
      };
      
      // Update form data
      handleChange(fieldId, fileData);
      
      // Clear loading state
      setUploadStates(prev => ({
        ...prev,
        [fieldId]: { loading: false, error: null }
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStates(prev => ({
        ...prev,
        [fieldId]: { 
          loading: false, 
          error: error.response?.data?.error || 'Failed to upload file' 
        }
      }));
    }
  };
  
  const handleFileRemove = async (fieldId) => {
    const file = formData[fieldId];
    
    if (file && file._id ) {
      try {
        // Call API to delete the file from storage
        await deleteFileNormal(file._id);
        console.log(`Deleted file ${file._id}`);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    
    // Remove file from form data
    handleChange(fieldId, null);
    // Clear any errors for this field
    setErrors(prev => ({ ...prev, [fieldId]: null }));
    // Reset upload state for this field
    setUploadStates(prev => ({ ...prev, [fieldId]: { loading: false, error: null, isDragging: false } }));
    // Clear the actual file input value if the ref exists
    if (fileInputRefs.current[fieldId]) {
      fileInputRefs.current[fieldId].value = "";
    }
  };
  
  const getFileSize = (size) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragOver = (e, fieldId) => {
    e.preventDefault();
    if (uploadStates[fieldId]?.loading) return;
    setUploadStates(prev => ({ ...prev, [fieldId]: { ...prev[fieldId], isDragging: true } }));
  };

  const handleDragLeave = (e, fieldId) => {
    e.preventDefault();
    if (uploadStates[fieldId]?.loading) return;
    setUploadStates(prev => ({ ...prev, [fieldId]: { ...prev[fieldId], isDragging: false } }));
  };

  const handleDrop = (e, fieldId) => {
    e.preventDefault();
    if (uploadStates[fieldId]?.loading) return;
    setUploadStates(prev => ({ ...prev, [fieldId]: { ...prev[fieldId], isDragging: false } }));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(fieldId, e.dataTransfer.files[0]);
      e.dataTransfer.clearData(); // Recommended to clear the data transfer object
    }
  };

  const handleBoxClick = (fieldId) => {
    if (fileInputRefs.current[fieldId] && !uploadStates[fieldId]?.loading) {
      fileInputRefs.current[fieldId].click();
    }
  };
  
  const renderField = (field) => {
    const commonInputClass = `w-full p-2 text-sm font-medium border rounded-md outline-none focus:ring-2 focus:ring-primary-500 ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`;
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    switch (field.type) {
      case 'text':
      case 'name':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`field-${field.id}`}
              type="text"
              className={commonInputClass}
              placeholder={field.placeholder || ''}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={`field-${field.id}`}
              className={`${commonInputClass} min-h-[80px]`}
              placeholder={field.placeholder || ''}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              rows={4}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'email':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`field-${field.id}`}
              type="email"
              className={commonInputClass}
              placeholder={field.placeholder || ''}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'number':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`field-${field.id}`}
              type="number"
              className={commonInputClass}
              placeholder={field.placeholder || ''}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'phone':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`field-${field.id}`}
              type="tel"
              className={commonInputClass}
              placeholder={field.placeholder || ''}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              id={`field-${field.id}`}
              className={commonInputClass}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options && field.options.map((option, i) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                return (
                  <option key={i} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'radio':
        return (
          <div className="mb-4" key={field.id}>
            <fieldset>
              <legend className={`${labelClass} mb-2`}>
                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
              </legend>
              <div className="mt-1 space-y-2">
                {field.options && field.options.map((option, i) => {
                  const optionValue = typeof option === 'object' ? option.value : option;
                  const optionLabel = typeof option === 'object' ? option.label : option;
                  const optionImage = typeof option === 'object' ? option.image : null;
                  
                  return (
                    <label 
                      key={i} 
                      htmlFor={`field-${field.id}-option-${i}`}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:border-primary-500 cursor-pointer transitio-colors"
                    >
                      <input
                        id={`field-${field.id}-option-${i}`}
                        name={`field-${field.id}`}
                        type="radio"
                        className="h-4 w-4 mt-0.5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        value={optionValue}
                        checked={formData[field.id] === optionValue}
                        onChange={() => handleChange(field.id, optionValue)}
                        required={field.isRequired}
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {optionImage && (
                          <div className="mb-2 w-full max-w-[150px]">
                            <img 
                              src={optionImage.url} 
                              alt={optionLabel}
                              className="rounded border border-gray-200"  
                            />
                          </div>
                        )}
                        {optionLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="mb-4" key={field.id}>
            <fieldset>
              <legend className={`${labelClass} mb-2`}>
                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
              </legend>
              <div className="mt-1 space-y-2">
                {field.options && field.options.map((option, i) => {
                  const optionValue = typeof option === 'object' ? option.value : option;
                  const optionLabel = typeof option === 'object' ? option.label : option;
                  
                  const isChecked = formData[field.id] === optionValue;
                  
                  const handleCheckboxChange = () => {
                    // Only store the single selected value
                    handleChange(field.id, optionValue);
                  };
                  
                  return (
                    <label 
                      key={i} 
                      htmlFor={`field-${field.id}-option-${i}`}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:border-primary-500 cursor-pointer transition-colors"
                    >
                      <input
                        id={`field-${field.id}-option-${i}`}
                        type="checkbox"
                        className="h-4 w-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {optionLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'date':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`field-${field.id}`}
              type="date"
              className={commonInputClass}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.isRequired}
            />
            {errors[field.id] && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'file':
        const currentUploadState = uploadStates[field.id] || {};
        const currentFile = formData[field.id];

        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            
            <input
              id={`field-${field.id}`}
              type="file"
              ref={(el) => fileInputRefs.current[field.id] = el}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(field.id, e.target.files[0]);
                }
              }}
              required={field.isRequired && !currentFile} // Required only if no file is already uploaded
              disabled={currentUploadState.loading}
              accept={field.accept || undefined} // Optional: Add accept prop to field schema
            />

            {!currentFile ? (
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors min-h-[120px] cursor-pointer
                  ${currentUploadState.isDragging ? 'border-primary-500 bg-primary-50' : (errors[field.id] || currentUploadState.error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400')}
                  ${currentUploadState.loading ? 'opacity-50 pointer-events-none' : ''}
                `}
                onClick={() => handleBoxClick(field.id)}
                onDragOver={(e) => handleDragOver(e, field.id)}
                onDragLeave={(e) => handleDragLeave(e, field.id)}
                onDrop={(e) => handleDrop(e, field.id)}
              >
                {currentUploadState.loading ? (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <Icon icon="Photo" className="w-10 h-10 text-gray-400 mb-2" /> 
                    {/* Using "Photo" as a placeholder, ensure your Icon component supports it or change to e.g., "CloudArrowUp" */}
                    <p className="text-gray-500 text-sm text-center">
                      Drag & drop file or <span className="text-primary-500 font-semibold">click to upload</span>
                    </p>
                    {/* Example for maxSize, if you add it to field schema: 
                    {field.maxSize && <p className="text-xs text-gray-400 mt-1">Max {getFileSize(field.maxSize)}</p>} */}
                    <p className="text-xs text-gray-400 mt-1">
                      {field.accept ? `Allowed: ${field.accept}` : 'Any file type allowed'}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center border rounded-lg p-3 bg-gray-50 relative">
                <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-gray-100 mr-4">
                  {currentFile.url && (currentFile.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(currentFile.name)) ? (
                    <img
                      src={currentFile.url}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Icon icon="Document" className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-gray-700 text-sm truncate" title={currentFile.name}>
                    {currentFile.name || 'File uploaded'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentFile.size ? getFileSize(currentFile.size) : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileRemove(field.id)}
                  className="ml-2 p-1.5 rounded-full hover:bg-red-100 text-red-600 transition absolute top-2 right-2"
                  aria-label="Remove"
                >
                  <Icon icon="XMark" className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {currentUploadState.error && (
              <p className="mt-1 text-sm text-red-500">{currentUploadState.error}</p>
            )}
            {errors[field.id] && !currentUploadState.error && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      default:
        return (
          <div className="mb-4" key={field.id}>
            <p className="text-gray-500">Unsupported field type: {field.type}</p>
          </div>
        );
    }
  };
  
  const renderQuestionFlow = () => {
    const currentQuestion = questionsFlow.find(q => q.id === currentQuestionId);
    
    if (!currentQuestion) {
      return null;
    }
    
    const totalQuestions = questionsFlow.length;
    const currentIndex = questionsFlow.findIndex(q => q.id === currentQuestionId);
    const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
    
    const questionColor = customButtonColor || 'var(--primary-color)';
    const lightQuestionBg = `color-mix(in srgb, ${questionColor} 15%, white)`; // Light background for selected state

    const backButtonStyle = (hovered) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '6px 10px',
        marginBottom: '16px', // Added margin
        fontWeight: '500',
        transition: 'all 0.3s ease',
        borderRadius: '8px',
        backgroundColor: hovered ? '#F3F4F6' : 'transparent', // Tailwind gray-100
        color: hovered ? questionColor : '#6B7280', // Tailwind gray-500
        cursor: 'pointer',
        border: 'none',
        outline: 'none'
    });

    const backIconStyle = {
        width: '18px',
        height: '18px',
        marginRight: '6px',
        transition: 'all 0.3s ease',
        stroke: backButtonHovered ? questionColor : 'currentColor'
    };

    const iconHolderStyle = {
      color: questionColor,
      backgroundColor: customButtonColor
        ? `${customButtonColor}1A` // Assumes customButtonColor is a hex like #RRGGBB
        : 'color-mix(in srgb, var(--primary-color) 10%, white)' // Matches primary-100 definition
    };

    return (
      <div className="question-flow bg-white rounded-xl p-4 md:p-6">
        {/* Back Button - styled like ContactPopup */}
        {currentIndex > 0 && (
            <button
                onClick={handleBack}
                style={backButtonStyle(backButtonHovered)}
                onMouseEnter={() => setBackButtonHovered(true)}
                onMouseLeave={() => setBackButtonHovered(false)}
            >
                <svg
                    style={backIconStyle}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>
        )}

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%`, backgroundColor: questionColor }}
          ></div>
        </div>
        
        {/* Question Title - styled like ContactPopup */}
        <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-3" style={iconHolderStyle}>
                <Icon icon="QuestionMarkCircle" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {currentQuestion.label}
            </h3>
            {currentQuestion.placeholder && (
              <p className="text-gray-600 mt-1">{currentQuestion.placeholder}</p>
            )}
            <div className="w-12 h-1 bg-primary-500 mx-auto mt-3 mb-3 rounded-full" style={{ backgroundColor: questionColor }}></div>
        </div>
        
        {/* Options - styled like ContactPopup */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Increased gap slightly */}
            {(currentQuestion.options || []).map((option, i) => {
              const optionObj = typeof option === 'object' ? option : { label: option, value: option };
              const isSelected = formData[`question_${currentQuestion.id}`] === optionObj.value;
              const isHovered = hoveredOptionIndex === i;
              
              const cardBaseClasses = `group relative flex flex-col items-center justify-center p-4 min-h-[170px] text-center rounded-xl shadow-md hover:shadow-lg cursor-pointer`;
              
              // Apply styles based on selected/hovered state
              const optionInlineStyles = {
                borderWidth: (isSelected || isHovered) ? '2px' : '1px',
                borderColor: (isSelected || isHovered) ? questionColor : '#e5e7eb', // slate-200 equivalent
                backgroundColor: (isSelected || isHovered) ? lightQuestionBg : '#f8fafc', // slate-50 equivalent
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' // Using a cubic-bezier for smoother transition
              };

              return (
                <button
                  key={optionObj.id || i}
                  onClick={() => handleQuestionOptionSelect(
                    currentQuestion.id, 
                    optionObj.value, 
                    optionObj.nextQuestionId,
                    optionObj.isEnd || false // Pass isEnd property
                  )}
                  onMouseEnter={() => setHoveredOptionIndex(i)}
                  onMouseLeave={() => setHoveredOptionIndex(null)}
                  className={`${cardBaseClasses} option-card ${isSelected ? 'option-card-selected' : ''} ${isHovered ? 'option-card-hover' : ''} text-slate-700 ${isSelected ? 'font-semibold' : ''}`}
                  style={{
                    borderColor: (isSelected || isHovered) ? questionColor : '#e5e7eb',
                    backgroundColor: (isSelected || isHovered) ? lightQuestionBg : '#f8fafc'
                  }}
                >
                  {optionObj.image && optionObj.image.url && (
                    <div className="flex justify-center items-center mb-3 h-14"> {/* Container to help center image of fixed height */}
                      <img
                        src={optionObj.image.url}
                        alt={optionObj.label || ''}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* {JSON.stringify(optionObj.isEnd ? 'true' : 'false')} */}
                    </div>
                  )}
                  <h4 className={`text-sm font-medium ${isSelected ? 'font-semibold' : ''}`}>
                    {optionObj.label}
                  </h4>
                  {isSelected && (
                    <Icon
                      icon="CheckCircleSolid" // Ensure this icon is available in your Icon component
                      className="absolute bottom-2 right-2 w-5 h-5"
                      style={{ color: questionColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className={`flex ${currentIndex === 0 ? 'justify-end' : 'justify-between'} items-center mt-8`}>
          {currentIndex > 0 && ( // Show back button only if not the first question
             <button
              type="button"
              onClick={handleBack} // This button is now styled by the top one
              className="invisible" // Make it invisible as the styled one is at the top
            >
              Back
            </button>
          )}
          
          {/* Next button is implicit by selecting an option for now, or could be explicit if no auto-advance */}
          {/* If explicit next button is needed after selection: */}
          {/* <button
            type="button"
            onClick={handleNext} // You'd need to implement handleNext properly if options don't auto-advance
            disabled={!formData[`question_${currentQuestion.id}`]} // Disable if no option selected
            className="px-6 py-2.5 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50"
            style={{ backgroundColor: !formData[`question_${currentQuestion.id}`] ? '#D1D5DB' : (customButtonColor || '#2563eb'), borderColor: customButtonColor || '#2563eb', color: 'white' }}
          >
            <div className="flex items-center">
              Next
              <Icon icon="ChevronRight" className="h-5 w-5 ml-2" />
            </div>
          </button> */}
        </div>
      </div>
    );
  };
  
  if (!form) {
    return <div>Loading form...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y */}
      {/* Show either question flow or regular fields based on state */}
      {!questionFlowComplete && questionsFlow.length > 0 ? (
        renderQuestionFlow()
      ) : (
        <>
          {/* Regular form fields */}
          {normalFields.map(field => renderField(field))}
          
          <div className="flex justify-between items-center pt-4">
            {questionsFlow.length > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Icon icon="ChevronLeft" className="h-5 w-5 mr-2" />
                Back to Questions
              </button>
            )}
            
            <button
              type="submit"
              className="px-6 py-2.5 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ml-auto disabled:opacity-70"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : (customButtonColor || 'var(--primary-color)'), 
                borderColor: (customButtonColor || 'var(--primary-color)') 
              }}
              disabled={loading || isPreview}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (customButtonText || 'Submit')}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default DynamicForm; 