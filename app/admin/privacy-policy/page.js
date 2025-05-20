'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getPrivacyPolicy, updatePrivacyPolicy } from '@services/api';
import http from '@services/api/http';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Textinput from '@components/ui/TextinputBlog'; // Assuming this can be reused
import TipTapEditor from '@components/TipTapEditor'; // Assuming you have a reusable Tiptap component
import MediaUpload from '@components/ui/MediaUpload';
import { useQuery, useMutation } from 'react-query';

export default function PrivacyPolicyAdminPage() {
  const [editorContent, setEditorContent] = useState('');
  const [uploadStates, setUploadStates] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    defaultValues: {
      seoTitle: '',
      description: '',
      heroSubTitle: '',
      heroImage: null
    },
  });

  const { isLoading } = useQuery('privacyPolicy', getPrivacyPolicy, {
    onSuccess: (data) => {
      if (data) {
        reset(data);
        setEditorContent(data.description || '');
      }
    },
    onError: (error) => {
      console.error('Error fetching privacy policy:', error);
      toast.error('Failed to load privacy policy');
    }
  });

  const updateMutation = useMutation(updatePrivacyPolicy, {
    onSuccess: () => {
      toast.success('Privacy Policy updated successfully');
    },
    onError: (error) => {
      console.error('Error saving privacy policy:', error);
      toast.error('Failed to save privacy policy');
    }
  });

  const handleHeroImageUpload = async (e) => {
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      const imageObj = { _id: mediaFile._id, url: mediaFile.url, fromMediaLibrary: true, mediaId: mediaFile.mediaId };
      setValue('heroImage', imageObj);
      return;
    }
    
    const file = e.target?.files?.[0];
    if (!file) return;
    
    setUploadStates((prev) => ({ ...prev, heroImage: { loading: true, error: null } }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('addToMediaLibrary', 'true');
    formData.append('setAsInUse', 'true');
    
    try {
      const { data } = await http.post('/uploadfile', formData);
      const imageObj = { _id: data._id, url: data.url, fromMediaLibrary: data.fromMediaLibrary || false, mediaId: data.mediaId };
      setValue('heroImage', imageObj);
      setUploadStates((prev) => ({ ...prev, heroImage: { loading: false, error: null } }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to upload image.';
      setUploadStates((prev) => ({ ...prev, heroImage: { loading: false, error: errorMessage } }));
    }
  };

  const handleRemoveHeroImage = async (isFromLibrary = false) => {
    const heroImage = watch('heroImage');
    if (heroImage && heroImage._id && !isFromLibrary && !heroImage.fromMediaLibrary) {
      try { 
        await http.delete(`/deletefile?fileName=${heroImage._id}`); 
      } catch (error) { 
        console.error('Delete failed:', error); 
      }
    }
    setValue('heroImage', null);
    setUploadStates((prev) => ({ ...prev, heroImage: { loading: false, error: null } }));
  };

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      description: editorContent,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Card title="Manage Privacy Policy" className="max-w-4xl mx-auto mt-6 mb-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Textinput
              label="SEO Title"
              name="seoTitle"
              placeholder="Enter SEO title for Privacy Policy"
              error={errors.seoTitle?.message}
              {...register('seoTitle')}
            />
          </div>
          <div>
            <Textinput
              label="Hero Subtitle"
              name="heroSubTitle"
              placeholder="Enter subtitle for the hero section"
              error={errors.heroSubTitle?.message}
              {...register('heroSubTitle')}
            />
            <p className="mt-1 text-xs text-gray-500">
              This will appear as a subtitle in the header of the privacy policy page.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Image
          </label>
          <MediaUpload 
            file={watch('heroImage')} 
            onDrop={handleHeroImageUpload} 
            onRemove={(_, isFromLibrary) => handleRemoveHeroImage(isFromLibrary)} 
            loading={uploadStates.heroImage?.loading} 
            error={uploadStates.heroImage?.error}
            identifier="heroImage"
            helperText="Recommended size: 1200x400px. This image will be displayed at the top of the privacy policy page."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Markdown Supported)
          </label>
          <TipTapEditor
            content={editorContent}
            onChange={setEditorContent} // Pass callback to update state
            placeholder="Enter the privacy policy details here..."
          />
          {/* You might want to add error display for description if needed */}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            text="Save Privacy Policy"
            className="btn-primary"
            disabled={updateMutation.isLoading}
            isLoading={updateMutation.isLoading}
          />
        </div>
      </form>
    </Card>
  );
} 