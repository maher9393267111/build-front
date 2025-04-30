'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Textinput from '@components/ui/Textinput';
import Select from '@components/ui/Select';
import Textarea from '@components/ui/Textarea';
import { toast } from 'react-toastify';
import { createBlockTemplate, updateBlockTemplate, getBlockTemplates } from '@services/api';
import Icon from '@components/ui/Icon'; // Assuming Icon component exists

const BlockTemplateForm = ({ id }) => {
  const isEditMode = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Default content structures based on type
  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return { heading: '', subheading: '', buttonText: '', buttonLink: '', backgroundColor: '', textDirection: 'left', imageUrl: '' };
      case 'features':
        return { sectionTitle: '', features: [{ icon: '', title: '', description: '' }] };
      case 'cta':
        return { heading: '', description: '', buttonText: '', buttonLink: '', bgStyle: 'color' };
      case 'content':
        return { sectionTitle: '', html: '' };
      case 'faq':
        return { sectionTitle: '', faqs: [{ question: '', answer: '' }] };
      case 'slider':
        return { sectionTitle: '', slides: [{ imageUrl: '', altText: '', caption: '' }] };
      case 'testimonials':
        return { sectionTitle: '', testimonials: [{ quote: '', authorName: '', authorTitle: '' }] };
      // Add defaults for other types: pricing, stats, team, contact
      case 'pricing':
        return { sectionTitle: '', plans: [{ name: '', price: '', features: [''], buttonText: '', buttonLink: '' }] };
      case 'stats':
         return { sectionTitle: '', stats: [{ value: '', label: '' }] };
      case 'team':
         return { sectionTitle: '', members: [{ name: '', role: '', imageUrl: '', bio: '' }] };
      case 'contact':
         return { sectionTitle: '', formFields: ['name', 'email', 'message'], submitButtonText: 'Send Message' };
      default:
        return {};
    }
  };
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'hero', // Default type
    content: getDefaultContent('hero'), // Initialize with default content for the default type
    status: 'active'
  });

  useEffect(() => {
    if (isEditMode) {
      loadTemplate();
    } else {
      // Ensure content matches initial type if not editing
      setFormData(prev => ({ ...prev, content: getDefaultContent(prev.type) }));
      setInitialLoad(false);
    }
  }, [id]); // Rerun if id changes

  const loadTemplate = async () => {
    try {
      setLoading(true);
      // Assuming getBlockTemplates fetches all and we find by id client-side
      // Optimize this if you have a getBlockTemplateById endpoint
      const templates = await getBlockTemplates();
      const template = templates.find(t => t.id === parseInt(id));
      
      if (template) {
        setFormData({
          name: template.name,
          type: template.type,
          // Ensure loaded content is not null/undefined, merge with defaults?
          // For simplicity, directly use loaded content. Add defaults if missing later if needed.
          content: template.content || getDefaultContent(template.type), 
          status: template.status
        });
        // Remove setContentStr
      } else {
        toast.error('Template not found.');
        router.push('/admin/blocks');
      }
      
      setLoading(false);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template data');
      setLoading(false);
      setInitialLoad(false);
      router.push('/admin/blocks');
    }
  };

  // Handles changes in top-level fields (name, type, status)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      // If type changes, reset content to default for that type
      if (name === 'type') {
        newState.content = getDefaultContent(value);
      }
      return newState;
    });
  };

  // Handles changes in direct content fields (e.g., heading, sectionTitle)
  const handleContentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };
  
  // Handles changes within the *first* item of an array in content (e.g., features[0].title)
  const handleItemChange = (arrayFieldName, itemIndex, itemField, value) => {
    // In templates, we usually edit only the first item (index 0) as the blueprint
    if (itemIndex !== 0) return; 

    setFormData(prev => {
      const currentItems = prev.content[arrayFieldName] || [];
      // Ensure the array and the first item exist
      if (currentItems.length === 0) {
         // This case shouldn't happen if getDefaultContent is correct, but safeguard it
         console.warn(`Attempted to edit item in empty array: ${arrayFieldName}`);
         return prev; // Or initialize the array with one item here
      }
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        [itemField]: value
      };
      
      return {
        ...prev,
        content: {
          ...prev.content,
          [arrayFieldName]: updatedItems
        }
      };
    });
  };

  // Simplified handler for array item changes specifically for templates (index 0)
  const handleTemplateItemChange = (arrayFieldName, itemField, value) => {
     handleItemChange(arrayFieldName, 0, itemField, value);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // No need to parse JSON from contentStr anymore
    
    try {
      setLoading(true);
      const dataToSave = { ...formData }; // Use the formData directly
      
      if (isEditMode) {
        await updateBlockTemplate(id, dataToSave);
        toast.success('Block template updated successfully');
      } else {
        await createBlockTemplate(dataToSave);
        toast.success('Block template created successfully');
      }
      
      router.push('/admin/blocks');
    } catch (error) {
      console.error('Error saving template:', error);
      // Attempt to parse potential backend error message
      const errorMessage = error.response?.data?.message || 'Failed to save template';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const blockTypeOptions = [
    { value: 'hero', label: 'Hero Banner' },
    { value: 'features', label: 'Features' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'content', label: 'Content Block' },
    { value: 'faq', label: 'FAQ Section' },
    { value: 'slider', label: 'Image Slider' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'pricing', label: 'Pricing Table' },
    { value: 'stats', label: 'Statistics' },
    { value: 'team', label: 'Team Members' },
    { value: 'contact', label: 'Contact Form' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  if (initialLoad) {
    // ... loading spinner ...
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader animate-spin border-4 border-t-4 rounded-full h-12 w-12 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <Card title="Block Template Information">
          <div className="space-y-4">
            <Textinput
              label="Template Name"
              name="name"
              placeholder="Enter template name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Select
              label="Block Type"
              name="type"
              value={formData.type}
              onChange={handleChange} // This now also resets content
              options={blockTypeOptions}
              required
            />
            
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
            
            {/* --- Dynamic Content Fields based on Type --- */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-lg font-medium mb-3">Default Content Structure</h4>
              <div className="space-y-3">

                {/* --- HERO --- */}
                {formData.type === 'hero' && (
                  <>
                    <Textinput label="Default Heading" value={formData.content.heading || ''} onChange={(e) => handleContentChange('heading', e.target.value)} />
                    <Textarea label="Default Subheading" value={formData.content.subheading || ''} onChange={(e) => handleContentChange('subheading', e.target.value)} rows={2} />
                    <Textinput label="Default Button Text" value={formData.content.buttonText || ''} onChange={(e) => handleContentChange('buttonText', e.target.value)} />
                    <Textinput label="Default Button Link" value={formData.content.buttonLink || ''} onChange={(e) => handleContentChange('buttonLink', e.target.value)} />
                    <Textinput label="Default Background Color" value={formData.content.backgroundColor || ''} onChange={(e) => handleContentChange('backgroundColor', e.target.value)} />
                    <Select label="Default Text Direction" value={formData.content.textDirection || 'left'} onChange={(e) => handleContentChange('textDirection', e.target.value)} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'center', label: 'Center' }]} />
                    <Textinput label="Default Image URL" value={formData.content.imageUrl || ''} onChange={(e) => handleContentChange('imageUrl', e.target.value)} />
                  </>
                )}

                {/* --- FEATURES --- */}
                {formData.type === 'features' && (
                  <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                      <p className="text-sm font-medium text-slate-600">Default Feature Item Structure:</p>
                      <Textinput label="Icon" placeholder="e.g., CheckCircleIcon" value={formData.content.features?.[0]?.icon || ''} onChange={(e) => handleTemplateItemChange('features', 'icon', e.target.value)} />
                      <Textinput label="Title" value={formData.content.features?.[0]?.title || ''} onChange={(e) => handleTemplateItemChange('features', 'title', e.target.value)} />
                      <Textarea label="Description" value={formData.content.features?.[0]?.description || ''} onChange={(e) => handleTemplateItemChange('features', 'description', e.target.value)} rows={2} />
                    </div>
                     <p className="text-xs text-slate-500 mt-1">Define the fields for a single feature. Users can add more features when using the template.</p>
                  </>
                )}
                
                {/* --- CTA --- */}
                {formData.type === 'cta' && (
                   <>
                    <Textinput label="Default Heading" value={formData.content.heading || ''} onChange={(e) => handleContentChange('heading', e.target.value)} />
                    <Textarea label="Default Description" value={formData.content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} rows={2} />
                    <Textinput label="Default Button Text" value={formData.content.buttonText || ''} onChange={(e) => handleContentChange('buttonText', e.target.value)} />
                    <Textinput label="Default Button Link" value={formData.content.buttonLink || ''} onChange={(e) => handleContentChange('buttonLink', e.target.value)} />
                    <Select label="Default Background Style" value={formData.content.bgStyle || 'color'} onChange={(e) => handleContentChange('bgStyle', e.target.value)} options={[{ value: 'color', label: 'Solid Color' }, { value: 'image', label: 'Background Image' }, { value: 'gradient', label: 'Gradient' }]} />
                     {/* Add inputs for color/image/gradient based on bgStyle if needed */}
                  </>
                )}

                {/* --- CONTENT --- */}
                {formData.type === 'content' && (
                  <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <Textarea label="Default HTML Content" value={formData.content.html || ''} onChange={(e) => handleContentChange('html', e.target.value)} rows={10} />
                  </>
                )}

                {/* --- FAQ --- */}
                {formData.type === 'faq' && (
                   <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                      <p className="text-sm font-medium text-slate-600">Default FAQ Item Structure:</p>
                      <Textinput label="Question" value={formData.content.faqs?.[0]?.question || ''} onChange={(e) => handleTemplateItemChange('faqs', 'question', e.target.value)} />
                      <Textarea label="Answer" value={formData.content.faqs?.[0]?.answer || ''} onChange={(e) => handleTemplateItemChange('faqs', 'answer', e.target.value)} rows={3} />
                    </div>
                     <p className="text-xs text-slate-500 mt-1">Define the fields for a single FAQ. Users can add more FAQs when using the template.</p>
                  </>
                )}

                {/* --- SLIDER --- */}
                {formData.type === 'slider' && (
                   <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                     {/* Add default slider settings here if applicable */}
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                      <p className="text-sm font-medium text-slate-600">Default Slide Structure:</p>
                      <Textinput label="Image URL" value={formData.content.slides?.[0]?.imageUrl || ''} onChange={(e) => handleTemplateItemChange('slides', 'imageUrl', e.target.value)} />
                      <Textinput label="Alt Text" value={formData.content.slides?.[0]?.altText || ''} onChange={(e) => handleTemplateItemChange('slides', 'altText', e.target.value)} />
                      <Textarea label="Caption" value={formData.content.slides?.[0]?.caption || ''} onChange={(e) => handleTemplateItemChange('slides', 'caption', e.target.value)} rows={2} />
                       {/* <Textinput label="Link URL" value={formData.content.slides?.[0]?.linkUrl || ''} onChange={(e) => handleTemplateItemChange('slides', 'linkUrl', e.target.value)} /> */}
                    </div>
                     <p className="text-xs text-slate-500 mt-1">Define the fields for a single slide. Users can add more slides when using the template.</p>
                  </>
                )}

                {/* --- TESTIMONIALS --- */}
                {formData.type === 'testimonials' && (
                  <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                      <p className="text-sm font-medium text-slate-600">Default Testimonial Structure:</p>
                      <Textarea label="Quote" value={formData.content.testimonials?.[0]?.quote || ''} onChange={(e) => handleTemplateItemChange('testimonials', 'quote', e.target.value)} rows={3} />
                      <Textinput label="Author Name" value={formData.content.testimonials?.[0]?.authorName || ''} onChange={(e) => handleTemplateItemChange('testimonials', 'authorName', e.target.value)} />
                      <Textinput label="Author Title/Company" value={formData.content.testimonials?.[0]?.authorTitle || ''} onChange={(e) => handleTemplateItemChange('testimonials', 'authorTitle', e.target.value)} />
                       {/* <Textinput label="Author Image URL" value={formData.content.testimonials?.[0]?.imageUrl || ''} onChange={(e) => handleTemplateItemChange('testimonials', 'imageUrl', e.target.value)} /> */}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Define the fields for a single testimonial. Users can add more when using the template.</p>
                  </>
                )}

                {/* Add similar blocks for pricing, stats, team, contact */}
                {/* --- PRICING --- */}
                {formData.type === 'pricing' && (
                  <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                       <p className="text-sm font-medium text-slate-600">Default Pricing Plan Structure:</p>
                       <Textinput label="Plan Name" value={formData.content.plans?.[0]?.name || ''} onChange={(e) => handleTemplateItemChange('pricing', 'name', e.target.value)} />
                       <Textinput label="Price" value={formData.content.plans?.[0]?.price || ''} onChange={(e) => handleTemplateItemChange('pricing', 'price', e.target.value)} />
                       <Textarea label="Features (one per line)" value={(formData.content.plans?.[0]?.features || []).join('\n')} onChange={(e) => handleTemplateItemChange('pricing', 'features', e.target.value.split('\n'))} rows={3} />
                       <Textinput label="Button Text" value={formData.content.plans?.[0]?.buttonText || ''} onChange={(e) => handleTemplateItemChange('pricing', 'buttonText', e.target.value)} />
                       <Textinput label="Button Link" value={formData.content.plans?.[0]?.buttonLink || ''} onChange={(e) => handleTemplateItemChange('pricing', 'buttonLink', e.target.value)} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Define the fields for a single pricing plan. Users can add more when using the template.</p>
                  </>
                )}
                 {/* --- STATS --- */}
                {formData.type === 'stats' && (
                  <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                       <p className="text-sm font-medium text-slate-600">Default Stat Item Structure:</p>
                       <Textinput label="Value" value={formData.content.stats?.[0]?.value || ''} onChange={(e) => handleTemplateItemChange('stats', 'value', e.target.value)} />
                       <Textinput label="Label" value={formData.content.stats?.[0]?.label || ''} onChange={(e) => handleTemplateItemChange('stats', 'label', e.target.value)} />
              </div>
                    <p className="text-xs text-slate-500 mt-1">Define the fields for a single statistic. Users can add more when using the template.</p>
                  </>
                )}
                {/* --- TEAM --- */}
                {formData.type === 'team' && (
                   <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    <div className="border p-3 rounded bg-slate-50 space-y-2 mt-2">
                       <p className="text-sm font-medium text-slate-600">Default Team Member Structure:</p>
                       <Textinput label="Name" value={formData.content.members?.[0]?.name || ''} onChange={(e) => handleTemplateItemChange('team', 'name', e.target.value)} />
                       <Textinput label="Role" value={formData.content.members?.[0]?.role || ''} onChange={(e) => handleTemplateItemChange('team', 'role', e.target.value)} />
                       <Textinput label="Image URL" value={formData.content.members?.[0]?.imageUrl || ''} onChange={(e) => handleTemplateItemChange('team', 'imageUrl', e.target.value)} />
                       <Textarea label="Bio" value={formData.content.members?.[0]?.bio || ''} onChange={(e) => handleTemplateItemChange('team', 'bio', e.target.value)} rows={2} />
                </div>
                     <p className="text-xs text-slate-500 mt-1">Define the fields for a single team member. Users can add more when using the template.</p>
                  </>
                )}
                 {/* --- CONTACT --- */}
                 {formData.type === 'contact' && (
                   <>
                    <Textinput label="Default Section Title" value={formData.content.sectionTitle || ''} onChange={(e) => handleContentChange('sectionTitle', e.target.value)} />
                    {/* Maybe allow configuring which fields appear? For now, just a submit button text default */}
                     <Textinput label="Default Submit Button Text" value={formData.content.submitButtonText || 'Send Message'} onChange={(e) => handleContentChange('submitButtonText', e.target.value)} />
                     {/* Could add fields for default recipient email etc. */}
                  </>
                 )}

            </div>
            </div>
            
            {/* Removed the JSON Textarea and its label/description */}

          </div>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            text="Cancel"
            className="btn-outline-dark"
            onClick={() => router.push('/admin/blocks')}
          />
          <Button
            text={isEditMode ? 'Update Template' : 'Create Template'}
            className="btn-primary"
            type="submit"
            isLoading={loading}
            disabled={loading} // Disable button while loading
          />
        </div>
      </div>
    </form>
  );
};

export default BlockTemplateForm; 