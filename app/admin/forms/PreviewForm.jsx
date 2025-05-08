'use client';
import { useState, useEffect, useRef } from 'react';

import Icon from '@components/ui/Icon';

const PreviewForm = ({ formData }) => {
  const [currentData, setCurrentData] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [questionFlowComplete, setQuestionFlowComplete] = useState(false);
  const [questionsFlow, setQuestionsFlow] = useState([]);
  const [normalFields, setNormalFields] = useState([]);
  const [backButtonHovered, setBackButtonHovered] = useState(false);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  
  // Add style for transitions
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
    if (formData?.fields) {
      // Separate question fields from other fields
      const questions = formData.fields
        .filter(field => field.type === 'question')
        .sort((a, b) => a.orderIndex - b.orderIndex);
      
      const otherFields = formData.fields
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
  }, [formData]);

  const handleChange = (name, value) => {
    setCurrentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleQuestionOptionSelect = (questionId, optionValue, nextQuestionIdFromOption, isEndOption) => {
    // Save the question answer
    handleChange(`question_${questionId}`, optionValue);

    // Determine next question
    if (isEndOption) {
      console.log(`[Preview] Option selected with isEnd=true. Question ID: ${questionId}, Value: ${optionValue}. Moving to normal fields.`);
      setQuestionFlowComplete(true);
    } else if (nextQuestionIdFromOption) {
      const nextQuestionExists = questionsFlow.some(q => q.id === nextQuestionIdFromOption);
      if (nextQuestionExists) {
        console.log(`[Preview] Moving to next question (from option): ${nextQuestionIdFromOption}`);
        setCurrentQuestionId(nextQuestionIdFromOption);
      } else {
        // Target question ID does not exist in the flow
        console.log(`[Preview] Next question ID ${nextQuestionIdFromOption} from option does not exist. Moving to normal fields.`);
        setQuestionFlowComplete(true);
      }
    } else {
      // Find next question in sequence
      const currentIndex = questionsFlow.findIndex(q => q.id === questionId);
      if (currentIndex < questionsFlow.length - 1) {
        const nextSeqQuestionId = questionsFlow[currentIndex + 1].id;
        console.log(`[Preview] Moving to next sequential question: ${nextSeqQuestionId}`);
        setCurrentQuestionId(nextSeqQuestionId);
      } else {
        // No more questions, move to regular form fields
        console.log("[Preview] Last question in sequence. Moving to normal fields.");
        setQuestionFlowComplete(true);
      }
    }
  };
  
  const handleBack = () => {
    if (questionFlowComplete) {
      // Go back to last question
      if (questionsFlow.length > 0) {
        setQuestionFlowComplete(false);
        setCurrentQuestionId(questionsFlow[questionsFlow.length - 1].id);
      }
      return;
    }
    
    // Find previous question
    const currentIndex = questionsFlow.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
      setCurrentQuestionId(questionsFlow[currentIndex - 1].id);
    }
  };

  const getFileSize = (size) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const renderField = (field) => {
    const commonInputClass = `w-full p-2 text-sm font-medium border rounded-md outline-none focus:ring-2 focus:ring-primary-500 border-gray-200 hover:border-gray-300`;
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
            />
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              rows={4}
              disabled
            />
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
            />
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
            />
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
            />
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
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
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:border-primary-500 cursor-not-allowed opacity-80"
                    >
                      <input
                        id={`field-${field.id}-option-${i}`}
                        name={`field-${field.id}`}
                        type="radio"
                        className="h-4 w-4 mt-0.5 text-primary-600 border-gray-300"
                        value={optionValue}
                        checked={currentData[field.id] === optionValue}
                        onChange={() => {}}
                        disabled
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
                  
                  return (
                    <label 
                      key={i} 
                      htmlFor={`field-${field.id}-option-${i}`}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:border-primary-500 cursor-not-allowed opacity-80"
                    >
                      <input
                        id={`field-${field.id}-option-${i}`}
                        type="checkbox"
                        className="h-4 w-4 mt-0.5 text-primary-600 border-gray-300 rounded"
                        checked={false}
                        onChange={() => {}}
                        disabled
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {optionLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
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
              value={currentData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              disabled
            />
            {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
          </div>
        );
      
      case 'file':
        return (
          <div className="mb-4" key={field.id}>
            <label className={labelClass} htmlFor={`field-${field.id}`}>
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors min-h-[120px] cursor-not-allowed opacity-80 border-gray-300 bg-gray-50">
              <Icon icon="Photo" className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm text-center">
                Drag & drop file or <span className="text-primary-500 font-semibold">click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {field.accept ? `Allowed: ${field.accept}` : 'Any file type allowed'}
              </p>
            </div>
            
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
    
    const backButtonStyle = (hovered) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '6px 10px',
        marginBottom: '16px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        borderRadius: '8px',
        backgroundColor: hovered ? '#F3F4F6' : 'transparent',
        color: hovered ? 'var(--primary-color)' : '#6B7280',
        cursor: 'pointer',
        border: 'none',
        outline: 'none'
    });

    const backIconStyle = {
        width: '18px',
        height: '18px',
        marginRight: '6px',
        transition: 'all 0.3s ease',
        stroke: backButtonHovered ? 'var(--primary-color)' : 'currentColor'
    };

    const iconHolderStyle = {
      color: 'var(--primary-color)',
      backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)'
    };

    return (
      <div className="question-flow bg-white rounded-xl p-4 md:p-6">
        {/* Back Button */}
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
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Question Title */}
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
            <div className="w-12 h-1 bg-primary-500 mx-auto mt-3 mb-3 rounded-full"></div>
        </div>
        
        {/* Options */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentQuestion.options || []).map((option, i) => {
              const optionObj = typeof option === 'object' ? option : { label: option, value: option };
              const isSelected = currentData[`question_${currentQuestion.id}`] === optionObj.value;
              const isHovered = hoveredOptionIndex === i;
              
              const cardBaseClasses = `group relative flex flex-col items-center justify-center p-4 min-h-[170px] text-center rounded-xl shadow-md hover:shadow-lg cursor-pointer option-card`;
              
              // Apply dynamic styling with CSS variables to match primary color
              const lightBg = 'color-mix(in srgb, var(--primary-color) 15%, white)';
              
              return (
                <button
                  key={optionObj.id || i}
                  onClick={() => handleQuestionOptionSelect(
                    currentQuestion.id, 
                    optionObj.value, 
                    optionObj.nextQuestionId,
                    optionObj.isEnd || false
                  )}
                  onMouseEnter={() => setHoveredOptionIndex(i)}
                  onMouseLeave={() => setHoveredOptionIndex(null)}
                  className={`${cardBaseClasses} ${isSelected ? 'option-card-selected' : ''} ${isHovered ? 'option-card-hover' : ''} text-slate-700 ${isSelected ? 'font-semibold' : ''}`}
                  style={{
                    borderColor: (isSelected || isHovered) ? 'var(--primary-color)' : '#e5e7eb',
                    backgroundColor: (isSelected || isHovered) ? lightBg : '#f8fafc',
                    borderWidth: (isSelected || isHovered) ? '2px' : '1px'
                  }}
                >
                  {optionObj.image && optionObj.image.url && (
                    <div className="flex justify-center items-center mb-3 h-14">
                      <img
                        src={optionObj.image.url}
                        alt={optionObj.label || ''}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h4 className={`text-sm font-medium ${isSelected ? 'font-semibold' : ''}`}>
                    {optionObj.label}
                  </h4>
                  {isSelected && (
                    <Icon
                      icon="CheckCircleSolid"
                      className="absolute bottom-2 right-2 w-5 h-5 text-primary-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  if (!formData) {
    return <div>No form data to preview</div>;
  }
  
  return (
    <div className="space-y-6">
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
              type="button"
              className="px-6 py-2.5 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ml-auto bg-primary-500"
              disabled={true}
            >
              Submit (Preview)
            </button>
          </div>
        </>
      )}
      {/* <div className="text-sm text-gray-500 italic mt-4 p-2 bg-gray-50 rounded border border-gray-100">
        This is a preview. Form submissions are disabled in preview mode.
      </div> */}
    </div>
  );
};

export default PreviewForm;