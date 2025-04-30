"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition, Tab, Disclosure } from "@headlessui/react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Textinput from "@components/ui/Textinput";
import Select from "@components/ui/Select";
import Textarea from "@components/ui/Textarea";
import { toast } from "react-toastify";
import {
  createPage,
  updatePage,
  getPageById,
  getBlockTemplates,
} from "@services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Icon from "@components/ui/Icon";
import http from "@services/api/http";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Quill modules configuration (you can customize this)
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ]
};

function FileUpload({
  file,
  onDrop,
  onRemove,
  loading,
  error,
  maxSize,
  identifier,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } };
      onDrop(event, identifier);
    }
  };

  const handleInputChange = (e) => {
    onDrop(e, identifier);
  };

  const handleBoxClick = () => {
    if (!loading) fileInputRef.current.click();
  };

  const getFileSize = (size) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const fileUrl = file?.url || null;
  const fileSize = file?.size || 0;
  const fileName = file?.name || "Uploaded Image";

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />
      {!fileUrl ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors min-h-[100px] cursor-pointer
            ${
              isDragging
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 bg-white"
            }
            ${error ? "border-red-400 bg-red-50" : ""}
            ${loading ? "opacity-50 pointer-events-none" : ""}
          `}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-xs text-center">
            Drag & drop or{" "}
            <span className="text-primary-500 font-semibold">
              click to upload
            </span>
          </p>
          {maxSize && (
            <p className="text-xs text-gray-400 mt-1">
              Max {getFileSize(maxSize)}.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center border rounded-lg p-2 bg-gray-50 relative">
          <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-gray-100 mr-3">
            <img
              src={fileUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-gray-700 text-sm truncate">
              {fileName}
            </div>
            {fileSize > 0 && (
              <div className="text-xs text-gray-400">
                {getFileSize(fileSize)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(identifier)}
            className="ml-2 p-1.5 rounded-full hover:bg-red-100 text-red-600 transition absolute top-1 right-1"
            aria-label="Remove"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const PageForm = ({ id }) => {
  const ICON_OPTIONS = [
    { label: "CheckCircle", value: "CheckCircle" },
    { label: "Bolt", value: "Bolt" },
    { label: "LightBulb", value: "LightBulb" },
    { label: "Wrench", value: "Wrench" },
    { label: "Cog", value: "Cog" },
    { label: "Fire", value: "Fire" },
    { label: "Home", value: "Home" },
    { label: "Star", value: "Star" },
  ];

  const isEditMode = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesByType, setTemplatesByType] = useState({});
  const [uploadStates, setUploadStates] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [blockPreview, setBlockPreview] = useState({
    show: false,
    blockIndex: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaKeywords: "",
    status: "draft",
    blocks: [],
  });

  useEffect(() => {
    // loadBlockTemplates();
    if (isEditMode) {
      loadPage();
    }
  }, [id]);

  const loadBlockTemplates = async () => {
    try {
      const data = await getBlockTemplates();
      setTemplates(data);

      const templateMap = {};
      data.forEach((template) => {
        if (!templateMap[template.type]) {
          templateMap[template.type] = [];
        }
        templateMap[template.type].push(template);
      });
      setTemplatesByType(templateMap);
    } catch (error) {
      console.error("Error loading block templates:", error);
      toast.error("Failed to load block templates");
    }
  };

  const loadPage = async () => {
    try {
      // setLoading(true);
      const data = await getPageById(id);
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        metaTitle: data.metaTitle || "",
        metaKeywords: data.metaKeywords || "",
        ogImage: data.ogImage || "",
        status: data.status,
        blocks: (data.blocks || []).map((block) => ({
          ...block,
          isExpanded: false,
        })),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading page:", error);
      toast.error("Failed to load page data");
      setLoading(false);
      router.push("/admin/pages");
    }
  };

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

  const handleAddBlock = (type) => {
    const newBlock = {
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
      content: {},
      orderIndex: formData.blocks.length,
      isExpanded: true,
    };

    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  };

  const handleAddTemplateBlock = (templateId) => {
    const template = templates.find((t) => t.id === parseInt(templateId));
    if (!template) return;

    const newBlock = {
      type: template.type,
      title: template.name,
      content: { ...template.content },
      orderIndex: formData.blocks.length,
      templateId: template.id,
      isExpanded: true,
    };

    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  };

  const handleBlockChange = (index, field, value) => {
    const updatedBlocks = [...formData.blocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleBlockContentChange = (index, contentField, value) => {
    const updatedBlocks = [...formData.blocks];
    if (!updatedBlocks[index]) {
        updatedBlocks[index] = { content: {} };
    } else if (!updatedBlocks[index].content) {
        updatedBlocks[index].content = {};
    }

    updatedBlocks[index].content = {
        ...updatedBlocks[index].content,
        [contentField]: value,
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleRemoveBlock = (index) => {
    const updatedBlocks = formData.blocks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const blocks = Array.from(formData.blocks);
    const [reorderedBlock] = blocks.splice(result.source.index, 1);
    blocks.splice(result.destination.index, 0, reorderedBlock);

    const updatedBlocks = blocks.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));

    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        blocks: formData.blocks.map((block) => {
          return { ...block, content: block.content || {} };
        }),
      };

      if (isEditMode) {
        await updatePage(id, submissionData);
        toast.success("Page updated successfully");
      } else {
        await createPage(submissionData);
        toast.success("Page created successfully");
      }

      router.push("/admin/pages");
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error(`Failed to save page: ${error.message || "Unknown error"}`);
      setLoading(false);
    }
  };

  const blockTypeOptions = [
    { value: "hero", label: "Hero Banner" },
    { value: "features", label: "Features" },
    { value: "cta", label: "Call to Action" },
    { value: "content", label: "Content Block" },
    { value: "faq", label: "FAQ Section" },
    { value: "slider", label: "Image Slider" },
    { value: "testimonials", label: "Testimonials" },
    { value: "products", label: "Products" },
    { value: "blocktextimage", label: "Text & Image Block" },
    { value: "about", label: "About Block" },
    { value: "video", label: "Video Block" },
  ];

  const getTemplateOptions = () => {
    const options = [];
    Object.keys(templatesByType).forEach((type) => {
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      const templates = templatesByType[type];

      if (templates.length > 0) {
        options.push({
          label: `${typeLabel} Templates`,
          options: templates.map((template) => ({
            value: template.id.toString(),
            label: template.name,
          })),
        });
      }
    });
    return options;
  };

  const handleAddItem = (blockIndex, arrayFieldName, newItemTemplate) => {
    const updatedBlocks = [...formData.blocks];
    const blockContent = updatedBlocks[blockIndex].content || {};
    const currentItems = blockContent[arrayFieldName] || [];
    updatedBlocks[blockIndex].content = {
      ...blockContent,
      [arrayFieldName]: [...currentItems, newItemTemplate],
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleRemoveItem = (blockIndex, arrayFieldName, itemIndex) => {
    const updatedBlocks = [...formData.blocks];
    const blockContent = updatedBlocks[blockIndex].content || {};
    const currentItems = blockContent[arrayFieldName] || [];

    if (arrayFieldName === "slides") {
      const itemToRemove = currentItems[itemIndex];
      if (itemToRemove?.imageUrl?._id) {
        handleRemoveSlideImage({ blockIndex, slideIndex: itemIndex }, false);
      }
    }

    updatedBlocks[blockIndex].content = {
      ...blockContent,
      [arrayFieldName]: currentItems.filter((_, i) => i !== itemIndex),
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleItemChange = (
    blockIndex,
    arrayFieldName,
    itemIndex,
    itemField,
    value
  ) => {
    const updatedBlocks = [...formData.blocks];
    const blockContent = updatedBlocks[blockIndex].content || {};
    const currentItems = blockContent[arrayFieldName] || [];
    const updatedItems = [...currentItems];

    if (!updatedItems[itemIndex]) {
      updatedItems[itemIndex] = {};
    }

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [itemField]: value,
    };
    updatedBlocks[blockIndex].content = {
      ...blockContent,
      [arrayFieldName]: updatedItems,
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleSlideImageUpload = async (e, identifier) => {
    const file = e.target.files[0];
    if (!file || !identifier) return;

    const { blockIndex, slideIndex } = identifier;
    const uploadKey = `${blockIndex}-${slideIndex}`;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = { _id: data._id, url: data.url };
      handleItemChange(blockIndex, "slides", slideIndex, "imageUrl", imageObj);
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


  const handleOgImageUpload = async (e, identifier) => {
    const file = e.target.files[0];
    if (!file || !identifier) return;

    setUploadStates((prev) => ({
      ...prev,
      [identifier]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use http instance for consistency
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = { _id: data._id, url: data.url };

      setFormData((prev) => ({
        ...prev,
        ogImage: imageObj,
      }));

      setUploadStates((prev) => ({
        ...prev,
        [identifier]: { loading: false, error: null },
      }));
    } catch (err) {
      console.error("Upload failed:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to upload image.";
      setUploadStates((prev) => ({
        ...prev,
        [identifier]: { loading: false, error: errorMessage },
      }));
      toast.error(errorMessage);
    }
  };

  const handleRemoveOgImage = async (identifier) => {
     // Set loading state for the specific identifier
    setUploadStates((prev) => ({
      ...prev,
      [identifier]: { loading: true, error: null },
    }));

    const currentOgImage = formData.ogImage;

    try {
      if (currentOgImage?._id) {
         // Use http instance and correct endpoint
        await http.delete(`/deletefile?fileName=${currentOgImage._id}`);
      }

      setFormData((prev) => ({
        ...prev,
        ogImage: null,
      }));
       // Clear loading and error for this identifier
       setUploadStates((prev) => ({
        ...prev,
        [identifier]: { loading: false, error: null },
      }));

    } catch (err) {
      console.error("Delete failed:", err);
       toast.warn("Could not delete image from server, but removed from page.");
       // Set error state for this identifier
       setUploadStates((prev) => ({
        ...prev,
        [identifier]: { loading: false, error: "Failed to delete image from server." },
      }));
    }
  };


  const handleRemoveSlideImage = async (identifier, updateState = true) => {
    const { blockIndex, slideIndex } = identifier;
    const uploadKey = `${blockIndex}-${slideIndex}`;
    const currentImageUrl =
      formData.blocks[blockIndex]?.content?.slides?.[slideIndex]?.imageUrl;

    if (currentImageUrl && currentImageUrl._id) {
      try {
        await http.delete(`/deletefile?fileName=${currentImageUrl._id}`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.warn(
          "Could not delete image from server, but removed from slide."
        );
      }
    }

    if (updateState) {
      handleItemChange(blockIndex, "slides", slideIndex, "imageUrl", null);
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    }
  };

  const handleHeroImageUpload = async (e, identifier) => {
    const file = e.target.files[0];
    if (!file || !identifier) return;

    const { blockIndex } = identifier;
    const uploadKey = `hero-${blockIndex}`;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = { _id: data._id, url: data.url };
      handleBlockContentChange(blockIndex, "imageUrl", imageObj);
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

  const handleRemoveHeroImage = async (identifier) => {
    const { blockIndex } = identifier;
    const uploadKey = `hero-${blockIndex}`;
    const currentImageUrl = formData.blocks[blockIndex]?.content?.imageUrl;

    if (currentImageUrl && currentImageUrl._id) {
      try {
        await http.delete(`/deletefile?fileName=${currentImageUrl._id}`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.warn(
          "Could not delete image from server, but removed from hero block."
        );
      }
    }

    handleBlockContentChange(blockIndex, "imageUrl", null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const handleToggleBlock = (index) => {
    const updatedBlocks = [...formData.blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      isExpanded: !updatedBlocks[index].isExpanded,
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));
  };

  const handleProductImageUpload = async (e, identifier) => {
    const file = e.target.files[0];
    if (!file || !identifier) return;

    const { blockIndex, productIndex } = identifier;
    const uploadKey = `product-${blockIndex}-${productIndex}`;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = { _id: data._id, url: data.url };
      handleItemChange(
        blockIndex,
        "products",
        productIndex,
        "imageUrl",
        imageObj
      );
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

  const handleRemoveProductImage = async (identifier) => {
    const { blockIndex, productIndex } = identifier;
    const uploadKey = `product-${blockIndex}-${productIndex}`;
    const currentImageUrl =
      formData.blocks[blockIndex]?.content?.products?.[productIndex]?.imageUrl;

    if (currentImageUrl && currentImageUrl._id) {
      try {
        await http.delete(`/deletefile?fileName=${currentImageUrl._id}`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.warn(
          "Could not delete image from server, but removed from product."
        );
      }
    }

    handleItemChange(blockIndex, "products", productIndex, "imageUrl", null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handleBlockPreviewToggle = (blockIndex) => {
    if (blockPreview.show && blockPreview.blockIndex === blockIndex) {
      setBlockPreview({ show: false, blockIndex: null });
    } else {
      setBlockPreview({ show: true, blockIndex });
    }
  };

  // const renderBlockPreview = (block) => {
  //   switch (block.type) {
  //     case "hero":
  //       return (
  //         <div
  //           className="relative bg-gray-100 h-96 md:h-[28rem] overflow-hidden flex items-center"
  //           style={{
  //             backgroundColor: block.content?.backgroundColor || "#f3f4f6",
  //           }}
  //         >
  //           {block.content?.imageUrl?.url && (
  //             <img
  //               src={block.content.imageUrl.url}
  //               alt="Hero Background"
  //               className="absolute inset-0 w-full h-full object-cover"
  //             />
  //           )}
  //           <div
  //             className={`relative z-10 container mx-auto px-4 ${
  //               block.content?.textDirection === "center"
  //                 ? "text-center"
  //                 : block.content?.textDirection === "right"
  //                 ? "text-right ml-auto"
  //                 : ""
  //             }`}
  //           >
  //             <div className="max-w-lg bg-whie/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
              
  //             style={{
  //               backgroundColor: block.content?.backgroundColor || "#f3f4f6",
  //             }}
  //             >
  //               <h1 
  //                 className="text-3xl font-bold mb-4"
  //                 style={{
  //                   color: block.content?.textColor || "#000000",
  //                 }}
  //               >
  //                 {block.content?.heading || "Hero Heading"}
  //               </h1>
  //               <p 
  //                 className="text-lg mb-6"
  //                 style={{
  //                   color: block.content?.textColor || "#000000",
  //                 }}
  //               >
  //                 {block.content?.subheading ||
  //                   "Hero subheading text goes here"}
  //               </p>
  //               {block.content?.buttonText && (
  //                 <button 
  //                   className="hover:opacity-90 px-6 py-2 rounded-md transition-colors"
  //                   style={{
  //                     backgroundColor: block.content?.buttonBgColor || "#3b82f6",
  //                     color: block.content?.buttonTextColor || "#ffffff",
  //                   }}
  //                   onClick={() => {
  //                     if (block.content?.buttonLink) {
  //                       window.location.href = block.content.buttonLink;
  //                     }
  //                   }}
  //                 >
  //                   {block.content.buttonText}
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       );
  
  //     case "features":
  //       return (
  //         <div className="py-16 bg-white">
  //           <div className="container mx-auto px-4">
  //             <div className="max-w-3xl mx-auto text-center mb-14">
  //               <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                 {block.content?.sectionTitle || "Features"}
  //               </h2>
  //               {block.content?.sectionSubtitle && (
  //                 <p className="text-lg text-gray-600 mx-auto max-w-2xl">
  //                   {block.content.sectionSubtitle}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  //               {(block.content?.features || []).map((feature, i) => (
  //                 <div
  //                   key={i}
  //                   className="group p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden"
  //                 >
  //                   <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  //                   <div className="relative z-10">
  //                     <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300">
  //                       <Icon
  //                         icon={feature.icon || "CheckCircle"}
  //                         className="h-7 w-7 transform group-hover:scale-110 transition-transform"
  //                       />
  //                     </div>
  //                     <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
  //                       {feature.title || `Feature ${i + 1}`}
  //                     </h3>
  //                     <p className="text-gray-600">
  //                       {feature.description || "Feature description text"}
  //                     </p>
  //                     {feature.link && (
  //                       <div className="mt-5">
  //                         <a href={feature.link} className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group-hover:translate-x-1 transition-transform">
  //                           Learn more
  //                           <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  //                           </svg>
  //                         </a>
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     case "cta":
  //       return (
  //         <div
  //           className={`py-16 ${
  //             block.content?.bgStyle === "color"
  //               ? "bg-blue-600"
  //               : "bg-gray-800 bg-opacity-80"
  //           }`}
  //         >
  //           <div className="container mx-auto px-4 text-center">
  //             <h2 className="text-3xl font-bold text-white mb-4">
  //               {block.content?.heading || "Call to Action"}
  //             </h2>
  //             <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
  //               {block.content?.description ||
  //                 "Call to action description text"}
  //             </p>
  //             {block.content?.buttonText && (
  //               <button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
  //                 {block.content.buttonText}
  //               </button>
  //             )}
  //           </div>
  //         </div>
  //       );

  //     case "testimonials":
  //       const testimonialSwiperOptions = {
  //         modules: [Navigation, Pagination],
  //         slidesPerView: 1,
  //         spaceBetween: 30,
  //         loop: (block.content?.testimonials || []).length > 1,
  //         autoplay: {
  //           delay: 5000,
  //           disableOnInteraction: false,
  //         },
  //         pagination: {
  //           el: `.testimonial-pagination-${blockPreview.blockIndex}`,
  //           clickable: true,
  //           dynamicBullets: true,
  //         },
  //         navigation: {
  //           nextEl: `.testimonial-next-${blockPreview.blockIndex}`,
  //           prevEl: `.testimonial-prev-${blockPreview.blockIndex}`,
  //         },
  //         breakpoints: {
  //           768: {
  //             slidesPerView: 2,
  //             spaceBetween: 20,
  //           },
  //           1024: {
  //             slidesPerView: (block.content?.testimonials || []).length > 2 ? 3 : (block.content?.testimonials || []).length || 1,
  //             spaceBetween: 30,
  //           },
  //         },
  //       };

  //       return (
  //         <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
  //           <div className="container mx-auto px-4">
  //             <div className="text-center mb-12">
  //               <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                 {block.content?.sectionTitle || "Testimonials"}
  //               </h2>
  //               {block.content?.sectionSubtitle && (
  //                 <p className="text-gray-600 max-w-2xl mx-auto">
  //                   {block.content.sectionSubtitle}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="relative px-12">
  //               <Swiper {...testimonialSwiperOptions} className="pb-12">
  //                 {(block.content?.testimonials || []).map((testimonial, i) => (
  //                   <SwiperSlide key={i} className="h-full mb-5">
  //                     <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative">
  //                       <div className="absolute top-6 right-8 text-5xl text-primary-200 font-serif z-0 opacity-70">"</div>
  //                       <div className="relative z-10">
  //                         {testimonial.rating && (
  //                           <div className="flex mb-4">
  //                             {[...Array(5)].map((_, index) => (
  //                               <svg key={index} className={`w-5 h-5 ${index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
  //                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //                               </svg>
  //                             ))}
  //                           </div>
  //                         )}
                          
  //                         <p className="text-gray-700 mb-6 italic text-lg leading-relaxed flex-grow relative z-10">
  //                           {testimonial.quote || "Testimonial quote"}
  //                         </p>
                          
  //                         <div className="mt-auto pt-4 border-t border-gray-100 flex items-center">
  //                           {testimonial.avatar ? (
  //                             <img 
  //                               src={testimonial.avatar} 
  //                               alt={testimonial.authorName || "Client"} 
  //                               className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-100"
  //                             />
  //                           ) : (
  //                             <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4 text-primary-500">
  //                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  //                               </svg>
  //                             </div>
  //                           )}
  //                           <div>
  //                             <p className="font-medium text-gray-900">
  //                               {testimonial.authorName || "Client Name"}
  //                             </p>
  //                             <p className="text-sm text-gray-600">
  //                               {testimonial.authorTitle || "Position, Company"}
  //                             </p>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </SwiperSlide>
  //                 ))}
  //               </Swiper>
  //               {(block.content?.testimonials || []).length > 1 && (
  //                 <>
  //                   <button
  //                     className={`testimonial-prev-${blockPreview.blockIndex} absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all border border-gray-100`}
  //                     aria-label="Previous testimonial"
  //                   >
  //                     <Icon icon="ChevronLeft" className="h-5 w-5" />
  //                   </button>
  //                   <button
  //                     className={`testimonial-next-${blockPreview.blockIndex} absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all border border-gray-100`}
  //                     aria-label="Next testimonial"
  //                   >
  //                     <Icon icon="ChevronRight" className="h-5 w-5" />
  //                   </button>
  //                 </>
  //               )}
  //               {(block.content?.testimonials || []).length > 1 && (
  //                 <div className={`testimonial-pagination-${blockPreview.blockIndex} flex justify-center space-x-2 mt-6 [&>.swiper-pagination-bullet]:w-2.5 [&>.swiper-pagination-bullet]:h-2.5 [&>.swiper-pagination-bullet]:bg-primary-300 [&>.swiper-pagination-bullet-active]:bg-primary-500`} />
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     case "content":
  //       return (
  //         <div className="py-12 bg-white">
  //           <div className="container mx-auto px-4">
  //             {block.content?.sectionTitle && (
  //               <h2 className="text-3xl font-bold text-center mb-8">
  //                 {block.content.sectionTitle}
  //               </h2>
  //             )}
  //             <div
  //               className="prose lg:prose-xl mx-auto"
  //               dangerouslySetInnerHTML={{
  //                 __html:
  //                   block.content?.html ||
  //                   "<p>Your content will appear here.</p>",
  //               }}
  //             />
  //           </div>
  //         </div>
  //       );

  //     case "faq":
  //       const faqs = block.content?.faqs || [];
  //       const categories = [
  //         ...new Set(faqs.map((f) => f.category || "Uncategorized")),
  //       ];

  //       return (
  //         <div className="py-16 bg-gray-50">
  //           <div className="container mx-auto px-4">
  //             <div className="max-w-3xl mx-auto text-center mb-12">
  //               <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                 {block.content?.sectionTitle || "Frequently Asked Questions"}
  //               </h2>
  //               {block.content?.sectionSubtitle && (
  //                 <p className="text-gray-600 max-w-2xl mx-auto">
  //                   {block.content.sectionSubtitle}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="max-w-3xl mx-auto space-y-10">
  //               {categories.map((category, catIndex) => (
  //                 <div key={catIndex}>
  //                   <h3 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-900">
  //                     {category}
  //                   </h3>
  //                   <div className="space-y-4">
  //                     {faqs
  //                       .filter((f) => (f.category || "Uncategorized") === category)
  //                       .map((faq, i) => (
  //                         <Disclosure as="div" key={i} className="mb-4">
  //                           {({ open }) => (
  //                             <>
  //                               <Disclosure.Button 
  //                                 className="flex w-full justify-between rounded-lg bg-white px-5 py-4 text-left text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200"
  //                               >
  //                                 <span>{faq.question || `Question ${i + 1}`}</span>
  //                                 <Icon
  //                                   icon="ChevronDown"
  //                                   className={`${
  //                                     open ? 'rotate-180 transform' : ''
  //                                   } h-5 w-5 text-primary-500 transition-transform duration-200`}
  //                                 />
  //                               </Disclosure.Button>
  //                               <Transition
  //                                 enter="transition duration-100 ease-out"
  //                                 enterFrom="transform scale-95 opacity-0"
  //                                 enterTo="transform scale-100 opacity-100"
  //                                 leave="transition duration-75 ease-out"
  //                                 leaveFrom="transform scale-100 opacity-100"
  //                                 leaveTo="transform scale-95 opacity-0"
  //                               >
  //                                 <Disclosure.Panel className="px-5 pt-4 pb-6 text-base text-gray-600 bg-white border-l border-r border-b rounded-b-lg">
  //                                   <div className="prose max-w-none">
  //                                     {faq.answer || "Answer to the question"}
  //                                   </div>
  //                                 </Disclosure.Panel>
  //                               </Transition>
  //                             </>
  //                           )}
  //                         </Disclosure>
  //                       ))}
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     case "slider":
  //       const sliderPreviewOptions = {
  //         modules: [Navigation, Pagination, Autoplay],
  //         slidesPerView: 1,
  //         spaceBetween: 30,
  //         loop: true,
  //         autoplay: {
  //           delay: 5000,
  //           disableOnInteraction: false,
  //         },
  //         pagination: {
  //           dynamicBullets: true,
  //           el: '.slider-pagination',
  //           clickable: true,
  //         },
  //         navigation: {
  //           nextEl: '.slider-next',
  //           prevEl: '.slider-prev',
  //         },
  //         breakpoints: {
  //           640: {
  //             slidesPerView: 2,
  //             spaceBetween: 20,
  //           },
  //           1024: {
  //             slidesPerView: 3, 
  //             spaceBetween: 30,
  //           },
  //         }
  //       };

  //       return (
  //         <div className="py-16 bg-white">
  //           <div className="container mx-auto px-4">
  //             {block.content?.sectionTitle && (
  //               <div className="mb-12 text-center">
  //                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                   {block.content.sectionTitle}
  //                 </h2>
  //                 {block.content?.sectionSubtitle && (
  //                   <p className="text-gray-600 max-w-2xl mx-auto">
  //                     {block.content.sectionSubtitle}
  //                   </p>
  //                 )}
  //               </div>
  //             )}
  //             <div className="relative px-12">
  //               <Swiper {...sliderPreviewOptions} className="pb-12">
  //                 {(block.content?.slides || []).map((slide, i) => (
  //                   <SwiperSlide key={i} className="h-full mb-5">
  //                     <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-white border border-gray-100 group">
  //                       <div className="relative overflow-hidden h-64">
  //                         {slide.imageUrl?.url ? (
  //                           <img
  //                             src={slide.imageUrl.url}
  //                             alt={slide.altText || `Slide ${i + 1}`}
  //                             className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
  //                           />
  //                         ) : (
  //                           <div className="w-full h-full bg-gray-100 flex items-center justify-center">
  //                             <span className="text-gray-400 flex flex-col items-center">
  //                               <Icon icon="Photo" className="h-10 w-10 mb-2" />
  //                               No image
  //                             </span>
  //                           </div>
  //                         )}
  //                         {slide.badge && (
  //                           <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
  //                             {slide.badge}
  //                           </div>
  //                         )}
  //                       </div>
  //                       <div className="p-6 flex-1 flex flex-col">
  //                         {slide.title && (
  //                           <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
  //                             {slide.title}
  //                           </h3>
  //                         )}
  //                         {slide.caption && (
  //                           <p className="text-gray-600 flex-grow">
  //                             {slide.caption}
  //                           </p>
  //                         )}
  //                         {slide.link && (
  //                           <div className="mt-4 pt-4 border-t border-gray-100">
  //                             <a 
  //                               href={slide.link} 
  //                               className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
  //                             >
  //                               Learn more
  //                               <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  //                               </svg>
  //                             </a>
  //                           </div>
  //                         )}
  //                       </div>
  //                     </div>
  //                   </SwiperSlide>
  //                 ))}
  //               </Swiper>
  //               <button 
  //                 className="slider-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all" 
  //                 aria-label="Previous slide"
  //               >
  //                 <Icon icon="ChevronLeft" className="h-5 w-5" />
  //               </button>
  //               <button 
  //                 className="slider-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all" 
  //                 aria-label="Next slide"
  //               >
  //                 <Icon icon="ChevronRight" className="h-5 w-5" />
  //               </button>
  //               <div className="slider-pagination text-center mt-8"></div>
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     case "products":
  //       return (
  //         <div className="py-16 bg-white">
  //           <div className="container mx-auto px-4">
  //             <div className="text-center mb-12">
  //               <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                 {block.content?.sectionTitle || "Products"}
  //               </h2>
  //               {block.content?.sectionSubtitle && (
  //                 <p className="text-gray-600 max-w-2xl mx-auto">
  //                   {block.content.sectionSubtitle}
  //                 </p>
  //               )}
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  //               {(block.content?.products || []).map((product, i) => (
  //                 <div
  //                   key={i}
  //                   className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full"
  //                 >
  //                   <div className="relative">
  //                     <a href={product.link || "#product"} className="block relative overflow-hidden h-64 bg-gray-100">
  //                       {product.imageUrl?.url ? (
  //                         <img
  //                           src={product.imageUrl.url}
  //                           alt={product.title || `Product ${i + 1}`}
  //                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  //                         />
  //                       ) : (
  //                         <div className="w-full h-full flex items-center justify-center">
  //                           <span className="text-gray-400 flex flex-col items-center">
  //                             <Icon icon="ShoppingBag" className="h-12 w-12 mb-2" />
  //                             Product image
  //                           </span>
  //                         </div>
  //                       )}
  //                       {product.badge && (
  //                         <div className="absolute top-4 left-4 bg-primary-500 text-white text-sm font-medium py-1 px-3 rounded-full z-10">
  //                           {product.badge} 
  //                         </div>
  //                       )}
  //                     </a>
  //                   </div>
                    
  //                   <div className="p-6 flex-grow flex flex-col">
  //                     <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
  //                       {product.title || `Product ${i + 1}`}
  //                     </h3>
                      
  //                     {product.description && (
  //                       <div
  //                         className="text-gray-600 mb-4 flex-grow"
  //                         dangerouslySetInnerHTML={{
  //                           __html: product.description,
  //                         }}
  //                       />
  //                     )}
                      
  //                     <div className="mt-auto pt-4 border-t border-gray-100">
  //                       <div className="flex items-center justify-between">
  //                         {product.price && (
  //                           <span className="text-lg font-bold text-gray-900">
  //                             {product.price}€ 
  //                           </span>
  //                         )}
                          
  //                         <a 
  //                           href={product.link || "#product"} 
  //                           className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium"
  //                         >
  //                           <span>View Details</span>
  //                           <svg
  //                             xmlns="http://www.w3.org/2000/svg"
  //                             className="h-4 w-4 ml-2"
  //                             fill="none"
  //                             viewBox="0 0 24 24"
  //                             stroke="currentColor"
  //                           >
  //                             <path
  //                               strokeLinecap="round"
  //                               strokeLinejoin="round"
  //                               strokeWidth={2}
  //                               d="M9 5l7 7-7 7"
  //                             />
  //                           </svg>
  //                         </a>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
              
  //             {block.content?.showViewAllButton && (
  //               <div className="text-center mt-12">
  //                 <a 
  //                   href={block.content?.viewAllLink || "#all-products"} 
  //                   className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-3 md:px-8 transition-colors"
  //                 >
  //                   {block.content?.viewAllText || "View All Products"}
  //                 </a>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       );




  //     case "blocktextimage":
  //       return (
  //         <div 
  //           className="py-16 relative" 
  //           style={{ 
  //             backgroundColor: block.content?.backgroundColor || "#f8f9fa" 
  //           }}
  //         >
  //           {block.content?.hasPattern && (
  //             <div className="absolute inset-0 opacity-10 overflow-hidden">
  //               <div className="absolute -right-60 -top-40">
  //                 <div className="w-96 h-96 rounded-full bg-primary-500 opacity-20"></div>
  //               </div>
  //               <div className="absolute -left-20 -bottom-40">
  //                 <div className="w-72 h-72 rounded-full bg-primary-500 opacity-30"></div>
  //               </div>
  //             </div>
  //           )}
  //           <div className="container mx-auto px-4 relative z-10">
  //             <div className={`flex flex-col ${block.content?.imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} -mx-4 items-center gap-10`}>
  //               <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0">
  //                 {block.content?.subTitle && (
  //                   <div className="text-primary-600 font-semibold text-sm mb-2 uppercase tracking-wider">
  //                     {block.content.subTitle}
  //                   </div>
  //                 )}
  //                 <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
  //                   {block.content?.mainTitle || "Main Title"}
  //                 </h2>
  //                 <div 
  //                   className="prose prose-lg max-w-none mb-8 text-gray-600" 
  //                   dangerouslySetInnerHTML={{
  //                     __html: block.content?.mainDescription || "<p>Your description will appear here.</p>"
  //                   }}
  //                 />
                  
  //                 {(block.content?.features || []).length > 0 && (
  //                   <div className="mb-8 space-y-4">
  //                     {(block.content?.features || []).map((feature, i) => (
  //                       <div key={i} className="flex group">
  //                         <div className="mr-4 text-primary-500 flex-shrink-0 mt-1">
  //                           <Icon icon={feature.icon || "CheckCircle"} className="h-6 w-6" />
  //                         </div>
  //                         <div>
  //                           <h3 className="font-semibold text-gray-900">{feature.title}</h3>
  //                           <p className="text-gray-600">{feature.description}</p>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 )}
                  
  //                 <div className="flex flex-wrap gap-4">
  //                   {block.content?.buttonText && (
  //                     <button 
  //                       className="px-6 py-3 rounded-lg inline-block font-medium shadow hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2" 
  //                       style={{
  //                         backgroundColor: block.content?.buttonBgColor || "#dd3333",
  //                         color: block.content?.buttonTextColor || "#ffffff",
  //                         boxShadow: "0 4px 6px rgba(221, 51, 51, 0.25)"
  //                       }}
  //                     >
  //                       {block.content.buttonText}
  //                     </button>
  //                   )}
                    
  //                   {block.content?.secondaryButtonText && (
  //                     <button 
  //                       className="px-6 py-3 rounded-lg inline-block font-medium border-2 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
  //                       style={{
  //                         borderColor: block.content?.buttonBgColor || "#dd3333",
  //                         color: block.content?.buttonBgColor || "#dd3333",
  //                       }}
  //                     >
  //                       {block.content.secondaryButtonText}
  //                     </button>
  //                   )}
  //                 </div>
                  
  //                 {block.content?.customHtml && (
  //                   <div 
  //                     className="mt-8"
  //                     dangerouslySetInnerHTML={{
  //                       __html: block.content.customHtml
  //                     }}
  //                   />
  //                 )}
  //               </div>
  //               <div className="px-4 w-full md:w-1/2">
  //                 <div className="relative">
  //                   <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-20"></div>
  //                   <div className="relative rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.02]">
  //                     {block.content?.imageUrl?.url ? (
  //                       <img
  //                         src={block.content.imageUrl.url}
  //                         alt={block.content?.mainTitle || "Image"}
  //                         className="w-full h-auto rounded-xl shadow-lg"
  //                       />
  //                     ) : (
  //                       <div className="bg-gray-100 rounded-xl flex items-center justify-center h-80 border-2 border-dashed border-gray-300">
  //                         <span className="text-gray-500 flex flex-col items-center">
  //                           <Icon icon="Photo" className="h-12 w-12 mb-2 text-gray-400" />
  //                           No image uploaded
  //                         </span>
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       );

  //     case "about":
  //       return (
  //         <div className="py-16 bg-white">
  //           <div className="container mx-auto px-4">
  //             <div className="flex flex-col md:flex-row -mx-4 items-center gap-10">
  //               <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0 relative">
  //                 {block.content?.imageUrl?.url ? (
  //                   <div className="relative group">
  //                     <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
  //                     <div className="relative">
  //                       <img
  //                         src={block.content.imageUrl.url}
  //                         alt={block.content?.title || "About Image"}
  //                         className="w-full h-auto rounded-lg shadow-lg"
  //                       />
  //                       {block.content?.yearsDescription && (
  //                         <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
  //                           <div className="flex items-center">
  //                             {block.content?.icon && (
  //                               <div className="mr-3">
  //                                 <Icon icon={block.content.icon || "CheckCircle"} className="h-6 w-6 text-primary-500" />
  //                               </div>
  //                             )}
  //                             <span className="font-bold text-gray-800">{block.content.yearsDescription}</span>
  //                           </div>
  //                         </div>
  //                       )}
  //                     </div>
  //                   </div>
  //                 ) : (
  //                   <div className="bg-gray-100 rounded-lg h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 group hover:bg-gray-200 transition-colors duration-300">
  //                     <span className="text-gray-500 flex flex-col items-center">
  //                       <Icon icon="Photo" className="h-12 w-12 mb-2 text-gray-400" />
  //                       No image uploaded
  //                     </span>
  //                   </div>
  //                 )}
  //               </div>
  //               <div className="px-4 w-full md:w-1/2">
  //                 {block.content?.subTitle && (
  //                   <div className="mb-2 text-primary-500 font-medium uppercase tracking-wider">
  //                     {block.content.subTitle}
  //                   </div>
  //                 )}
  //                 <h2 className="text-3xl font-bold mb-6 leading-tight">
  //                   {block.content?.title || "We Care About After Care."}
  //                 </h2>
  //                 <div 
  //                   className="prose prose-lg max-w-none mb-8 text-gray-600" 
  //                   dangerouslySetInnerHTML={{
  //                     __html: block.content?.description || "<p>Your description will appear here.</p>"
  //                   }}
  //                 />
                  
  //                 {(block.content?.features || []).length > 0 && (
  //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //                     {(block.content?.features || []).map((feature, i) => (
  //                       <div key={i} className="flex group hover:bg-gray-50 p-3 rounded-lg transition-colors">
  //                         <div className="mr-4 text-primary-500 flex-shrink-0 mt-1">
  //                           <Icon icon={feature.icon || "CheckCircle"} className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
  //                         </div>
  //                         <div>
  //                           <h3 className="font-semibold mb-2 text-gray-800">{feature.title || `Feature ${i + 1}`}</h3>
  //                           <p className="text-gray-600">{feature.description || "Feature description"}</p>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 )}
                  
  //                 {(block.content?.listItems || []).length > 0 && (
  //                   <ul className="list-none pl-0 space-y-3 text-gray-700 mb-8">
  //                     {(block.content?.listItems || []).map((item, i) => (
  //                       <li key={i} className="flex items-start group">
  //                         <div className="mr-3 text-primary-500 pt-1 flex-shrink-0">
  //                           <Icon icon="CheckCircle" className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
  //                         </div>
  //                         <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.text || `Item ${i + 1}`}</span>
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 )}
                  
  //                 {block.content?.buttonText && (
  //                   <button 
  //                     className="px-8 py-3 rounded-full inline-block font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" 
  //                     style={{
  //                       backgroundColor: block.content?.buttonBgColor || "#dd3333",
  //                       color: block.content?.buttonTextColor || "#ffffff"
  //                     }}
  //                   >
  //                     {block.content.buttonText}
  //                   </button>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       );

  //       case "video":
  //         return (
  //           <div className="py-16 bg-white relative overflow-hidden">
  //             {block.content?.hasPattern && (
  //               <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
  //                 <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-primary-200"></div>
  //                 <div className="absolute -left-20 -bottom-40 w-64 h-64 rounded-full bg-primary-200"></div>
  //               </div>
  //             )}
  //             <div className="container mx-auto px-4 relative z-10">
  //               {block.content?.title && (
  //                 <div className="text-center mb-12">
  //                   <h2 className="text-3xl md:text-4xl font-bold mb-4">
  //                     {block.content.title}
  //                   </h2>
  //                   {block.content?.subtitle && (
  //                     <p className="text-gray-600 max-w-2xl mx-auto">
  //                       {block.content.subtitle}
  //                     </p>
  //                   )}
  //                 </div>
  //               )}
  //               <div className={`flex flex-col ${block.content?.videoPosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} -mx-4 items-center gap-12`}>
  //                 <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0">
  //                   {block.content?.eyebrow && (
  //                     <div className="text-primary-600 font-semibold text-sm mb-3 uppercase tracking-wider">
  //                       {block.content.eyebrow}
  //                     </div>
  //                   )}
  //                   <Transition
  //                     show={true}
  //                     appear={true}
  //                     enter="transition ease-out duration-500"
  //                     enterFrom="opacity-0 translate-y-4"
  //                     enterTo="opacity-100 translate-y-0"
  //                     className="h-full"
  //                   >
  //                     <div className="h-full">
  //                       <div 
  //                         className="prose prose-lg max-w-none mb-8 text-gray-600" 
  //                         dangerouslySetInnerHTML={{
  //                           __html: block.content?.description || "<p>Your description will appear here.</p>"
  //                         }}
  //                       />
                        
  //                       {(block.content?.listItems || []).length > 0 && (
  //                         <ul className="list-none pl-0 space-y-4 text-gray-700 mb-8">
  //                           {(block.content?.listItems || []).map((item, i) => (
  //                             <li key={i} className="flex items-start group">
  //                               <div className="mr-3 text-primary-500 pt-1 flex-shrink-0">
  //                                 <Icon icon="CheckCircle" className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
  //                               </div>
  //                               <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.text || `Item ${i + 1}`}</span>
  //                             </li>
  //                           ))}
  //                         </ul>
  //                       )}
                        
  //                       <div className="flex flex-wrap gap-4 mt-8">
  //                         {block.content?.buttonText && (
  //                           <button 
  //                             className="px-6 py-3 rounded-lg inline-block font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
  //                             style={{
  //                               backgroundColor: block.content?.buttonBgColor || "#dd3333",
  //                               color: block.content?.buttonTextColor || "#ffffff"
  //                             }}
  //                           >
  //                             <span className="flex items-center">
  //                               {block.content?.buttonIcon && (
  //                                 <Icon icon={block.content.buttonIcon} className="mr-2 h-5 w-5" />
  //                               )}
  //                               {block.content.buttonText}
  //                             </span>
  //                           </button>
  //                         )}
                          
  //                         {block.content?.secondaryButtonText && (
  //                           <button 
  //                             className="px-6 py-3 rounded-lg inline-block font-medium border-2 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
  //                             style={{
  //                               borderColor: block.content?.buttonBgColor || "#dd3333",
  //                               color: block.content?.buttonBgColor || "#dd3333",
  //                             }}
  //                           >
  //                             {block.content.secondaryButtonText}
  //                           </button>
  //                         )}
  //                       </div>
  //                     </div>
  //                   </Transition>
  //                 </div>
  //                 <div className="px-4 w-full md:w-1/2">
  //                   <div className="relative">
  //                     <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-20"></div>
  //                     <Transition
  //                       show={true}
  //                       appear={true}
  //                       enter="transition ease-out duration-700 delay-100"
  //                       enterFrom="opacity-0 scale-95"
  //                       enterTo="opacity-100 scale-100"
  //                     >
  //                       <div className="relative rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.01]">
  //                         {block.content?.videoUrl ? (
  //                           <div className="rounded-xl overflow-hidden shadow-xl" style={{ height: "400px", minHeight: "350px" }}>
  //                             <iframe 
  //                               src={block.content.videoUrl} 
  //                               title={block.content?.title || "Video"} 
  //                               width="100%"
  //                               height="100%"
  //                               style={{ display: "block", width: "100%", height: "100%" }}
  //                               frameBorder="0" 
  //                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  //                               allowFullScreen
  //                             ></iframe>
  //                           </div>
  //                         ) : (
  //                           <div className="bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-200" style={{ height: "400px", minHeight: "350px" }}>
  //                             <span className="text-gray-500 flex flex-col items-center">
  //                               <Icon icon="Video" className="h-16 w-16 mb-4 text-gray-400" />
  //                               <span className="text-center max-w-xs px-4">
  //                                 No video URL provided.<br/>Add a YouTube or Vimeo URL.
  //                               </span>
  //                             </span>
  //                           </div>
  //                         )}
  //                       </div>
  //                     </Transition>
  //                     {block.content?.videoBadge && (
  //                       <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
  //                         {block.content.videoBadge}
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         );

  //     default:
  //       return (
  //         <div className="p-6 border rounded bg-gray-50">
  //           <p className="text-gray-500">
  //             Preview not available for this block type
  //           </p>
  //         </div>
  //       );
  //   }
  // };

  const renderPagePreview = () => {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-800 text-white py-3 px-4 sticky top-0 z-50 flex justify-between items-center">
          <h1 className="text-xl font-medium">
            {formData.title || "Untitled Page"}
          </h1>
          <button
            onClick={handlePreviewToggle}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Exit Preview
          </button>
        </div>

        <div className="preview-content">
          {formData.blocks.map((block, index) => (
            <div key={index} id={`block-${index}`} className="block-preview">
              {/* {renderBlockPreview(block)} */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader animate-spin border-4 border-t-4 rounded-full h-12 w-12 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (previewMode) {
    return renderPagePreview();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6"> {/* Added space-y-6 for spacing between accordions */}

        {/* Page Information Accordion */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <Card>
              <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                <span className="text-lg font-medium text-gray-900">Page Information</span>
                <Icon
                  icon="ChevronDown"
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-primary-500 transition-transform duration-200`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 py-5 text-sm text-gray-500">
                  <div className="space-y-4">
                    <Textinput
                      label="Title"
                      name="title"
                      placeholder="Page Title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      required
                    />
                    <Textinput
                      label="Slug"
                      name="slug"
                      placeholder="page-slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Page Description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
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
              </Transition>
            </Card>
          )}
        </Disclosure>

        {/* SEO Information Accordion */}
        <Disclosure>
          {({ open }) => (
            <Card>
              <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                <span className="text-lg font-medium text-gray-900">SEO Information</span>
                <Icon
                  icon="ChevronDown"
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-primary-500 transition-transform duration-200`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 py-5 text-sm text-gray-500">
                  <div className="space-y-4">
                    <Textinput
                      label="Meta Title"
                      name="metaTitle"
                      placeholder="Meta Title"
                      value={formData.metaTitle}
                      onChange={handleChange}
                    />
                    <Textinput
                      label="Meta Keywords"
                      name="metaKeywords"
                      placeholder="Keywords separated by commas"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        OG Image (for social media sharing)
                      </label>
                      <FileUpload
                        file={formData.ogImage}
                        onDrop={(e) => handleOgImageUpload(e, "ogImage")} // Pass event object 'e'
                        onRemove={() => handleRemoveOgImage("ogImage")}
                        // Read loading and error from uploadStates
                        loading={uploadStates["ogImage"]?.loading || false}
                        error={uploadStates["ogImage"]?.error || null}
                        maxSize={5 * 1024 * 1024} // Convert MB to bytes for consistency
                        identifier="ogImage"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 1200×630 pixels
                      </p>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </Card>
          )}
        </Disclosure>

        {/* Page Blocks Accordion */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <Card>
               <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                 <span className="text-lg font-medium text-gray-900">Page Blocks</span>
                 <Icon
                   icon="ChevronDown"
                   className={`${
                     open ? 'rotate-180 transform' : ''
                   } h-5 w-5 text-primary-500 transition-transform duration-200`}
                 />
               </Disclosure.Button>
               <Transition
                 enter="transition duration-100 ease-out"
                 enterFrom="transform scale-95 opacity-0"
                 enterTo="transform scale-100 opacity-100"
                 leave="transition duration-75 ease-out"
                 leaveFrom="transform scale-100 opacity-100"
                 leaveTo="transform scale-95 opacity-0"
               >
                 <Disclosure.Panel className="px-4 py-5 text-sm text-gray-500">
                   <div className="mb-6">
                     {/* ... existing block selection code ... */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Add Block
                         </label>
                         <Select
                           placeholder="Select block type..."
                           options={blockTypeOptions}
                           onChange={(e) => handleAddBlock(e.target.value)}
                           value=""
                         />
                       </div>

                       {/* <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Add from Template
                         </label>
                         <Select
                           placeholder="Select a template..."
                           options={getTemplateOptions()}
                           onChange={(e) => handleAddTemplateBlock(e.target.value)}
                           value=""
                         />
                       </div> */}
                     </div>

                     <DragDropContext onDragEnd={onDragEnd}>
                       <Droppable droppableId="blocks">
                         {(provided) => (
                           <div
                             {...provided.droppableProps}
                             ref={provided.innerRef}
                             className="space-y-4"
                           >
                             {formData.blocks.map((block, index) => (
                               <Draggable
                                 key={block.id || `block-${index}`}
                                 draggableId={
                                   block.id ? `block-${block.id}` : `block-new-${index}`
                                 }
                                 index={index}
                               >
                                 {(provided) => (
                                   <div
                                     ref={provided.innerRef}
                                     {...provided.draggableProps}
                                     className="border p-4 rounded-lg bg-white shadow-sm"
                                   >
                                     <div className="flex justify-between items-center mb-3">
                                       <div className="flex items-center flex-grow">
                                         <div
                                           {...provided.dragHandleProps}
                                           className="flex items-center cursor-move mr-3 text-gray-400 hover:text-gray-600"
                                         >
                                           <Icon icon="Bars3" />
                                         </div>
                                         <span className="font-medium">
                                           {block.title ||
                                             `${
                                               block.type.charAt(0).toUpperCase() +
                                               block.type.slice(1)
                                             } Block`}
                                         </span>
                                         {block.templateId && (
                                           <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                             Template:{" "}
                                             {templates.find(
                                               (t) => t.id === block.templateId
                                             )?.name || "Unknown"}
                                           </span>
                                         )}
                                       </div>
                                       <div className="flex items-center space-x-2">
                                         {/* <button
                                           type="button"
                                           className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                                           onClick={() =>
                                             handleBlockPreviewToggle(index)
                                           }
                                           aria-label="Preview block"
                                         >
                                           <Icon icon="Eye" className="h-5 w-5" />
                                         </button> */}
                                         <button
                                           type="button"
                                           className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                           onClick={() => handleToggleBlock(index)}
                                           aria-expanded={block.isExpanded}
                                           aria-label={
                                             block.isExpanded
                                               ? "Collapse block"
                                               : "Expand block"
                                           }
                                         >
                                           <Icon
                                             icon={
                                               block.isExpanded
                                                 ? "ChevronUp"
                                                 : "ChevronDown"
                                             }
                                             className="h-5 w-5"
                                           />
                                         </button>
                                         <button
                                           type="button"
                                           className="p-1 !text-red-500 hover:bg-red-50 rounded"
                                           onClick={() => handleRemoveBlock(index)}
                                           aria-label="Remove block"
                                         >
                                           <Icon icon="XMark" className="h-5 w-5" />
                                         </button>
                                       </div>
                                     </div>

                                     {blockPreview.show &&
                                       blockPreview.blockIndex === index && (
                                         <div className="my-4 border rounded-lg overflow-hidden">
                                           <div className="bg-gray-100 px-3 py-2 border-b flex justify-between items-center">
                                             <span className="text-sm font-medium">
                                               Block Preview
                                             </span>
                                             <button
                                               type="button"
                                               className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                                               onClick={() =>
                                                 setBlockPreview({
                                                   show: false,
                                                   blockIndex: null,
                                                 })
                                               }
                                             >
                                               <Icon icon="XMark" className="h-4 w-4" />
                                             </button>
                                           </div>
                                           <div className="overflow-hidden">
                                             {/* {renderBlockPreview(block)} */}
                                           </div>
                                         </div>
                                       )}

                                     {block.isExpanded && (
                                       <div className="space-y-3 pt-3 border-t">
                                         <Textinput
                                           label="Block Title (Optional)"
                                           value={block.title || ""}
                                           onChange={(e) =>
                                             handleBlockChange(
                                               index,
                                               "title",
                                               e.target.value
                                             )
                                           }
                                           placeholder="e.g., Our Services Slider"
                                         />

                                         {block.type === "hero" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Heading"
                                               value={block.content?.heading || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "heading",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <Textarea
                                               label="Subheading"
                                               value={block.content?.subheading || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "subheading",
                                                   e.target.value
                                                 )
                                               }
                                               rows={2}
                                             />
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Text Color
                                               </label>
                                               <div className="flex items-center">
                                                 <input
                                                   type="color"
                                                   value={block.content?.textColor || "#000000"}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "textColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   className="h-9 w-16 p-1 border rounded mr-2"
                                                 />
                                                 <Textinput
                                                   value={block.content?.textColor || ""}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "textColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   placeholder="#000000"
                                                   className="flex-grow"
                                                 />
                                               </div>
                                             </div>
                                             <Textinput
                                               label="Button Text"
                                               value={block.content?.buttonText || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "buttonText",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <Textinput
                                               label="Button Link"
                                               value={block.content?.buttonLink || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "buttonLink",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Button Background Color
                                               </label>
                                               <div className="flex items-center">
                                                 <input
                                                   type="color"
                                                   value={block.content?.buttonBgColor || "#3b82f6"}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "buttonBgColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   className="h-9 w-16 p-1 border rounded mr-2"
                                                 />
                                                 <Textinput
                                                   value={block.content?.buttonBgColor || ""}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "buttonBgColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   placeholder="#3b82f6"
                                                   className="flex-grow"
                                                 />
                                               </div>
                                             </div>
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Button Text Color
                                               </label>
                                               <div className="flex items-center">
                                                 <input
                                                   type="color"
                                                   value={block.content?.buttonTextColor || "#ffffff"}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "buttonTextColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   className="h-9 w-16 p-1 border rounded mr-2"
                                                 />
                                                 <Textinput
                                                   value={block.content?.buttonTextColor || ""}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "buttonTextColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   placeholder="#ffffff"
                                                   className="flex-grow"
                                                 />
                                               </div>
                                             </div>
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Background Color
                                               </label>
                                               <div className="flex items-center">
                                                 <input
                                                   type="color"
                                                   value={block.content?.backgroundColor || "#f3f4f6"} // Default to a light gray if empty
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "backgroundColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   className="h-9 w-16 p-1 border rounded mr-2"
                                                 />
                                                 <Textinput
                                                   value={block.content?.backgroundColor || ""}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "backgroundColor",
                                                       e.target.value
                                                     )
                                                   }
                                                   placeholder="#f3f4f6"
                                                   className="flex-grow" // Add flex-grow if needed
                                                 />
                                               </div>
                                             </div>
                                             <Select
                                               label="Text Direction"
                                               value={
                                                 block.content?.textDirection || "left"
                                               }
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "textDirection",
                                                   e.target.value
                                                 )
                                               }
                                               options={[
                                                 { value: "left", label: "Left" },
                                                 { value: "right", label: "Right" },
                                                 { value: "center", label: "Center" },
                                               ]}
                                             />
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Hero Image
                                               </label>
                                               <FileUpload
                                                 file={block.content?.imageUrl}
                                                 onDrop={handleHeroImageUpload}
                                                 onRemove={handleRemoveHeroImage}
                                                 loading={
                                                   uploadStates[`hero-${index}`]
                                                     ?.loading || false
                                                 }
                                                 error={
                                                   uploadStates[`hero-${index}`]
                                                     ?.error || null
                                                 }
                                                 maxSize={5 * 1024 * 1024}
                                                 identifier={{ blockIndex: index }}
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "features" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">
                                                 Features:
                                               </h4>
                                               {(block.content?.features || []).map(
                                                 (feature, featureIndex) => (
                                                   <div
                                                     key={featureIndex}
                                                     className="border p-3 rounded bg-slate-50 space-y-2 relative"
                                                   >
                                                     <button
                                                       type="button"
                                                       onClick={() =>
                                                         handleRemoveItem(
                                                           index,
                                                           "features",
                                                           featureIndex
                                                         )
                                                       }
                                                       className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                       aria-label="Remove Feature"
                                                     >
                                                       <Icon
                                                         icon="XMark"
                                                         className="h-4 w-4"
                                                       />
                                                     </button>
                                                     <div>
                                                       <label className="block text-xs font-medium text-gray-700 mb-1">
                                                         {`Feature ${
                                                           featureIndex + 1
                                                         } Icon`}
                                                       </label>
                                                       <div className="grid grid-cols-4 gap-2 mb-2">
                                                         {ICON_OPTIONS.map((opt) => (
                                                           <button
                                                             key={opt.value}
                                                             type="button"
                                                             onClick={() =>
                                                               handleItemChange(
                                                                 index,
                                                                 "features",
                                                                 featureIndex,
                                                                 "icon",
                                                                 opt.value
                                                               )
                                                             }
                                                             className={`p-2 rounded-lg border ${
                                                               feature.icon === opt.value
                                                                 ? "border-primary-500 bg-primary-50"
                                                                 : "border-gray-200"
                                                             } hover:bg-gray-100 flex items-center justify-center`}
                                                           >
                                                             <Icon
                                                               icon={opt.value}
                                                               className="h-5 w-5"
                                                             />
                                                           </button>
                                                         ))}
                                                       </div>
                                                       <Textinput
                                                         placeholder="Or enter icon name (e.g. CheckCircle)"
                                                         value={feature.icon || ""}
                                                         onChange={(e) =>
                                                           handleItemChange(
                                                             index,
                                                             "features",
                                                             featureIndex,
                                                             "icon",
                                                             e.target.value
                                                           )
                                                         }
                                                         className="mt-1"
                                                       />
                                                     </div>
                                                     <Textinput
                                                       label={`Feature ${
                                                         featureIndex + 1
                                                       } Title`}
                                                       value={feature.title || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "features",
                                                           featureIndex,
                                                           "title",
                                                           e.target.value
                                                         )
                                                       }
                                                     />
                                                     <Textarea
                                                       label={`Feature ${
                                                         featureIndex + 1
                                                       } Description`}
                                                       value={feature.description || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "features",
                                                           featureIndex,
                                                           "description",
                                                           e.target.value
                                                         )
                                                       }
                                                       rows={2}
                                                     />
                                                   </div>
                                                 )
                                               )}
                                               <Button
                                                 text="Add Feature"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "features", {
                                                     icon: "",
                                                     title: "",
                                                     description: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "faq" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">
                                                 FAQs:
                                               </h4>
                                               {(block.content?.faqs || []).map(
                                                 (faq, faqIndex) => (
                                                   <div
                                                     key={faqIndex}
                                                     className="border p-3 rounded bg-slate-50 space-y-2 relative"
                                                   >
                                                     <button
                                                       type="button"
                                                       onClick={() =>
                                                         handleRemoveItem(
                                                           index,
                                                           "faqs",
                                                           faqIndex
                                                         )
                                                       }
                                                       className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                       aria-label="Remove FAQ"
                                                     >
                                                       <Icon
                                                         icon="XMark"
                                                         className="h-4 w-4"
                                                       />
                                                     </button>
                                                     <Textinput
                                                       label={`FAQ ${
                                                         faqIndex + 1
                                                       } Question`}
                                                       value={faq.question || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "faqs",
                                                           faqIndex,
                                                           "question",
                                                           e.target.value
                                                         )
                                                       }
                                                     />
                                                     <Textinput
                                                       label={`FAQ ${
                                                         faqIndex + 1
                                                       } Category`}
                                                       value={faq.category || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "faqs",
                                                           faqIndex,
                                                           "category",
                                                           e.target.value
                                                         )
                                                       }
                                                       placeholder="e.g., General, Billing"
                                                     />
                                                     <Textarea
                                                       label={`FAQ ${
                                                         faqIndex + 1
                                                       } Answer`}
                                                       value={faq.answer || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "faqs",
                                                           faqIndex,
                                                           "answer",
                                                           e.target.value
                                                         )
                                                       }
                                                       rows={3}
                                                     />
                                                   </div>
                                                 )
                                               )}
                                               <Button
                                                 text="Add FAQ"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "faqs", {
                                                     question: "",
                                                     answer: "",
                                                     category: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "slider" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title (Optional)"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">
                                                 Slides:
                                               </h4>
                                               {(block.content?.slides || []).map(
                                                 (slide, slideIndex) => {
                                                   const identifier = {
                                                     blockIndex: index,
                                                     slideIndex: slideIndex,
                                                   };
                                                   const uploadKey = `${index}-${slideIndex}`;
                                                   const uState = uploadStates[
                                                     uploadKey
                                                   ] || { loading: false, error: null };
                                                   return (
                                                     <div
                                                       key={slideIndex}
                                                       className="border p-3 rounded bg-slate-50 space-y-3 relative"
                                                     >
                                                       <button
                                                         type="button"
                                                         onClick={() =>
                                                           handleRemoveItem(
                                                             index,
                                                             "slides",
                                                             slideIndex
                                                           )
                                                         }
                                                         className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full z-10"
                                                         aria-label="Remove Slide"
                                                       >
                                                         <Icon
                                                           icon="XMark"
                                                           className="h-4 w-4"
                                                         />
                                                       </button>

                                                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                         <div className="sm:col-span-1">
                                                           <label className="block text-xs font-medium text-gray-700 mb-1">
                                                             Slide {slideIndex + 1}{" "}
                                                             Image*
                                                           </label>
                                                           <FileUpload
                                                             file={slide.imageUrl}
                                                             onDrop={
                                                               handleSlideImageUpload
                                                             }
                                                             onRemove={
                                                               handleRemoveSlideImage
                                                             }
                                                             loading={uState.loading}
                                                             error={uState.error}
                                                             maxSize={5 * 1024 * 1024}
                                                             identifier={identifier}
                                                           />
                                                         </div>
                                                         <div className="sm:col-span-2 space-y-3">
                                                           <Textinput
                                                             label={`Slide ${
                                                               slideIndex + 1
                                                             } Alt Text`}
                                                             value={slide.altText || ""}
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "slides",
                                                                 slideIndex,
                                                                 "altText",
                                                                 e.target.value
                                                               )
                                                             }
                                                             placeholder="Describe the image"
                                                           />
                                                           <Textarea
                                                             label={`Slide ${
                                                               slideIndex + 1
                                                             } Caption`}
                                                             value={slide.caption || ""}
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "slides",
                                                                 slideIndex,
                                                                 "caption",
                                                                 e.target.value
                                                               )
                                                             }
                                                             rows={2}
                                                             placeholder="Optional caption text"
                                                           />
                                                         </div>
                                                       </div>
                                                     </div>
                                                   );
                                                 }
                                               )}
                                               <Button
                                                 text="Add Slide"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "slides", {
                                                     imageUrl: null,
                                                     altText: "",
                                                     caption: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "cta" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Heading"
                                               value={block.content?.heading || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "heading",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <Textarea
                                               label="Description"
                                               value={block.content?.description || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "description",
                                                   e.target.value
                                                 )
                                               }
                                               rows={2}
                                             />
                                             <Textinput
                                               label="Button Text"
                                               value={block.content?.buttonText || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "buttonText",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <Textinput
                                               label="Button Link"
                                               value={block.content?.buttonLink || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "buttonLink",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <Select
                                               label="Background Style"
                                               value={block.content?.bgStyle || "color"}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "bgStyle",
                                                   e.target.value
                                                 )
                                               }
                                               options={[
                                                 {
                                                   value: "color",
                                                   label: "Solid Color",
                                                 },
                                                 {
                                                   value: "image",
                                                   label: "Background Image",
                                                 },
                                                 {
                                                   value: "gradient",
                                                   label: "Gradient",
                                                 },
                                               ]}
                                             />
                                           </div>
                                         )}

                                         {block.type === "testimonials" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">
                                                 Testimonials:
                                               </h4>
                                               {(block.content?.testimonials || []).map(
                                                 (testimonial, testimonialIndex) => (
                                                   <div
                                                     key={testimonialIndex}
                                                     className="border p-3 rounded bg-slate-50 space-y-2 relative"
                                                   >
                                                     <button
                                                       type="button"
                                                       onClick={() =>
                                                         handleRemoveItem(
                                                           index,
                                                           "testimonials",
                                                           testimonialIndex
                                                         )
                                                       }
                                                       className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                       aria-label="Remove Testimonial"
                                                     >
                                                       <Icon
                                                         icon="XMark"
                                                         className="h-4 w-4"
                                                       />
                                                     </button>
                                                     <Textarea
                                                       label={`Testimonial ${
                                                         testimonialIndex + 1
                                                       } Quote`}
                                                       value={testimonial.quote || ""}
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "testimonials",
                                                           testimonialIndex,
                                                           "quote",
                                                           e.target.value
                                                         )
                                                       }
                                                       rows={3}
                                                     />
                                                     <Textinput
                                                       label={`Testimonial ${
                                                         testimonialIndex + 1
                                                       } Author Name`}
                                                       value={
                                                         testimonial.authorName || ""
                                                       }
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "testimonials",
                                                           testimonialIndex,
                                                           "authorName",
                                                           e.target.value
                                                         )
                                                       }
                                                     />
                                                     <Textinput
                                                       label={`Testimonial ${
                                                         testimonialIndex + 1
                                                       } Author Title/Company`}
                                                       value={
                                                         testimonial.authorTitle || ""
                                                       }
                                                       onChange={(e) =>
                                                         handleItemChange(
                                                           index,
                                                           "testimonials",
                                                           testimonialIndex,
                                                           "authorTitle",
                                                           e.target.value
                                                         )
                                                       }
                                                     />
                                                   </div>
                                                 )
                                               )}
                                               <Button
                                                 text="Add Testimonial"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "testimonials", {
                                                     quote: "",
                                                     authorName: "",
                                                     authorTitle: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "content" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title (Optional)"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 HTML Content
                                               </label>
                                               <div className="custom-quill min-h-[250px]">
                                                 <ReactQuill
                                                   theme="snow"
                                                   value={block.content?.html || ""}
                                                   onChange={(value) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "html",
                                                       value
                                                     )
                                                   }
                                                   modules={quillModules}
                                                   placeholder="Enter your content here..."
                                                   className="h-full"
                                                 />
                                               </div>
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "products" && (
                                           <div className="space-y-3">
                                             <Textinput
                                               label="Section Title"
                                               value={block.content?.sectionTitle || ""}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "sectionTitle",
                                                   e.target.value
                                                 )
                                               }
                                             />
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">
                                                 Products:
                                               </h4>
                                               {(block.content?.products || []).map(
                                                 (product, productIndex) => {
                                                   const identifier = {
                                                     blockIndex: index,
                                                     productIndex: productIndex,
                                                   };
                                                   const uploadKey = `product-${index}-${productIndex}`;
                                                   const uState = uploadStates[
                                                     uploadKey
                                                   ] || { loading: false, error: null };
                                                   return (
                                                     <div
                                                       key={productIndex}
                                                       className="border p-3 rounded bg-slate-50 space-y-3 relative"
                                                     >
                                                       <button
                                                         type="button"
                                                         onClick={() =>
                                                           handleRemoveItem(
                                                             index,
                                                             "products",
                                                             productIndex
                                                           )
                                                         }
                                                         className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full z-10"
                                                         aria-label="Remove Product"
                                                       >
                                                         <Icon
                                                           icon="XMark"
                                                           className="h-4 w-4"
                                                         />
                                                       </button>

                                                       <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                                         <div className="sm:col-span-1">
                                                           <label className="block text-xs font-medium text-gray-700 mb-1">
                                                             Product {productIndex + 1}{" "}
                                                             Image*
                                                           </label>
                                                           <FileUpload
                                                             file={product.imageUrl}
                                                             onDrop={
                                                               handleProductImageUpload
                                                             }
                                                             onRemove={
                                                               handleRemoveProductImage
                                                             }
                                                             loading={uState.loading}
                                                             error={uState.error}
                                                             maxSize={5 * 1024 * 1024}
                                                             identifier={identifier}
                                                           />
                                                         </div>
                                                         <div className="sm:col-span-2 space-y-3">
                                                           <Textinput
                                                             label={`Product ${
                                                               productIndex + 1
                                                             } Title*`}
                                                             value={product.title || ""}
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "products",
                                                                 productIndex,
                                                                 "title",
                                                                 e.target.value
                                                               )
                                                             }
                                                             placeholder="Product title"
                                                             required
                                                           />
                                                           <Textarea
                                                             label={`Product ${
                                                               productIndex + 1
                                                             } Description`}
                                                             value={
                                                               product.description || ""
                                                             }
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "products",
                                                                 productIndex,
                                                                 "description",
                                                                 e.target.value
                                                               )
                                                             }
                                                             rows={2}
                                                             placeholder="Product description"
                                                           />
                                                           <Textinput
                                                             label={`Product ${
                                                               productIndex + 1
                                                             } Price`}
                                                             value={product.price || ""}
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "products",
                                                                 productIndex,
                                                                 "price",
                                                                 e.target.value
                                                               )
                                                             }
                                                             placeholder="e.g. $19.99"
                                                           />
                                                           <Textinput
                                                             label={`Product ${
                                                               productIndex + 1
                                                             } Link`}
                                                             value={product.link || ""}
                                                             onChange={(e) =>
                                                               handleItemChange(
                                                                 index,
                                                                 "products",
                                                                 productIndex,
                                                                 "link",
                                                                 e.target.value
                                                               )
                                                             }
                                                             placeholder="URL to product page"
                                                           />
                                                         </div>
                                                       </div>
                                                     </div>
                                                   );
                                                 }
                                               )}
                                               <Button
                                                 text="Add Product"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "products", {
                                                     imageUrl: null,
                                                     title: "",
                                                     description: "",
                                                     price: "",
                                                     link: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "blocktextimage" && (
                                           <div className="space-y-3">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Main Title"
                                                 value={block.content?.mainTitle || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "mainTitle",
                                                     e.target.value
                                                   )
                                                 }
                                               />
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Background Color
                                                 </label>
                                                 <div className="flex items-center">
                                                   <input
                                                     type="color"
                                                     value={block.content?.backgroundColor || "#ededed"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "backgroundColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     className="h-9 w-16 p-1 border rounded mr-2"
                                                   />
                                                   <Textinput
                                                     value={block.content?.backgroundColor || "#ededed"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "backgroundColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     placeholder="#ededed"
                                                   />
                                                 </div>
                                               </div>
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Main Description
                                               </label>
                                               <div className="custom-quill min-h-[200px]">
                                                 <ReactQuill
                                                   theme="snow"
                                                   value={block.content?.mainDescription || ""}
                                                   onChange={(value) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "mainDescription",
                                                       value
                                                     )
                                                   }
                                                   modules={quillModules}
                                                   placeholder="Enter your description here..."
                                                   className="h-full"
                                                 />
                                               </div>
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Image
                                               </label>
                                               <FileUpload
                                                 file={block.content?.imageUrl}
                                                 onDrop={(e) => {
                                                   const identifier = { blockIndex: index };
                                                   handleHeroImageUpload(e, identifier);
                                                 }}
                                                 onRemove={() => {
                                                   const identifier = { blockIndex: index };
                                                   handleRemoveHeroImage(identifier);
                                                 }}
                                                 loading={
                                                   uploadStates[`hero-${index}`]?.loading || false
                                                 }
                                                 error={
                                                   uploadStates[`hero-${index}`]?.error || null
                                                 }
                                                 maxSize={5 * 1024 * 1024}
                                                 identifier={{ blockIndex: index }}
                                               />
                                             </div>
                                             
                                             <Select
                                               label="Image Position"
                                               value={block.content?.imagePosition || "right"}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "imagePosition",
                                                   e.target.value
                                                 )
                                               }
                                               options={[
                                                 { value: "left", label: "Left" },
                                                 { value: "right", label: "Right" },
                                               ]}
                                             />
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Button Text"
                                                 value={block.content?.buttonText || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "buttonText",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. Book a Service"
                                               />
                                               <Textinput
                                                 label="Button Link"
                                                 value={block.content?.buttonLink || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "buttonLink",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. /contact"
                                               />
                                             </div>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Button Background Color
                                                 </label>
                                                 <div className="flex items-center">
                                                   <input
                                                     type="color"
                                                     value={block.content?.buttonBgColor || "#dd3333"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonBgColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     className="h-9 w-16 p-1 border rounded mr-2"
                                                   />
                                                   <Textinput
                                                     value={block.content?.buttonBgColor || "#dd3333"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonBgColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     placeholder="#dd3333"
                                                   />
                                                 </div>
                                               </div>
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Button Text Color
                                                 </label>
                                                 <div className="flex items-center">
                                                   <input
                                                     type="color"
                                                     value={block.content?.buttonTextColor || "#ffffff"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonTextColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     className="h-9 w-16 p-1 border rounded mr-2"
                                                   />
                                                   <Textinput
                                                     value={block.content?.buttonTextColor || "#ffffff"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonTextColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     placeholder="#ffffff"
                                                   />
                                                 </div>
                                               </div>
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Custom HTML/Widget Code (Optional)
                                               </label>
                                               <Textarea
                                                 value={block.content?.customHtml || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "customHtml",
                                                     e.target.value
                                                   )
                                                 }
                                                 rows={4}
                                                 placeholder="Paste any custom HTML or widget code here"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "about" && (
                                           <div className="space-y-3">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Sub Title"
                                                 value={block.content?.subTitle || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "subTitle",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. About Our Company"
                                               />
                                               <Textinput
                                                 label="Title"
                                                 value={block.content?.title || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "title",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. We Care About After Care."
                                               />
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Description
                                               </label>
                                               <div className="custom-quill min-h-[200px]">
                                                 <ReactQuill
                                                   theme="snow"
                                                   value={block.content?.description || ""}
                                                   onChange={(value) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "description",
                                                       value
                                                     )
                                                   }
                                                   modules={quillModules}
                                                   placeholder="Enter your description here..."
                                                   className="h-full"
                                                 />
                                               </div>
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Link
                                               </label>
                                               <div className="flex space-x-2">
                                                 <Textinput
                                                   value={block.content?.linkUrl || ""}
                                                   onChange={(e) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "linkUrl",
                                                       e.target.value
                                                     )
                                                   }
                                                   placeholder="e.g. /about-us"
                                                   className="flex-grow"
                                                 />
                                                 <Button
                                                   text="Add Link"
                                                   className="btn-outline-primary"
                                                   type="button"
                                                   onClick={() => {
                                                     if (!block.content?.linkUrl) {
                                                       handleBlockContentChange(index, "linkUrl", "/about-us");
                                                     }
                                                   }}
                                                 />
                                               </div>
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Image
                                               </label>
                                               <FileUpload
                                                 file={block.content?.imageUrl}
                                                 onDrop={(e) => {
                                                   const identifier = { blockIndex: index };
                                                   handleHeroImageUpload(e, identifier);
                                                 }}
                                                 onRemove={() => {
                                                   const identifier = { blockIndex: index };
                                                   handleRemoveHeroImage(identifier);
                                                 }}
                                                 loading={
                                                   uploadStates[`hero-${index}`]?.loading || false
                                                 }
                                                 error={
                                                   uploadStates[`hero-${index}`]?.error || null
                                                 }
                                                 maxSize={5 * 1024 * 1024}
                                                 identifier={{ blockIndex: index }}
                                               />
                                             </div>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Years Description"
                                                 value={block.content?.yearsDescription || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "yearsDescription",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. Gas Safe Registered"
                                               />
                                               
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Icon
                                                 </label>
                                                 <div className="flex space-x-2">
                                                   <Select
                                                     value={block.content?.icon || ""}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "icon",
                                                         e.target.value
                                                       )
                                                     }
                                                     options={ICON_OPTIONS}
                                                     className="flex-grow"
                                                   />
                                               
                                                 </div>
                                               </div>
                                             </div>
                                             
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">Features:</h4>
                                               <DragDropContext
                                                 onDragEnd={(result) => {
                                                   if (!result.destination) return;
                                                   const items = Array.from(block.content?.features || []);
                                                   const [reorderedItem] = items.splice(result.source.index, 1);
                                                   items.splice(result.destination.index, 0, reorderedItem);
                                                   handleBlockContentChange(index, "features", items);
                                                 }}
                                               >
                                                 <Droppable droppableId={`features-${index}`}>
                                                   {(provided) => (
                                                     <div
                                                       {...provided.droppableProps}
                                                       ref={provided.innerRef}
                                                       className="space-y-3"
                                                     >
                                                       {(block.content?.features || []).map(
                                                         (feature, featureIndex) => (
                                                           <Draggable
                                                             key={`feature-${index}-${featureIndex}`}
                                                             draggableId={`feature-${index}-${featureIndex}`}
                                                             index={featureIndex}
                                                           >
                                                             {(provided) => (
                                                               <div
                                                                 ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 {...provided.dragHandleProps}
                                                                 className="border p-3 rounded bg-slate-50 space-y-2 relative"
                                                               >
                                                                 <button
                                                                   type="button"
                                                                   onClick={() =>
                                                                     handleRemoveItem(
                                                                       index,
                                                                       "features",
                                                                       featureIndex
                                                                     )
                                                                   }
                                                                   className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                                   aria-label="Remove Feature"
                                                                 >
                                                                   <Icon
                                                                     icon="XMark"
                                                                     className="h-4 w-4"
                                                                   />
                                                                 </button>
                                                                 <div>
                                                                   <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                     {`Feature ${
                                                                       featureIndex + 1
                                                                     } Icon`}
                                                                   </label>
                                                                   <div className="grid grid-cols-4 gap-2 mb-2">
                                                                     {ICON_OPTIONS.map((opt) => (
                                                                       <button
                                                                         key={opt.value}
                                                                         type="button"
                                                                         onClick={() =>
                                                                           handleItemChange(
                                                                             index,
                                                                             "features",
                                                                             featureIndex,
                                                                             "icon",
                                                                             opt.value
                                                                           )
                                                                         }
                                                                         className={`p-2 rounded-lg border ${
                                                                           feature.icon === opt.value
                                                                             ? "border-primary-500 bg-primary-50"
                                                                             : "border-gray-200"
                                                                         } hover:bg-gray-100 flex items-center justify-center`}
                                                                       >
                                                                         <Icon
                                                                           icon={opt.value}
                                                                           className="h-5 w-5"
                                                                         />
                                                                       </button>
                                                                     ))}
                                                                   </div>
                                                                   <Textinput
                                                                     placeholder="Or enter icon name (e.g. CheckCircle)"
                                                                     value={feature.icon || ""}
                                                                     onChange={(e) =>
                                                                       handleItemChange(
                                                                         index,
                                                                         "features",
                                                                         featureIndex,
                                                                         "icon",
                                                                         e.target.value
                                                                       )
                                                                     }
                                                                     className="mt-1"
                                                                   />
                                                                 </div>
                                                                 <Textinput
                                                                   label={`Feature ${
                                                                     featureIndex + 1
                                                                   } Title`}
                                                                   value={feature.title || ""}
                                                                   onChange={(e) =>
                                                                     handleItemChange(
                                                                       index,
                                                                       "features",
                                                                       featureIndex,
                                                                       "title",
                                                                       e.target.value
                                                                     )
                                                                   }
                                                                 />
                                                                 <Textarea
                                                                   label={`Feature ${
                                                                     featureIndex + 1
                                                                   } Description`}
                                                                   value={feature.description || ""}
                                                                   onChange={(e) =>
                                                                     handleItemChange(
                                                                       index,
                                                                       "features",
                                                                       featureIndex,
                                                                       "description",
                                                                       e.target.value
                                                                     )
                                                                   }
                                                                   rows={2}
                                                                 />
                                                               </div>
                                                             )}
                                                           </Draggable>
                                                         )
                                                       )}
                                                       {provided.placeholder}
                                                     </div>
                                                   )}
                                                 </Droppable>
                                               </DragDropContext>
                                               <Button
                                                 text="Add Feature"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "features", {
                                                     icon: "CheckCircle",
                                                     title: "",
                                                     description: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                             
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">List Items:</h4>
                                               <DragDropContext
                                                 onDragEnd={(result) => {
                                                   if (!result.destination) return;
                                                   const items = Array.from(block.content?.listItems || []);
                                                   const [reorderedItem] = items.splice(result.source.index, 1);
                                                   items.splice(result.destination.index, 0, reorderedItem);
                                                   handleBlockContentChange(index, "listItems", items);
                                                 }}
                                               >
                                                 <Droppable droppableId={`list-items-${index}`}>
                                                   {(provided) => (
                                                     <div
                                                       {...provided.droppableProps}
                                                       ref={provided.innerRef}
                                                       className="space-y-3"
                                                     >
                                                       {(block.content?.listItems || []).map(
                                                         (item, itemIndex) => (
                                                           <Draggable
                                                             key={`list-item-${index}-${itemIndex}`}
                                                             draggableId={`list-item-${index}-${itemIndex}`}
                                                             index={itemIndex}
                                                           >
                                                             {(provided) => (
                                                               <div
                                                                 ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 className="flex items-center space-x-2 border p-3 rounded bg-slate-50"
                                                               >
                                                                 <div
                                                                   {...provided.dragHandleProps}
                                                                   className="cursor-move text-gray-400 hover:text-gray-600"
                                                                 >
                                                                   <Icon icon="Bars3" className="h-5 w-5" />
                                                                 </div>
                                                                 <Textinput
                                                                   value={item.text || ""}
                                                                   onChange={(e) =>
                                                                     handleItemChange(
                                                                       index,
                                                                       "listItems",
                                                                       itemIndex,
                                                                       "text",
                                                                       e.target.value
                                                                     )
                                                                   }
                                                                   className="flex-grow"
                                                                   placeholder={`List item ${itemIndex + 1}`}
                                                                 />
                                                                 <button
                                                                   type="button"
                                                                   onClick={() =>
                                                                     handleRemoveItem(
                                                                       index,
                                                                       "listItems",
                                                                       itemIndex
                                                                     )
                                                                   }
                                                                   className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                                   aria-label="Remove Item"
                                                                 >
                                                                   <Icon
                                                                     icon="XMark"
                                                                     className="h-4 w-4"
                                                                   />
                                                                 </button>
                                                               </div>
                                                             )}
                                                           </Draggable>
                                                         )
                                                       )}
                                                       {provided.placeholder}
                                                     </div>
                                                   )}
                                                 </Droppable>
                                               </DragDropContext>
                                               <Button
                                                 text="Add List Item"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "listItems", {
                                                     text: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
                                             </div>
                                           </div>
                                         )}

                                         {block.type === "video" && (
                                           <div className="space-y-3">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Section Title"
                                                 value={block.content?.title || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "title",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. Watch Our Video"
                                               />
                                               <Textinput
                                                 label="Video Embed URL"
                                                 value={block.content?.videoUrl || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "videoUrl",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. https://www.youtube.com/embed/xxxxxxxxxxx"
                                               />
                                             </div>
                                             
                                             <div>
                                               <label className="block text-xs font-medium text-gray-700 mb-1">
                                                 Description
                                               </label>
                                               <div className="custom-quill min-h-[200px]">
                                                 <ReactQuill
                                                   theme="snow"
                                                   value={block.content?.description || ""}
                                                   onChange={(value) =>
                                                     handleBlockContentChange(
                                                       index,
                                                       "description",
                                                       value
                                                     )
                                                   }
                                                   modules={quillModules}
                                                   placeholder="Enter your description here..."
                                                   className="h-full"
                                                 />
                                               </div>
                                             </div>
                                             
                                             <Select
                                               label="Video Position"
                                               value={block.content?.videoPosition || "right"}
                                               onChange={(e) =>
                                                 handleBlockContentChange(
                                                   index,
                                                   "videoPosition",
                                                   e.target.value
                                                 )
                                               }
                                               options={[
                                                 { value: "left", label: "Left" },
                                                 { value: "right", label: "Right" },
                                               ]}
                                             />
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <Textinput
                                                 label="Button Text"
                                                 value={block.content?.buttonText || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "buttonText",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. Learn More"
                                               />
                                               <Textinput
                                                 label="Button Link"
                                                 value={block.content?.buttonLink || ""}
                                                 onChange={(e) =>
                                                   handleBlockContentChange(
                                                     index,
                                                     "buttonLink",
                                                     e.target.value
                                                   )
                                                 }
                                                 placeholder="e.g. /contact"
                                               />
                                             </div>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Button Background Color
                                                 </label>
                                                 <div className="flex items-center">
                                                   <input
                                                     type="color"
                                                     value={block.content?.buttonBgColor || "#dd3333"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonBgColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     className="h-9 w-16 p-1 border rounded mr-2"
                                                   />
                                                   <Textinput
                                                     value={block.content?.buttonBgColor || "#dd3333"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonBgColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     placeholder="#dd3333"
                                                   />
                                                 </div>
                                               </div>
                                               <div>
                                                 <label className="block text-xs font-medium text-gray-700 mb-1">
                                                   Button Text Color
                                                 </label>
                                                 <div className="flex items-center">
                                                   <input
                                                     type="color"
                                                     value={block.content?.buttonTextColor || "#ffffff"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonTextColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     className="h-9 w-16 p-1 border rounded mr-2"
                                                   />
                                                   <Textinput
                                                     value={block.content?.buttonTextColor || "#ffffff"}
                                                     onChange={(e) =>
                                                       handleBlockContentChange(
                                                         index,
                                                         "buttonTextColor",
                                                         e.target.value
                                                       )
                                                     }
                                                     placeholder="#ffffff"
                                                   />
                                                 </div>
                                               </div>
                                             </div>
                                             
                                             <div className="space-y-4 mt-2 border-t pt-4">
                                               <h4 className="font-medium text-sm">List Items:</h4>
                                               <DragDropContext
                                                 onDragEnd={(result) => {
                                                   if (!result.destination) return;
                                                   const items = Array.from(block.content?.listItems || []);
                                                   const [reorderedItem] = items.splice(result.source.index, 1);
                                                   items.splice(result.destination.index, 0, reorderedItem);
                                                   handleBlockContentChange(index, "listItems", items);
                                                 }}
                                               >
                                                 <Droppable droppableId={`list-items-${index}`}>
                                                   {(provided) => (
                                                     <div
                                                       {...provided.droppableProps}
                                                       ref={provided.innerRef}
                                                       className="space-y-3"
                                                     >
                                                       {(block.content?.listItems || []).map(
                                                         (item, itemIndex) => (
                                                           <Draggable
                                                             key={`list-item-${index}-${itemIndex}`}
                                                             draggableId={`list-item-${index}-${itemIndex}`}
                                                             index={itemIndex}
                                                           >
                                                             {(provided) => (
                                                               <div
                                                                 ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 className="flex items-center space-x-2 border p-3 rounded bg-slate-50"
                                                               >
                                                                 <div
                                                                   {...provided.dragHandleProps}
                                                                   className="cursor-move text-gray-400 hover:text-gray-600"
                                                                 >
                                                                   <Icon icon="Bars3" className="h-5 w-5" />
                                                                 </div>
                                                                 <Textinput
                                                                   value={item.text || ""}
                                                                   onChange={(e) =>
                                                                     handleItemChange(
                                                                       index,
                                                                       "listItems",
                                                                       itemIndex,
                                                                       "text",
                                                                       e.target.value
                                                                     )
                                                                   }
                                                                   className="flex-grow"
                                                                   placeholder={`List item ${itemIndex + 1}`}
                                                                 />
                                                                 <button
                                                                   type="button"
                                                                   onClick={() =>
                                                                     handleRemoveItem(
                                                                       index,
                                                                       "listItems",
                                                                       itemIndex
                                                                     )
                                                                   }
                                                                   className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                                                                   aria-label="Remove Item"
                                                                 >
                                                                   <Icon
                                                                     icon="XMark"
                                                                     className="h-4 w-4"
                                                                   />
                                                                 </button>
                                                               </div>
                                                             )}
                                                           </Draggable>
                                                         )
                                                       )}
                                                       {provided.placeholder}
                                                     </div>
                                                   )}
                                                 </Droppable>
                                               </DragDropContext>
                                               <Button
                                                 text="Add List Item"
                                                 className="btn-outline-primary btn-sm"
                                                 onClick={() =>
                                                   handleAddItem(index, "listItems", {
                                                     text: "",
                                                   })
                                                 }
                                                 icon="Plus"
                                                 type="button"
                                               />
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
                     </DragDropContext>
                   </div>
                 </Disclosure.Panel>
               </Transition>
             </Card>
          )}
        </Disclosure>

        {/* Action Buttons Section */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg mt-6 sticky bottom-0 z-10 shadow-md">
          <div className="flex justify-end space-x-3">
            {/* <Button
              text="Preview Page"
              className="btn-outline-secondary" // Adjusted style, kept Eye icon
              type="button"
              icon="Eye"
              onClick={handlePreviewToggle}
            /> */}
            <Button
              text="Cancel"
              className="btn-outline-dark"
              icon="XMark" // Added XMark icon
              onClick={() => router.push("/admin/pages")}
            />
            <Button
              text={isEditMode ? "Update Page" : "Create Page"}
              className="btn-primary"
              type="submit"
              icon="Check" // Added Check icon
              isLoading={loading}
              disabled={
                loading || Object.values(uploadStates).some((s) => s.loading)
              }
            />
          </div>
        </div>
      </div> {/* End of space-y-6 div */}
    </form>
  );
};

export default PageForm;
