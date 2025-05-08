"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Textinput from "@components/ui/Textinput";
import Select from "@components/ui/Select";
import Textarea from "@components/ui/Textarea";
import { toast } from "react-toastify";
import { getFormById, createForm, updateForm } from "@services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MediaUpload from "@components/ui/MediaUpload";
import Icon from "@components/ui/Icon";
import http from "@services/api/http";
import { Fragment } from "react";
import { useQueryClient } from "react-query";
import Modal from "@components/ui/Modal";
import DynamicForm from "@components/DynamicForm";
import PreviewForm from "./PreviewForm";

const fieldTypes = [
  {
    id: "text-input",
    type: "text",
    label: "Single Line Text",
    icon: "DocumentText",
    description: "Single line text input field",
    config: {
      label: "Text Input",
      placeholder: "Enter text",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "textarea",
    type: "textarea",
    label: "Multi-Line Text",
    icon: "DocumentText",
    description: "Multi-line text input field",
    config: {
      label: "Text Area",
      placeholder: "Enter text here",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "email",
    type: "email",
    label: "Email",
    icon: "EnvelopeOpen",
    description: "Email address field",
    config: {
      label: "Email",
      placeholder: "Enter email address",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "number",
    type: "number",
    label: "Number",
    icon: "HashTag",
    description: "Numeric input field",
    config: {
      label: "Number",
      placeholder: "Enter a number",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "select",
    type: "select",
    label: "Dropdown",
    icon: "ChevronDown",
    description: "Dropdown selection field",
    config: {
      label: "Select Option",
      placeholder: "Choose an option",
      isRequired: false,
      options: ["Option 1", "Option 2"],
      note: "",
    },
  },
  {
    id: "checkbox",
    type: "checkbox",
    label: "Checkbox",
    icon: "CheckCircle",
    description: "Checkbox options",
    config: {
      label: "Checkbox Options",
      isRequired: false,
      options: ["Option 1", "Option 2"],
      note: "",
    },
  },
  {
    id: "radio",
    type: "radio",
    label: "Radio Buttons",
    icon: "Radio",
    description: "Radio button options",
    config: {
      label: "Radio Options",
      isRequired: false,
      options: ["Option 1", "Option 2"],
      note: "",
    },
  },
  {
    id: "file",
    type: "file",
    label: "File Upload",
    icon: "PaperClip",
    description: "File upload field",
    config: {
      label: "Upload File",
      isRequired: false,
      isExpired: false,
      note: "",
    },
  },
  {
    id: "date",
    type: "date",
    label: "Date",
    icon: "Calendar",
    description: "Date selection field",
    config: {
      label: "Select Date",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "name",
    type: "name",
    label: "Name",
    icon: "User",
    description: "Name input field",
    config: {
      label: "Name",
      placeholder: "Enter your name",
      isRequired: false,
      note: "",
    },
  },
  {
    id: "phone",
    type: "phone",
    label: "Phone",
    icon: "Phone",
    description: "Phone number field",
    config: {
      label: "Phone",
      placeholder: "Enter phone number",
      isRequired: false,
      note: "",
    },
  },
//   {
//     id: "address",
//     type: "address",
//     label: "Address",
//     icon: "HomeModern",
//     description: "Address input field",
//     config: {
//       label: "Address",
//       placeholder: "Enter address",
//       isRequired: false,
//       note: "",
//     },
//   },
  {
    id: "question",
    type: "question",
    label: "Question",
    icon: "QuestionMarkCircle",
    description: "Question with options",
    config: {
      label: "Question",
      isRequired: false,
      options: ["Option 1"],
      note: "",
    },
  },
];

const FormForm = ({ id }) => {
  const isEditMode = !!id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [uploadStates, setUploadStates] = useState({});
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("fields");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    status: "draft",
    fields: [],
  });

  useEffect(() => {
    if (isEditMode) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await getFormById(id);
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        status: data.status,
        fields: (data.fields || []).map((field) => ({
          ...field,
          isExpanded: false,
        })),
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form data");
      setLoading(false);
      router.push("/admin/forms");
    }
  };
  console.log('Form data--->', formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleAddField = (type) => {
    // Find the matching field type definition
    const fieldTypeDefinition = fieldTypes.find(f => f.type === type);
    
    // Create a new field with configuration from the field type definition
    const newField = {
      type,
      label: fieldTypeDefinition?.config?.label || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: fieldTypeDefinition?.config?.placeholder || "",
      isRequired: fieldTypeDefinition?.config?.isRequired || false,
      orderIndex: formData.fields.length,
      isExpanded: true,
      note: fieldTypeDefinition?.config?.note || "",
      options: ["select", "radio", "checkbox", "question"].includes(type)
        ? [{ 
            label: "Option 1", 
            value: "Option 1", 
            image: null, 
            nextQuestionId: null,
            isEnd: false
          }] 
        : [],
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleFieldDrop = (result) => {
    // If no valid destination or not dropping into form fields, return
    if (!result.destination || result.destination.droppableId !== "fields") return;
    
    // Find the field type definition based on the dragged id
    const fieldType = fieldTypes.find(f => f.id === result.draggableId);
    
    if (fieldType) {
      // Create a new field without the string id
      const newField = {
        type: fieldType.type,
        label: fieldType.config.label,
        placeholder: fieldType.config.placeholder || "",
        isRequired: fieldType.config.isRequired || false,
        orderIndex: result.destination.index,
        isExpanded: true,
        note: fieldType.config.note || "",
        options: ["select", "radio", "checkbox", "question"].includes(fieldType.type)
          ? (fieldType.config.options || []).map(opt => (
              typeof opt === 'string' 
              ? { label: opt, value: opt, image: null, nextQuestionId: null, isEnd: false }
              : { ...opt, isEnd: opt.isEnd || false }
            ))
          : [],
        // Generate a unique local ID but don't send to backend
        localId: `field-${Date.now()}`
      };

      // Insert the new field at the specified index
      const updatedFields = [...formData.fields];
      updatedFields.splice(result.destination.index, 0, newField);

      // Update the form data
      setFormData((prev) => ({
        ...prev,
        fields: updatedFields,
      }));
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleRemoveField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const onDragEnd = (result) => {
    setIsDraggingOver(false);
    
    // Handle drops from the sidebar to form fields
    if (result.source.droppableId.includes("-components") && 
        result.destination?.droppableId === "fields") {
      handleFieldDrop(result);
      return;
    }
    
    // Handle reordering within form fields (main editor)
    if (result.source.droppableId === "fields" && 
        result.destination?.droppableId === "fields") {
      const fields = Array.from(formData.fields);
      const [reorderedField] = fields.splice(result.source.index, 1);
      fields.splice(result.destination.index, 0, reorderedField);

      const updatedFields = fields.map((field, index) => ({
        ...field,
        orderIndex: index,
      }));

      setFormData((prev) => ({ ...prev, fields: updatedFields }));
      return; // Important: return after handling
    }

    // Handle reordering within sidebar "Form Fields" tab
    if (result.source.droppableId === "sidebar-form-fields" &&
        result.destination?.droppableId === "sidebar-form-fields") {
      const fields = Array.from(formData.fields);
      const [reorderedField] = fields.splice(result.source.index, 1);
      fields.splice(result.destination.index, 0, reorderedField);
      
      const updatedFields = fields.map((field, index) => ({
        ...field,
        orderIndex: index, // Keep orderIndex consistent if you use it for main display
      }));
      
      setFormData((prev) => ({ ...prev, fields: updatedFields }));
    }
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      setIsDraggingOver(false);
      return;
    }
    setIsDraggingOver(update.destination.droppableId === "fields");
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formData.fields];
    const fieldOptions = [...(updatedFields[fieldIndex].options || [])];
    
    if (typeof fieldOptions[optionIndex] === 'string') {
      // Convert string options to objects if they aren't already
      fieldOptions[optionIndex] = { 
        label: value, 
        value: value, 
        image: null, 
        nextQuestionId: null,
        isEnd: false
      };
    } else if (typeof value === 'string') {
      // Simple string update to label and value
      fieldOptions[optionIndex].label = value;
      fieldOptions[optionIndex].value = value;
    } else {
      // Object update with multiple properties
      fieldOptions[optionIndex] = { 
        ...fieldOptions[optionIndex], 
        ...value 
      };
    }

    // If isEnd is true, nullify nextQuestionId
    if (fieldOptions[optionIndex].isEnd) {
      fieldOptions[optionIndex].nextQuestionId = null;
    }
    
    updatedFields[fieldIndex].options = fieldOptions;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...formData.fields];
    const fieldOptions = [...(updatedFields[fieldIndex].options || [])];
    
    // Create a new option object instead of just a string
    const newOption = { 
      label: `Option ${fieldOptions.length + 1}`, 
      value: `Option ${fieldOptions.length + 1}`, 
      image: null, 
      nextQuestionId: null,
      isEnd: false
    };
    
    // Convert any existing string options to objects
    const updatedOptions = fieldOptions.map(option => 
      typeof option === 'string' 
        ? { label: option, value: option, image: null, nextQuestionId: null, isEnd: false }
        : { ...option, isEnd: option.isEnd || false }
    );
    
    updatedOptions.push(newOption);
    updatedFields[fieldIndex].options = updatedOptions;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formData.fields];
    const fieldOptions = [...(updatedFields[fieldIndex].options || [])];
    fieldOptions.splice(optionIndex, 1);
    updatedFields[fieldIndex].options = fieldOptions;
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleToggleField = (index, forceExpand = null) => {
    const updatedFields = [...formData.fields];
    const currentExpansionState = updatedFields[index].isExpanded;
    updatedFields[index] = {
      ...updatedFields[index],
      isExpanded: forceExpand !== null ? forceExpand : !currentExpansionState,
    };
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleToggleFieldTab = (index) => {
    // Ensure the field is expanded in the main editor
    const field = formData.fields[index];
    if (!field.isExpanded) {
      handleToggleField(index, true); // Force expand
    }

    // Scroll to the field in the main editor
    // The Draggable in the main editor needs a unique ID
    const draggableId = field.id ? `field-${field.id}` : field.localId ? `field-${field.localId}` : `field-${index}`;
    
    setTimeout(() => { // Use setTimeout to allow DOM to update
      const element = document.getElementById(draggableId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" }); // "center" or "start"
         // Optional: Add a visual cue, like a brief highlight
         element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2', 'transition-shadow', 'duration-1000', 'ease-out');
         setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2', 'transition-shadow', 'duration-1000', 'ease-out');
         }, 1000); // Remove highlight after 1 second
      } else {
        console.warn(`Scroll target element not found: #${draggableId}`);
        // Fallback: try to scroll to the parent disclosure panel if specific field not found
        const panelElement = element?.closest('.disclosure-panel-fields'); // Add a class to your Disclosure.Panel for fields
        if (panelElement) {
            panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100); // Small delay
  };

  const handleOptionImageUpload = async (e, fieldIndex, optionIndex) => {
    const uploadKey = `field-${fieldIndex}-option-${optionIndex}`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      const updatedFields = [...formData.fields];
      const options = updatedFields[fieldIndex].options;
      const option = options[optionIndex];
      
      const imageObj = {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId
      };
      
      // Update the image in the option object
      if (typeof option === "string") {
        // Convert string option to object
        options[optionIndex] = {
          label: option,
          value: option,
          image: imageObj,
          nextQuestionId: null
        };
      } else {
        // Update existing object
        options[optionIndex] = {
          ...option,
          image: imageObj
        };
      }
      
      setFormData((prev) => ({ ...prev, fields: updatedFields }));
      return;
    }

    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("addToMediaLibrary", "true");
    uploadFormData.append("setAsInUse", "true");

    try {
      const { data } = await http.post("/uploadfile", uploadFormData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId
      };
      
      const updatedFields = [...formData.fields];
      const options = updatedFields[fieldIndex].options;
      const option = options[optionIndex];
      
      // Update the image in the option object
      if (typeof option === "string") {
        // Convert string option to object
        options[optionIndex] = {
          label: option,
          value: option,
          image: imageObj,
          nextQuestionId: null
        };
      } else {
        // Update existing object
        options[optionIndex] = {
          ...option,
          image: imageObj
        };
      }
      
      setFormData((prev) => ({ ...prev, fields: updatedFields }));
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to upload image.";
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: errorMessage },
      }));
      toast.error(errorMessage);
    }
  };

  const handleRemoveOptionImage = async (fieldIndex, optionIndex) => {
    const uploadKey = `field-${fieldIndex}-option-${optionIndex}`;
    const updatedFields = [...formData.fields];
    const options = updatedFields[fieldIndex].options;
    const option = options[optionIndex];
    
    if (typeof option === "object" && option.image && option.image._id && !option.image.fromMediaLibrary) {
      try {
        await http.delete(`/deletefile?fileName=${option.image._id}`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.warn("Could not delete image from server, but removed from option");
      }
    }
    
    if (typeof option === "object") {
      // Keep all option properties, just update the image to null
      options[optionIndex] = {
        ...option,
        image: null
      };
    } else {
      // Convert string to object with null image
      options[optionIndex] = {
        label: option,
        value: option,
        image: null,
        nextQuestionId: null
      };
    }
    
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        fields: formData.fields.map((field, index) => {
          // Create a clean copy
          const cleanField = { ...field, orderIndex: index };
          
          // Remove frontend-only properties
          delete cleanField.isExpanded;
          
          // Process options to ensure nextQuestionId is valid
          if (cleanField.options && Array.isArray(cleanField.options)) {
            cleanField.options = cleanField.options.map(option => {
              if (typeof option === "object") {
                const cleanOption = { ...option };
                
                // Convert temporary nextQuestionId strings to null
                if (cleanOption.nextQuestionId && 
                    (typeof cleanOption.nextQuestionId === 'string' && 
                     cleanOption.nextQuestionId.startsWith('temp-'))) {
                  cleanOption.nextQuestionId = null;
                }
                
                return cleanOption;
              }
              return option;
            });
          }
          
          return cleanField;
        }),
      };

      // Submit the form
      if (isEditMode) {
      console.log('submissionData--->', submissionData)
        await updateForm(id, submissionData);
        toast.success("Form updated successfully");
        queryClient.invalidateQueries('adminForms');
      } else {
        await createForm(submissionData);
        toast.success("Form created successfully");
        queryClient.invalidateQueries('adminForms');
        router.push("/admin/forms");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error(error.response?.data?.error || "Failed to save form");
      setLoading(false);
    }
  };

  const openFieldSettings = (field, index) => {
    setCurrentField({...field, index});
    setShowFieldSettings(true);
  };

  const updateFieldSettings = (updatedField) => {
    const index = updatedField.index;
    delete updatedField.index; // Remove the temporary index property before saving

    const updatedFields = [...formData.fields];
    updatedFields[index] = updatedField;
    setFormData(prev => ({
      ...prev,
      fields: updatedFields
    }));
    
    setShowFieldSettings(false);
    setCurrentField(null);
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader animate-spin border-4 border-t-4 rounded-full h-12 w-12 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Function to get field options with conditional branching logic
  const getFieldOptions = (fieldIndex) => {
    // Filter out the current field and get other question fields
    return formData.fields
      .filter((field, idx) => 
        idx !== fieldIndex && 
        field.type === 'question'
      )
      .map((field, idx) => ({
        // Use the real ID if available, otherwise create a temporary ID
        value: field.id ? field.id.toString() : `temp-${idx}`,
        label: field.label || `Question ${idx + 1}`
      }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="flex flex-col lg:flex-row">
        <div
          className={`flex-grow transition-all duration-300 ${
            sidebarVisible ? "lg:pr-[280px]" : ""
          }`}
        >
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Form Information */}
              <Disclosure defaultOpen>
                {({ open }) => (
                  <Card>
                    <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                      <span className="text-lg font-medium text-gray-900">
                        Form Information
                      </span>
                      <Icon
                        icon="ChevronDown"
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-primary-500 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 py-5 text-sm text-gray-500">
                      <div className="space-y-4">
                        <Textinput
                          label="Title"
                          name="title"
                          placeholder="Form Title"
                          value={formData.title}
                          onChange={handleTitleChange}
                          required
                        />
                        <Textinput
                          label="Slug"
                          name="slug"
                          placeholder="form-slug"
                          value={formData.slug}
                          onChange={handleChange}
                          required
                        />
                        <Textarea
                          label="Description"
                          name="description"
                          placeholder="Brief description of this form"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />
                        <Select
                          label="Status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          options={[
                            { value: "draft", label: "Draft" },
                            { value: "published", label: "Published" },
                          ]}
                        />
                      </div>
                    </Disclosure.Panel>
                  </Card>
                )}
              </Disclosure>

              {/* Form Fields */}
              <Disclosure defaultOpen>
                {({ open }) => (
                  <Card>
                    <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                      <span className="text-lg font-medium text-gray-900">
                        Form Fields
                      </span>
                      <Icon
                        icon="ChevronDown"
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-primary-500 transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 py-5 text-sm text-gray-500 disclosure-panel-fields">
                      <div className="mb-6">
                        <div className="text-sm mb-4">
                          <p className="text-gray-700">
                            Drag fields from the sidebar onto the form or use the dropdown below to add new fields.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Add Field
                            </label>
                            <Select
                              placeholder="Select field type..."
                              options={fieldTypes.map(type => ({ value: type.type, label: type.label }))}
                              onChange={(e) => handleAddField(e.target.value)}
                              value=""
                            />
                          </div>
                        </div>

                        <Droppable droppableId="fields">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`space-y-4 min-h-[200px] border-2 rounded-lg p-4 ${
                                snapshot.isDraggingOver
                                  ? "border-primary-500 bg-primary-50"
                                  : isDraggingOver
                                  ? "border-primary-300 bg-primary-50 border-dashed"
                                  : formData.fields.length === 0
                                  ? "border-gray-300 border-dashed"
                                  : "border-gray-200"
                              }`}
                            >
                              {formData.fields.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                  <Icon icon="Squares2X2" className="h-10 w-10 mb-3" />
                                  <p className="text-center">
                                    Drag and drop form fields here from the sidebar
                                  </p>
                                </div>
                              )}
                              
                              {formData.fields.map((field, index) => (
                                <Draggable
                                  key={field.id || field.localId || `field-${index}`}
                                  draggableId={field.id ? `field-${field.id}` : field.localId || `field-${index}`}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="border border-gray-200 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                    >
                                      <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center flex-grow">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="flex items-center cursor-move mr-3 text-gray-400 hover:text-gray-600"
                                          >
                                            <Icon icon="Bars3" />
                                          </div>
                                          <span className="font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm">
                                            {field.label ||
                                              `${
                                                field.type.charAt(0).toUpperCase() +
                                                field.type.slice(1)
                                              } Field`}
                                          </span>
                                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                                            {fieldTypes.find(t => t.type === field.type)?.label || field.type}
                                          </span>
                                          {field.isRequired && (
                                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                              Required
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            type="button"
                                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                            onClick={() => handleToggleField(index)}
                                            aria-expanded={field.isExpanded}
                                          >
                                            <Icon
                                              icon={
                                                field.isExpanded
                                                  ? "ChevronUp"
                                                  : "ChevronDown"
                                              }
                                              className="h-5 w-5"
                                            />
                                          </button>
                                          <button
                                            type="button"
                                            className="p-1.5 !text-primary-500 hover:bg-primary-50 rounded-full transition-colors"
                                            onClick={() => openFieldSettings(field, index)}
                                          >
                                            <Icon icon="Cog" className="h-5 w-5" />
                                          </button>
                                          <button
                                            type="button"
                                            className="p-1.5 !text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            onClick={() => handleRemoveField(index)}
                                          >
                                            <Icon icon="XMark" className="h-5 w-5" />
                                          </button>
                                        </div>
                                      </div>

                                      {field.isExpanded && (
                                        <div className="space-y-3 pt-3 border-t">
                                          <Textinput
                                            label="Label"
                                            value={field.label || ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                index,
                                                "label",
                                                e.target.value
                                              )
                                            }
                                            placeholder="e.g., First Name"
                                          />
                                          
                                          <Textinput
                                            label="Placeholder"
                                            value={field.placeholder || ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                index,
                                                "placeholder",
                                                e.target.value
                                              )
                                            }
                                            placeholder="e.g., Enter your first name"
                                          />
                                          
                                          <div className="flex items-center">
                                            <input
                                              type="checkbox"
                                              className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                              checked={field.isRequired || false}
                                              onChange={(e) =>
                                                handleFieldChange(
                                                  index,
                                                  "isRequired",
                                                  e.target.checked
                                                )
                                              }
                                              id={`required-${index}`}
                                            />
                                            <label
                                              htmlFor={`required-${index}`}
                                              className="text-sm text-gray-700"
                                            >
                                              Required Field
                                            </label>
                                          </div>
                                          
                                          {/* {field.type === "file" && (
                                            <div className="flex items-center">
                                              <input
                                                type="checkbox"
                                                className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                                checked={field.isExpired || false}
                                                onChange={(e) =>
                                                  handleFieldChange(
                                                    index,
                                                    "isExpired",
                                                    e.target.checked
                                                  )
                                                }
                                                id={`expired-${index}`}
                                              />
                                              <label
                                                htmlFor={`expired-${index}`}
                                                className="text-sm text-gray-700"
                                              >
                                                Has Expiration Date
                                              </label>
                                            </div>
                                          )} */}
                                          
                                          <Textarea
                                            label="Field Note"
                                            value={field.note || ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                index,
                                                "note",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Additional notes about this field"
                                            rows={2}
                                          />

                                          {/* Options for select, radio, checkbox fields */}
                                          {["select", "radio", "checkbox", "question"].includes(field.type) && (
                                            <div className="mt-4 border-t pt-4">
                                              <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-medium text-gray-700">
                                                  {field.type === "question" ? "Question Options" : "Options"}
                                                </h3>
                                                <button
                                                  type="button"
                                                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                                  onClick={() => handleAddOption(index)}
                                                >
                                                  <span className="flex items-center">
                                                    <Icon icon="Plus" className="h-4 w-4 mr-1" />
                                                    Add Option
                                                  </span>
                                                </button>
                                              </div>
                                              
                                              <div className="space-y-3">
                                                {(field.options || []).map((option, optionIndex) => {
                                                  const optionLabel = typeof option === "object" ? option.label : option;
                                                  const optionImage = typeof option === "object" ? option.image : null;
                                                  const nextQuestionId = typeof option === "object" ? option.nextQuestionId : null;
                                                  const isEnd = typeof option === "object" ? option.isEnd || false : false;
                                                  const uploadKey = `field-${index}-option-${optionIndex}`;
                                                  
                                                  return (
                                                    <div key={optionIndex} className="flex flex-col space-y-2 p-3 border border-gray-200 rounded-lg">
                                                      <div className="flex items-center">
                                                        <input
                                                          type="text"
                                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                          value={optionLabel}
                                                          onChange={(e) =>
                                                            handleOptionChange(
                                                              index,
                                                              optionIndex,
                                                              typeof option === "object" 
                                                                ? { ...option, label: e.target.value, value: e.target.value }
                                                                : e.target.value
                                                            )
                                                          }
                                                        />
                                                        <button
                                                          type="button"
                                                          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full"
                                                          onClick={() => handleRemoveOption(index, optionIndex)}
                                                        >
                                                          <Icon icon="XMark" className="h-4 w-4" />
                                                        </button>
                                                      </div>
                                                      
                                                      {/* Option image upload (for radio/checkbox/question options) */}
                                                      {(field.type === "radio" || field.type === "question") && (
                                                        <div>
                                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Option Image (Optional)
                                                          </label>
                                                          <MediaUpload
                                                            file={optionImage}
                                                            onDrop={(e) => handleOptionImageUpload(e, index, optionIndex)}
                                                            onRemove={() => handleRemoveOptionImage(index, optionIndex)}
                                                            loading={uploadStates[uploadKey]?.loading}
                                                            error={uploadStates[uploadKey]?.error}
                                                            identifier={{ fieldIndex: index, optionIndex }}
                                                          />
                                                        </div>
                                                      )}
                                                      
                                                      {/* Conditional logic for this option */}
                                                      {field.type === "question" && (
                                                        <div>
                                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Next Question If Selected 
                                                            {/* {JSON.stringify(option)} */}
                                                          </label>
                                                          <Select
                                                            placeholder="Select next question..."
                                                            options={[
                                                              { value: "", label: "Default (next in sequence)" },
                                                              ...getFieldOptions(index)
                                                            ]}
                                                            value={typeof option === "object" && option.nextQuestionId && !isEnd ? 
                                                              (typeof option.nextQuestionId === 'string' ? option.nextQuestionId : option.nextQuestionId?.toString()) : 
                                                              ""}
                                                            onChange={(e) => {
                                                              const value = e.target.value;
                                                              const nextQId = value ? (value.startsWith('temp-') ? value : parseInt(value)) : null;
                                                              if (typeof option === "object") {
                                                                handleOptionChange(index, optionIndex, { ...option, nextQuestionId: nextQId });
                                                              } else {
                                                                handleOptionChange(index, optionIndex, { 
                                                                  label: option, 
                                                                  value: option,
                                                                  nextQuestionId: nextQId,
                                                                  isEnd: false
                                                                });
                                                              }
                                                            }}
                                                            disabled={isEnd}
                                                          />
                                                          <p className={`mt-1 text-xs ${isEnd ? 'text-gray-400' : 'text-gray-500'}`}>
                                                         
                                                         
                                                            {isEnd 
                                                              ? "This option ends the question flow; 'Next Question' is disabled." 
                                                              : "When this option is selected, the form will jump to the specified question."}
                                                          </p>

                                                          <div className="mt-2 flex items-center">
                                                            <input
                                                              type="checkbox"
                                                              className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                                              checked={isEnd}
                                                              onChange={(e) => {
                                                                const newIsEnd = e.target.checked;
                                                                const updatedOptionData = typeof option === "object" 
                                                                  ? { ...option, isEnd: newIsEnd, nextQuestionId: newIsEnd ? null : option.nextQuestionId }
                                                                  : { label: option, value: option, image: null, nextQuestionId: null, isEnd: newIsEnd };
                                                                handleOptionChange(index, optionIndex, updatedOptionData);
                                                              }}
                                                              id={`isEnd-${index}-${optionIndex}`}
                                                            />
                                                            <label
                                                              htmlFor={`isEnd-${index}-${optionIndex}`}
                                                              className="text-xs text-gray-700"
                                                            >
                                                              Mark as End of Question Flow (shows normal form fields next)
                                                            </label>
                                                          </div>
                                                          {isEnd && (
                                                            <p className="mt-1 text-xs text-blue-600 bg-blue-50 p-1 rounded">
                                                              Selecting this option will display the main form fields.
                                                            </p>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </Disclosure.Panel>
                  </Card>
                )}
              </Disclosure>

              {/* Field Settings Modal */}
              <Transition show={showFieldSettings} as={Fragment}>
                <Dialog 
                  as="div" 
                  className="relative z-10" 
                  onClose={() => setShowFieldSettings(false)}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Field Settings
                          </Dialog.Title>
                          
                          {currentField && (
                            <div className="mt-4 space-y-4">
                              <Textinput
                                label="Label"
                                value={currentField.label || ""}
                                onChange={(e) => setCurrentField({...currentField, label: e.target.value})}
                                placeholder="e.g., First Name"
                              />
                              
                              <Textinput
                                label="Placeholder"
                                value={currentField.placeholder || ""}
                                onChange={(e) => setCurrentField({...currentField, placeholder: e.target.value})}
                                placeholder="e.g., Enter your first name"
                              />
                              
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                  checked={currentField.isRequired || false}
                                  onChange={(e) => setCurrentField({...currentField, isRequired: e.target.checked})}
                                  id="modal-required"
                                />
                                <label
                                  htmlFor="modal-required"
                                  className="text-sm text-gray-700"
                                >
                                  Required Field
                                </label>
                              </div>
                              
                              {/* {currentField.type === "file" && (
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                    checked={currentField.isExpired || false}
                                    onChange={(e) => setCurrentField({...currentField, isExpired: e.target.checked})}
                                    id="modal-expired"
                                  />
                                  <label
                                    htmlFor="modal-expired"
                                    className="text-sm text-gray-700"
                                  >
                                    Has Expiration Date
                                  </label>
                                </div>
                              )} */}
                              
                              <Textarea
                                label="Field Note"
                                value={currentField.note || ""}
                                onChange={(e) => setCurrentField({...currentField, note: e.target.value})}
                                placeholder="Additional notes about this field"
                                rows={2}
                              />
                            </div>
                          )}

                          <div className="mt-6 flex justify-end space-x-3">
                            <Button
                              text="Cancel"
                              className="btn-outline-dark"
                              onClick={() => setShowFieldSettings(false)}
                            />
                            <Button
                              text="Save Settings"
                              className="btn-primary"
                              onClick={() => updateFieldSettings(currentField)}
                            />
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>

              {/* Action Buttons */}
              <div className="bg-white p-4 border border-gray-200 rounded-lg mt-6 sticky bottom-0 z-10 shadow-md">
                <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0">
                  <Button
                    text="Cancel"
                    className="btn-outline-dark"
                    icon="XMark"
                    onClick={() => router.push("/admin/forms")}
                  />
                  {/* <Button
                    text="Preview Form"
                    className="btn-info"
                    icon="Eye"
                    onClick={handlePreview}
                    type="button"
                  /> */}
                  <Button
                    text={isEditMode ? "Update Form" : "Create Form"}
                    className="btn-primary"
                    type="submit"
                    icon="Check"
                    isLoading={loading}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>

            {/* Preview Modal */}
            {/* <Modal
  title={formData.title || 'Form Preview'}
  open={isPreviewModalOpen}
  onClose={closePreviewModal}
  size="xl"
>
  <div className="p-4">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">{formData.title}</h2>
      <PreviewForm formData={formData} />
    </div>
  </div>
</Modal> */}

              </div>
            </div>
            {/* Form Fields Sidebar */}
            <div
              className={`fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out mt-[70px] ${
                sidebarVisible ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ width: "280px" }}
            >
              <div className="h-full overflow-y-auto">
                {/* Sidebar header with tabs */}
                <div className="flex items-center justify-between border-b">
                  <div className="flex" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "fields"}
                      onClick={() => setActiveTab("fields")}
                      className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                        activeTab === "fields" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Fields
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "form-fields"}
                      onClick={() => setActiveTab("form-fields")}
                      className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                        activeTab === "form-fields" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Form Fields
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-2 text-gray-500 hover:text-gray-900"
                  >
                    <Icon icon="XMark" className="h-5 w-5" />
                  </button>
                </div>
                {/* Field components */}
                <div className="p-4">
                  {activeTab === "fields" && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Input Fields</h3>
                      <Droppable droppableId="field-components" isDropDisabled={true}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {fieldTypes.map((field, index) => (
                              <Draggable
                                key={field.id}
                                draggableId={field.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`flex items-center p-3 rounded-lg border ${
                                      snapshot.isDragging ? "border-primary-500 bg-primary-50 shadow-md" : "border-gray-200 bg-white hover:bg-gray-50"
                                    } transition-all duration-150 cursor-grab`}
                                  >
                                    <div className="p-1.5 bg-gray-100 rounded-md mr-3">
                                      <Icon
                                        icon={field.icon}
                                        className="h-5 w-5 text-gray-600"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {field.label}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {field.description}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                  {activeTab === "form-fields" && (
                     <div className="space-y-3">
                       <h3 className="text-sm font-medium text-gray-800 mb-2">Current Form Fields</h3>
                       {formData.fields.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">
                            <Icon icon="Inbox" className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs">No fields added to the form yet.</p>
                            <p className="text-xs">Drag fields from the "Fields" tab or use "Add Field" dropdown.</p>
                          </div>
                       ) : (
                        <Droppable droppableId="sidebar-form-fields">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`space-y-2 min-h-[100px] rounded-md p-1 ${snapshot.isDraggingOver ? 'bg-primary-50' : ''}`}
                            >
                              {formData.fields.map((field, index) => (
                                <Draggable
                                  key={field.id || field.localId || `sidebar-field-${index}`}
                                  draggableId={field.id ? `sidebar-field-${field.id}` : field.localId ? `sidebar-local-${field.localId}` : `sidebar-new-${index}`}
                                  index={index}
                                >
                                  {(providedDraggable, snapshotDraggable) => (
                                    <div
                                      ref={providedDraggable.innerRef}
                                      {...providedDraggable.draggableProps}
                                      className={`flex items-center p-2.5 rounded-lg border ${
                                        snapshotDraggable.isDragging ? "border-primary-500 bg-primary-100 shadow-lg" : "border-gray-200 bg-white hover:bg-gray-50"
                                      } transition-all duration-150`}
                                    >
                                      <div
                                        {...providedDraggable.dragHandleProps}
                                        className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-move"
                                        aria-label="Drag to reorder field"
                                      >
                                        <Icon icon="Bars3" className="h-5 w-5" />
                                      </div>
                                      <div className="flex-grow overflow-hidden">
                                        <h4 className="text-xs font-medium text-gray-800 truncate" title={field.label || `Untitled ${field.type}`}>
                                          {field.label || `Untitled ${field.type.charAt(0).toUpperCase() + field.type.slice(1)}`}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                          Type: {fieldTypes.find(ft => ft.type === field.type)?.label || field.type}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleFieldTab(index)}
                                        className="ml-2 p-1.5 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                        aria-label="Edit field settings"
                                      >
                                        <Icon icon="PencilSquare" className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                       )}
                     </div>
                  )}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon icon="InformationCircle" className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Drag & Drop Fields</h3>
                        <p className="text-xs text-blue-700 mt-1">
                          Drag components from here and drop them into your form to add new fields.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar toggle button (visible on smaller screens when sidebar is hidden) */}
            {!sidebarVisible && (
              <button
                onClick={toggleSidebar}
                className="fixed bottom-6 right-6 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
              >
                <Icon icon="Squares2X2" className="h-6 w-6 text-gray-500" />
              </button>
            )}
          </div>
    
    </DragDropContext>
  );
};
export default FormForm;