"use client";
import { useState, useEffect, useRef } from "react";
import BlockPreview from "./BlockPreview";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
// Import useQueryClient from react-query
import { useQueryClient } from "react-query";
import MediaUpload from "@components/ui/MediaUpload";
import SeoDashboard from "@components/SEO/SeoDashboard";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Quill modules configuration (you can customize this)
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

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
  // Get the query client instance
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesByType, setTemplatesByType] = useState({});
  const [uploadStates, setUploadStates] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [blockPreview, setBlockPreview] = useState({
    show: false,
    blockIndex: null,
  });
  const [publishedForms, setPublishedForms] = useState([]); // Added state for published forms

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaKeywords: "",
    status: "draft",
    isMainPage: false,
    canonicalUrl: "",
    robots: "index, follow",
    structuredData: "",
    blocks: [],
  });

  useEffect(() => {
    // loadBlockTemplates();
    if (isEditMode) {
      // loadPage will be called by the next useEffect hook once publishedForms are ready
    }
  }, [id]); // Removed loadPage call from here, will be handled by the effect below

  // Effect to fetch forms ONCE on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        console.log("Attempting to fetch published forms...");
        const { data } = await http.get("/forms/published");
        setPublishedForms(data || []);
        console.log("Fetched published forms successfully:", data);
      } catch (error) {
        console.error("Error loading published forms on init:", error);
        toast.error("Failed to load available forms for block selection");
        setPublishedForms([]); // Ensure it's an array on error
      }
    };
    fetchForms();
  }, []); // Empty dependency array: runs only on mount

  // Effect to load page data when in edit mode, reacts to publishedForms update
  useEffect(() => {
    // loadBlockTemplates(); // This is commented out in original code
    if (isEditMode) {
      // This ensures loadPage runs when id, isEditMode, or publishedForms change.
      // If publishedForms are fetched after the initial render, loadPage will re-run with them.
      // console.log("useEffect for loadPage triggered. isEditMode:", isEditMode, "ID:", id, "publishedForms count:", publishedForms.length);
      loadPage();
    }
  }, [id, isEditMode, publishedForms]);

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("page"); // 'page' or 'block' or 'seo'

  // Function to handle SEO suggestions
  const handleSeoSuggestions = (seoData) => {
    if (!seoData) return;

    // Handle applied suggestions
    if (seoData.applySuggestion) {
      // Prevent any form submission
      if (seoData.preventDefault) {
        seoData.preventDefault();
      }

      const { type, value } = seoData;

      // Apply the suggestion based on type
      switch (type) {
        case "title":
          setFormData((prev) => ({ ...prev, metaTitle: value }));
          toast.success("Title suggestion applied successfully");
          break;
        case "metaDescription":
          setFormData((prev) => ({ ...prev, description: value }));
          toast.success("Meta description suggestion applied successfully");
          break;
        case "keywords":
          setFormData((prev) => ({ ...prev, metaKeywords: value }));
          toast.success("Keywords applied successfully");
          break;
        default:
          break;
      }
      return;
    }

    // Update formData with SEO suggestions if they exist
    const updates = {};

    if (seoData.titleSuggestion && !formData.metaTitle) {
      updates.metaTitle = seoData.titleSuggestion;
    }

    if (seoData.metaDescriptionSuggestion && !formData.description) {
      updates.description = seoData.metaDescriptionSuggestion;
    }

    if (seoData.recommendedKeywords?.length > 0 && !formData.metaKeywords) {
      updates.metaKeywords = seoData.recommendedKeywords.join(", ");
    }

    if (Object.keys(updates).length > 0) {
      setFormData((prev) => ({ ...prev, ...updates }));
      toast.info("SEO suggestions applied to your page metadata.");
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
      setLoading(true); // Uncommented for better UX
      const pageData = await getPageById(id);
      console.log("Page data fetched:", pageData);
      console.log("Current publishedForms state in loadPage:", publishedForms);

      setFormData({
        title: pageData.title,
        slug: pageData.slug,
        description: pageData.description || "",
        metaTitle: pageData.metaTitle || "",
        metaKeywords: pageData.metaKeywords || "",
        ogImage: pageData.ogImage || "",
        status: pageData.status,
        isMainPage: pageData.isMainPage || false,
        canonicalUrl: pageData.canonicalUrl || "",
        robots: pageData.robots || "index, follow",
        structuredData: pageData.structuredData
          ? JSON.stringify(pageData.structuredData, null, 2)
          : "",
        blocks: (pageData.blocks || []).map((block) => {
          const newBlockData = {
            ...block,
            isExpanded: false,
          };
          if (block.type === 'form') {
            newBlockData._forms = publishedForms || []; // Populate _forms from state
            console.log(`Block ${block.id || 'new'} is form, _forms set to:`, publishedForms);
          }
          return newBlockData;
        }),
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

    if (type === 'form') {
      newBlock._forms = publishedForms || []; // Add forms if it's a form block
      console.log("Adding new form block, _forms set to:", publishedForms);
    }

    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
  };
  // In handleAddBlock function, add initialization for portfolio blocks

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
        structuredData: formData.structuredData
          ? JSON.parse(formData.structuredData)
          : null,
      };

      if (isEditMode) {
        await updatePage(id, submissionData);
        toast.success("Page updated successfully");
        // Invalidate the query after successful update
        queryClient.invalidateQueries("publishedPages");
      } else {
        await createPage(submissionData);
        toast.success("Page created successfully");
        // Invalidate the query after successful creation
        queryClient.invalidateQueries("publishedPages");
        router.push("/admin/pages");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error(error.response?.data?.error || "Failed to save page");
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
    { value: "partners", label: "Partners" },
    { value: "customers", label: "Customers" },
    { value: "form", label: "Form Block" },
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
    if (!identifier) return;
    const { blockIndex, slideIndex } = identifier;
    const uploadKey = `${blockIndex}-${slideIndex}`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      handleItemChange(blockIndex, "slides", slideIndex, "imageUrl", {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("addToMediaLibrary", "true"); // Add to media library
    formData.append("setAsInUse", "true"); // Mark as in use

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
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
    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      setFormData((prev) => ({
        ...prev,
        ogImage: {
          _id: mediaFile._id,
          url: mediaFile.url,
          fromMediaLibrary: true,
          mediaId: mediaFile.mediaId,
        },
      }));
      return;
    }

    const file = e.target?.files?.[0];
    if (!file || !identifier) return;

    setUploadStates((prev) => ({
      ...prev,
      [identifier]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("addToMediaLibrary", "true"); // Add to media library
    formData.append("setAsInUse", "true"); // Mark as in use

    try {
      // Use http instance for consistency
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };

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

  const handleRemoveOgImage = async (identifier, isFromLibrary = false) => {
    // Set loading state for the specific identifier
    setUploadStates((prev) => ({
      ...prev,
      [identifier]: { loading: true, error: null },
    }));

    const currentOgImage = formData.ogImage;

    try {
      if (
        currentOgImage?._id &&
        !isFromLibrary &&
        !currentOgImage.fromMediaLibrary
      ) {
        // If it's not from the media library, delete from S3
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
        [identifier]: {
          loading: false,
          error: "Failed to delete image from server.",
        },
      }));
    }
  };

  const handleRemoveSlideImage = async (identifier, updateState = true) => {
    const { blockIndex, slideIndex } = identifier;
    const uploadKey = `${blockIndex}-${slideIndex}`;
    const currentImageUrl =
      formData.blocks[blockIndex]?.content?.slides?.[slideIndex]?.imageUrl;

    if (
      currentImageUrl &&
      currentImageUrl._id &&
      !currentImageUrl.fromMediaLibrary
    ) {
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
    if (!identifier) return;
    const { blockIndex } = identifier;
    const uploadKey = `hero-${blockIndex}`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      handleBlockContentChange(blockIndex, "imageUrl", {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    // Handle file upload
    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("addToMediaLibrary", "true"); // Add to media library
    formData.append("setAsInUse", "true"); // Mark as in use

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
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

  const handleRemoveHeroImage = async (identifier, isFromLibrary = false) => {
    const { blockIndex } = identifier;
    const uploadKey = `hero-${blockIndex}`;
    const currentImageUrl = formData.blocks[blockIndex]?.content?.imageUrl;

    if (currentImageUrl && currentImageUrl._id) {
      if (!isFromLibrary && !currentImageUrl.fromMediaLibrary) {
        // If it's not from the media library, delete from S3
        try {
          await http.delete(`/deletefile?fileName=${currentImageUrl._id}`);
        } catch (error) {
          console.error("Delete failed:", error);
          toast.warn(
            "Could not delete image from server, but removed from hero block."
          );
        }
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

  const handleToggleBlockTab = (index) => {
    const blockToToggle = formData.blocks[index];
    const isExpanding = !blockToToggle.isExpanded; // Check if we are expanding

    const updatedBlocks = [...formData.blocks];
    updatedBlocks[index] = {
      ...blockToToggle,
      isExpanded: isExpanding,
    };
    setFormData((prev) => ({ ...prev, blocks: updatedBlocks }));

    // Scroll only when expanding the block editor
    if (isExpanding) {
      const draggableId = blockToToggle.id
        ? `block-${blockToToggle.id}`
        : `block-new-${index}`;

      // Use setTimeout to wait for the DOM update after state change
      setTimeout(() => {
        const element = document.getElementById(draggableId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          // Optional: Add a visual cue, like a brief highlight
          element.classList.add(
            "ring-2",
            "ring-primary-500",
            "ring-offset-2",
            "transition-shadow",
            "duration-1000",
            "ease-out"
          );
          setTimeout(() => {
            element.classList.remove(
              "ring-2",
              "ring-primary-500",
              "ring-offset-2",
              "transition-shadow",
              "duration-1000",
              "ease-out"
            );
          }, 1000); // Remove highlight after 1 second
        } else {
          console.warn(`Scroll target element not found: #${draggableId}`);
        }
      }, 100); // Small delay (100ms) to ensure render completes
    }
  };

  const handleProductImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const { blockIndex, productIndex } = identifier;
    const uploadKey = `product-${blockIndex}-${productIndex}`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      handleItemChange(blockIndex, "products", productIndex, "imageUrl", {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    // Handle file upload
    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("addToMediaLibrary", "true"); // Add to media library
    formData.append("setAsInUse", "true"); // Mark as in use

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
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
              {BlockPreview(block)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleMainPageToggle = (e) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({ ...prev, isMainPage: isChecked }));
  };

  const handlePartnerImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const { blockIndex, partnerIndex } = identifier;
    const uploadKey = `partner-${blockIndex}-${partnerIndex}`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      handleItemChange(blockIndex, "partners", partnerIndex, "imageUrl", {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    // Handle file upload
    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("addToMediaLibrary", "true");
    formData.append("setAsInUse", "true");

    try {
      const { data } = await http.post("/uploadfile", formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
      handleItemChange(
        blockIndex,
        "partners",
        partnerIndex,
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

  const handleRemovePartnerImage = async (identifier) => {
    const { blockIndex, partnerIndex } = identifier;
    const uploadKey = `partner-${blockIndex}-${partnerIndex}`;
    const currentImageUrl =
      formData.blocks[blockIndex]?.content?.partners?.[partnerIndex]?.imageUrl;

    if (
      currentImageUrl &&
      currentImageUrl._id &&
      !currentImageUrl.fromMediaLibrary
    ) {
      try {
        await http.delete(`/deletefile?fileName=${currentImageUrl._id}`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.warn(
          "Could not delete image from server, but removed from partner."
        );
      }
    }

    handleItemChange(blockIndex, "partners", partnerIndex, "imageUrl", null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
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
    <div className="flex flex-col lg:flex-row">
      <div
        className={`flex-grow transition-all duration-300 ${
          sidebarVisible ? "lg:pr-[280px]" : ""
        }`}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {" "}
            {/* Added space-y-6 for spacing between accordions */}
            {/* Page Information Accordion */}
            <Disclosure defaultOpen>
              {({ open }) => (
                <Card>
                  <Disclosure.Button className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                    <span className="text-lg font-medium text-gray-900">
                      Page Information
                    </span>
                    <Icon
                      icon="ChevronDown"
                      className={`${
                        open ? "rotate-180 transform" : ""
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

                        <div className="mb-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.isMainPage}
                              onChange={handleMainPageToggle}
                              className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-gray-700 font-medium">
                              Set as Main Page (Homepage)
                            </span>
                          </label>
                          {formData.isMainPage && (
                            <p className="text-amber-600 text-sm mt-1">
                              Note: Only one page can be set as the main page.
                              Setting this page as main will unset any existing
                              main page.
                            </p>
                          )}
                        </div>
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
                    <span className="text-lg font-medium text-gray-900">
                      SEO Information
                    </span>
                    <Icon
                      icon="ChevronDown"
                      className={`${
                        open ? "rotate-180 transform" : ""
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
                          placeholder="Custom title for SEO (leave blank to use page title)"
                          value={formData.metaTitle}
                          onChange={handleChange}
                        />
                        <Textarea
                          label="Meta Description"
                          name="description"
                          placeholder="Brief description for search engines"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />
                        <Textinput
                          label="Meta Keywords"
                          name="metaKeywords"
                          placeholder="Comma-separated keywords"
                          value={formData.metaKeywords}
                          onChange={handleChange}
                        />
                        <Textinput
                          label="Canonical URL"
                          name="canonicalUrl"
                          placeholder="https://example.com/canonical-page"
                          value={formData.canonicalUrl}
                          onChange={handleChange}
                          helper="Set this if this page is a duplicate of another page"
                        />
                        <Select
                          label="Robots Meta Tag"
                          name="robots"
                          value={formData.robots}
                          onChange={handleChange}
                          helper="Controls how search engines should handle this page"
                          options={[
                            {
                              value: "index, follow",
                              label: "Index, Follow (default)",
                            },
                            {
                              value: "noindex, follow",
                              label: "NoIndex, Follow",
                            },
                            {
                              value: "index, nofollow",
                              label: "Index, NoFollow",
                            },
                            {
                              value: "noindex, nofollow",
                              label: "NoIndex, NoFollow",
                            },
                          ]}
                        />
                        <Textarea
                          label="Structured Data (JSON-LD)"
                          name="structuredData"
                          placeholder='{"@context": "https://schema.org", "@type": "WebPage", "name": "Page Title"}'
                          value={formData.structuredData}
                          onChange={handleChange}
                          rows={6}
                          className="font-mono text-sm"
                          helper="Add structured data in JSON-LD format for enhanced search results"
                        />

                        <SeoDashboard
                          pageData={formData}
                          onUpdateSuggestions={handleSeoSuggestions}
                        />

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Open Graph Image
                          </label>
                          <MediaUpload
                            file={formData.ogImage}
                            onDrop={(e) => handleOgImageUpload(e, "ogImage")}
                            onRemove={() =>
                              handleRemoveOgImage(
                                "ogImage",
                                formData.ogImage?.fromMediaLibrary
                              )
                            }
                            loading={uploadStates["ogImage"]?.loading}
                            error={uploadStates["ogImage"]?.error}
                            identifier="ogImage"
                            helperText="Image that appears when shared on social media (1200x630px recommended)"
                          />
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
                    <span className="text-lg font-medium text-gray-900">
                      Page Blocks
                    </span>
                    <Icon
                      icon="ChevronDown"
                      className={`${
                        open ? "rotate-180 transform" : ""
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
                                      block.id
                                        ? `block-${block.id}`
                                        : `block-new-${index}`
                                    }
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="border border-gray-200 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                        id={
                                          block.id
                                            ? `block-${block.id}`
                                            : `block-new-${index}`
                                        }
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
                                              {block.title ||
                                                `${
                                                  block.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  block.type.slice(1)
                                                } Block`}
                                            </span>
                                            {block.templateId && (
                                              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full border border-primary-200">
                                                Template:{" "}
                                                {templates.find(
                                                  (t) =>
                                                    t.id === block.templateId
                                                )?.name || "Unknown"}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <button
                                              type="button"
                                              className="p-1.5 text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                                              onClick={() =>
                                                handleBlockPreviewToggle(index)
                                              }
                                              aria-label="Preview block"
                                            >
                                              <Icon
                                                icon="Eye"
                                                className="h-5 w-5"
                                              />
                                            </button>
                                            <button
                                              type="button"
                                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                              onClick={() =>
                                                handleToggleBlock(index)
                                              }
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
                                              className="p-1.5 !text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                              onClick={() =>
                                                handleRemoveBlock(index)
                                              }
                                              aria-label="Remove block"
                                            >
                                              <Icon
                                                icon="XMark"
                                                className="h-5 w-5"
                                              />
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
                                                  <Icon
                                                    icon="XMark"
                                                    className="h-4 w-4"
                                                  />
                                                </button>
                                              </div>
                                              <div className="overflow-hidden">
                                                {BlockPreview(block)}
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
                                                  value={
                                                    block.content?.heading || ""
                                                  }
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
                                                  value={
                                                    block.content?.subheading ||
                                                    ""
                                                  }
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
                                                      value={
                                                        block.content
                                                          ?.textColor ||
                                                        "#000000"
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.textColor || ""
                                                      }
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
                                                  value={
                                                    block.content?.buttonText ||
                                                    ""
                                                  }
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
                                                  value={
                                                    block.content?.buttonLink ||
                                                    ""
                                                  }
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
                                                      value={
                                                        block.content
                                                          ?.buttonBgColor ||
                                                        "#3b82f6"
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.buttonBgColor || ""
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.buttonTextColor ||
                                                        "#ffffff"
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.buttonTextColor ||
                                                        ""
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.backgroundColor ||
                                                        "#f3f4f6"
                                                      } // Default to a light gray if empty
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
                                                      value={
                                                        block.content
                                                          ?.backgroundColor ||
                                                        ""
                                                      }
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
                                                    block.content
                                                      ?.textDirection || "left"
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "textDirection",
                                                      e.target.value
                                                    )
                                                  }
                                                  options={[
                                                    {
                                                      value: "left",
                                                      label: "Left",
                                                    },
                                                    {
                                                      value: "right",
                                                      label: "Right",
                                                    },
                                                    {
                                                      value: "center",
                                                      label: "Center",
                                                    },
                                                  ]}
                                                />
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Hero Image
                                                  </label>
                                                  <MediaUpload
                                                    file={
                                                      block.content?.imageUrl
                                                    }
                                                    onDrop={
                                                      handleHeroImageUpload
                                                    }
                                                    onRemove={
                                                      handleRemoveHeroImage
                                                    }
                                                    loading={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.loading || false
                                                    }
                                                    error={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.error || null
                                                    }
                                                    maxSize={5 * 1024 * 1024}
                                                    identifier={{
                                                      blockIndex: index,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {block.type === "features" && (
                                              <div className="space-y-3">
                                                <Textinput
                                                  label="Section Title"
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                  {(
                                                    block.content?.features ||
                                                    []
                                                  ).map(
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
                                                            {ICON_OPTIONS.map(
                                                              (opt) => (
                                                                <button
                                                                  key={
                                                                    opt.value
                                                                  }
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
                                                                    feature.icon ===
                                                                    opt.value
                                                                      ? "border-primary-500 bg-primary-50"
                                                                      : "border-gray-200"
                                                                  } hover:bg-gray-100 flex items-center justify-center`}
                                                                >
                                                                  <Icon
                                                                    icon={
                                                                      opt.value
                                                                    }
                                                                    className="h-5 w-5"
                                                                  />
                                                                </button>
                                                              )
                                                            )}
                                                          </div>
                                                          <Textinput
                                                            placeholder="Or enter icon name (e.g. CheckCircle)"
                                                            value={
                                                              feature.icon || ""
                                                            }
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
                                                          value={
                                                            feature.title || ""
                                                          }
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
                                                          value={
                                                            feature.description ||
                                                            ""
                                                          }
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
                                                      handleAddItem(
                                                        index,
                                                        "features",
                                                        {
                                                          icon: "",
                                                          title: "",
                                                          description: "",
                                                        }
                                                      )
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
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                  {(
                                                    block.content?.faqs || []
                                                  ).map((faq, faqIndex) => (
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
                                                        value={
                                                          faq.question || ""
                                                        }
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
                                                        value={
                                                          faq.category || ""
                                                        }
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
                                                  ))}
                                                  <Button
                                                    text="Add FAQ"
                                                    className="btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                      handleAddItem(
                                                        index,
                                                        "faqs",
                                                        {
                                                          question: "",
                                                          answer: "",
                                                          category: "",
                                                        }
                                                      )
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
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                  {(
                                                    block.content?.slides || []
                                                  ).map((slide, slideIndex) => {
                                                    const identifier = {
                                                      blockIndex: index,
                                                      slideIndex: slideIndex,
                                                    };
                                                    const uploadKey = `${index}-${slideIndex}`;
                                                    const uState = uploadStates[
                                                      uploadKey
                                                    ] || {
                                                      loading: false,
                                                      error: null,
                                                    };
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
                                                              Slide{" "}
                                                              {slideIndex + 1}{" "}
                                                              Image*
                                                            </label>
                                                            <MediaUpload
                                                              file={
                                                                slide.imageUrl
                                                              }
                                                              onDrop={(e) =>
                                                                handleSlideImageUpload(
                                                                  e,
                                                                  identifier
                                                                )
                                                              }
                                                              onRemove={() =>
                                                                handleRemoveSlideImage(
                                                                  identifier,
                                                                  slide.imageUrl
                                                                    ?.fromMediaLibrary
                                                                )
                                                              }
                                                              loading={
                                                                uState.loading
                                                              }
                                                              error={
                                                                uState.error
                                                              }
                                                              maxSize={
                                                                5 * 1024 * 1024
                                                              }
                                                              identifier={
                                                                identifier
                                                              }
                                                            />
                                                          </div>
                                                          <div className="sm:col-span-2 space-y-3">
                                                            <Textinput
                                                              label={`Slide ${
                                                                slideIndex + 1
                                                              } Alt Text`}
                                                              value={
                                                                slide.altText ||
                                                                ""
                                                              }
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
                                                              value={
                                                                slide.caption ||
                                                                ""
                                                              }
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
                                                  })}
                                                  <Button
                                                    text="Add Slide"
                                                    className="btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                      handleAddItem(
                                                        index,
                                                        "slides",
                                                        {
                                                          imageUrl: null,
                                                          altText: "",
                                                          caption: "",
                                                        }
                                                      )
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
                                                  value={
                                                    block.content?.heading || ""
                                                  }
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
                                                  value={
                                                    block.content
                                                      ?.description || ""
                                                  }
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
                                                  value={
                                                    block.content?.buttonText ||
                                                    ""
                                                  }
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
                                                  value={
                                                    block.content?.buttonLink ||
                                                    ""
                                                  }
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
                                                  value={
                                                    block.content?.bgStyle ||
                                                    "color"
                                                  }
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
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                  {(
                                                    block.content
                                                      ?.testimonials || []
                                                  ).map(
                                                    (
                                                      testimonial,
                                                      testimonialIndex
                                                    ) => (
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
                                                          value={
                                                            testimonial.quote ||
                                                            ""
                                                          }
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
                                                            testimonial.authorName ||
                                                            ""
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
                                                            testimonial.authorTitle ||
                                                            ""
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
                                                      handleAddItem(
                                                        index,
                                                        "testimonials",
                                                        {
                                                          quote: "",
                                                          authorName: "",
                                                          authorTitle: "",
                                                        }
                                                      )
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
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                      value={
                                                        block.content?.html ||
                                                        ""
                                                      }
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
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
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
                                                  {(
                                                    block.content?.products ||
                                                    []
                                                  ).map(
                                                    (product, productIndex) => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                        productIndex:
                                                          productIndex,
                                                      };
                                                      const uploadKey = `product-${index}-${productIndex}`;
                                                      const uState =
                                                        uploadStates[
                                                          uploadKey
                                                        ] || {
                                                          loading: false,
                                                          error: null,
                                                        };
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
                                                                Product{" "}
                                                                {productIndex +
                                                                  1}{" "}
                                                                Image*
                                                              </label>
                                                              <MediaUpload
                                                                file={
                                                                  product.imageUrl
                                                                }
                                                                onDrop={
                                                                  handleProductImageUpload
                                                                }
                                                                onRemove={
                                                                  handleRemoveProductImage
                                                                }
                                                                loading={
                                                                  uState.loading
                                                                }
                                                                error={
                                                                  uState.error
                                                                }
                                                                maxSize={
                                                                  5 *
                                                                  1024 *
                                                                  1024
                                                                }
                                                                identifier={
                                                                  identifier
                                                                }
                                                              />
                                                            </div>
                                                            <div className="sm:col-span-2 space-y-3">
                                                              <Textinput
                                                                label={`Product ${
                                                                  productIndex +
                                                                  1
                                                                } Title*`}
                                                                value={
                                                                  product.title ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "products",
                                                                    productIndex,
                                                                    "title",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                placeholder="Product title"
                                                                required
                                                              />
                                                              <Textarea
                                                                label={`Product ${
                                                                  productIndex +
                                                                  1
                                                                } Description`}
                                                                value={
                                                                  product.description ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "products",
                                                                    productIndex,
                                                                    "description",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                rows={2}
                                                                placeholder="Product description"
                                                              />
                                                              <Textinput
                                                                label={`Product ${
                                                                  productIndex +
                                                                  1
                                                                } Price`}
                                                                value={
                                                                  product.price ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "products",
                                                                    productIndex,
                                                                    "price",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                placeholder="e.g. $19.99"
                                                              />
                                                              <Textinput
                                                                label={`Product ${
                                                                  productIndex +
                                                                  1
                                                                } Link`}
                                                                value={
                                                                  product.link ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "products",
                                                                    productIndex,
                                                                    "link",
                                                                    e.target
                                                                      .value
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
                                                      handleAddItem(
                                                        index,
                                                        "products",
                                                        {
                                                          imageUrl: null,
                                                          title: "",
                                                          description: "",
                                                          price: "",
                                                          link: "",
                                                        }
                                                      )
                                                    }
                                                    icon="Plus"
                                                    type="button"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {block.type ===
                                              "blocktextimage" && (
                                              <div className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <Textinput
                                                    label="Main Title"
                                                    value={
                                                      block.content
                                                        ?.mainTitle || ""
                                                    }
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
                                                        value={
                                                          block.content
                                                            ?.backgroundColor ||
                                                          "#ededed"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.backgroundColor ||
                                                          "#ededed"
                                                        }
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
                                                      value={
                                                        block.content
                                                          ?.mainDescription ||
                                                        ""
                                                      }
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
                                                  <MediaUpload
                                                    file={
                                                      block.content?.imageUrl
                                                    }
                                                    onDrop={(e) => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                      };
                                                      handleHeroImageUpload(
                                                        e,
                                                        identifier
                                                      );
                                                    }}
                                                    onRemove={() => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                      };
                                                      handleRemoveHeroImage(
                                                        identifier
                                                      );
                                                    }}
                                                    loading={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.loading || false
                                                    }
                                                    error={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.error || null
                                                    }
                                                    maxSize={5 * 1024 * 1024}
                                                    identifier={{
                                                      blockIndex: index,
                                                    }}
                                                  />
                                                </div>

                                                <Select
                                                  label="Image Position"
                                                  value={
                                                    block.content
                                                      ?.imagePosition || "right"
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "imagePosition",
                                                      e.target.value
                                                    )
                                                  }
                                                  options={[
                                                    {
                                                      value: "left",
                                                      label: "Left",
                                                    },
                                                    {
                                                      value: "right",
                                                      label: "Right",
                                                    },
                                                  ]}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <Textinput
                                                    label="Button Text"
                                                    value={
                                                      block.content
                                                        ?.buttonText || ""
                                                    }
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
                                                    value={
                                                      block.content
                                                        ?.buttonLink || ""
                                                    }
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
                                                        value={
                                                          block.content
                                                            ?.buttonBgColor ||
                                                          "#dd3333"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonBgColor ||
                                                          "#dd3333"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonTextColor ||
                                                          "#ffffff"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonTextColor ||
                                                          "#ffffff"
                                                        }
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
                                                    Custom HTML/Widget Code
                                                    (Optional)
                                                  </label>
                                                  <Textarea
                                                    value={
                                                      block.content
                                                        ?.customHtml || ""
                                                    }
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
                                                    value={
                                                      block.content?.subTitle ||
                                                      ""
                                                    }
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
                                                    value={
                                                      block.content?.title || ""
                                                    }
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
                                                      value={
                                                        block.content
                                                          ?.description || ""
                                                      }
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
                                                      value={
                                                        block.content
                                                          ?.linkUrl || ""
                                                      }
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
                                                        if (
                                                          !block.content
                                                            ?.linkUrl
                                                        ) {
                                                          handleBlockContentChange(
                                                            index,
                                                            "linkUrl",
                                                            "/about-us"
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Image
                                                  </label>
                                                  <MediaUpload
                                                    file={
                                                      block.content?.imageUrl
                                                    }
                                                    onDrop={(e) => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                      };
                                                      handleHeroImageUpload(
                                                        e,
                                                        identifier
                                                      );
                                                    }}
                                                    onRemove={() => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                      };
                                                      handleRemoveHeroImage(
                                                        identifier
                                                      );
                                                    }}
                                                    loading={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.loading || false
                                                    }
                                                    error={
                                                      uploadStates[
                                                        `hero-${index}`
                                                      ]?.error || null
                                                    }
                                                    maxSize={5 * 1024 * 1024}
                                                    identifier={{
                                                      blockIndex: index,
                                                    }}
                                                  />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <Textinput
                                                    label="Years Description"
                                                    value={
                                                      block.content
                                                        ?.yearsDescription || ""
                                                    }
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
                                                        value={
                                                          block.content?.icon ||
                                                          ""
                                                        }
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
                                                  <h4 className="font-medium text-sm">
                                                    Features:
                                                  </h4>
                                                  <DragDropContext
                                                    onDragEnd={(result) => {
                                                      if (!result.destination)
                                                        return;
                                                      const items = Array.from(
                                                        block.content
                                                          ?.features || []
                                                      );
                                                      const [reorderedItem] =
                                                        items.splice(
                                                          result.source.index,
                                                          1
                                                        );
                                                      items.splice(
                                                        result.destination
                                                          .index,
                                                        0,
                                                        reorderedItem
                                                      );
                                                      handleBlockContentChange(
                                                        index,
                                                        "features",
                                                        items
                                                      );
                                                    }}
                                                  >
                                                    <Droppable
                                                      droppableId={`features-${index}`}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          {...provided.droppableProps}
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          className="space-y-3"
                                                        >
                                                          {(
                                                            block.content
                                                              ?.features || []
                                                          ).map(
                                                            (
                                                              feature,
                                                              featureIndex
                                                            ) => (
                                                              <Draggable
                                                                key={`feature-${index}-${featureIndex}`}
                                                                draggableId={`feature-${index}-${featureIndex}`}
                                                                index={
                                                                  featureIndex
                                                                }
                                                              >
                                                                {(provided) => (
                                                                  <div
                                                                    ref={
                                                                      provided.innerRef
                                                                    }
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
                                                                          featureIndex +
                                                                          1
                                                                        } Icon`}
                                                                      </label>
                                                                      <div className="grid grid-cols-4 gap-2 mb-2">
                                                                        {ICON_OPTIONS.map(
                                                                          (
                                                                            opt
                                                                          ) => (
                                                                            <button
                                                                              key={
                                                                                opt.value
                                                                              }
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
                                                                                feature.icon ===
                                                                                opt.value
                                                                                  ? "border-primary-500 bg-primary-50"
                                                                                  : "border-gray-200"
                                                                              } hover:bg-gray-100 flex items-center justify-center`}
                                                                            >
                                                                              <Icon
                                                                                icon={
                                                                                  opt.value
                                                                                }
                                                                                className="h-5 w-5"
                                                                              />
                                                                            </button>
                                                                          )
                                                                        )}
                                                                      </div>
                                                                      <Textinput
                                                                        placeholder="Or enter icon name (e.g. CheckCircle)"
                                                                        value={
                                                                          feature.icon ||
                                                                          ""
                                                                        }
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          handleItemChange(
                                                                            index,
                                                                            "features",
                                                                            featureIndex,
                                                                            "icon",
                                                                            e
                                                                              .target
                                                                              .value
                                                                          )
                                                                        }
                                                                        className="mt-1"
                                                                      />
                                                                    </div>
                                                                    <Textinput
                                                                      label={`Feature ${
                                                                        featureIndex +
                                                                        1
                                                                      } Title`}
                                                                      value={
                                                                        feature.title ||
                                                                        ""
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        handleItemChange(
                                                                          index,
                                                                          "features",
                                                                          featureIndex,
                                                                          "title",
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                    />
                                                                    <Textarea
                                                                      label={`Feature ${
                                                                        featureIndex +
                                                                        1
                                                                      } Description`}
                                                                      value={
                                                                        feature.description ||
                                                                        ""
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        handleItemChange(
                                                                          index,
                                                                          "features",
                                                                          featureIndex,
                                                                          "description",
                                                                          e
                                                                            .target
                                                                            .value
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
                                                      handleAddItem(
                                                        index,
                                                        "features",
                                                        {
                                                          icon: "CheckCircle",
                                                          title: "",
                                                          description: "",
                                                        }
                                                      )
                                                    }
                                                    icon="Plus"
                                                    type="button"
                                                  />
                                                </div>

                                                <div className="space-y-4 mt-2 border-t pt-4">
                                                  <h4 className="font-medium text-sm">
                                                    List Items:
                                                  </h4>
                                                  <DragDropContext
                                                    onDragEnd={(result) => {
                                                      if (!result.destination)
                                                        return;
                                                      const items = Array.from(
                                                        block.content
                                                          ?.listItems || []
                                                      );
                                                      const [reorderedItem] =
                                                        items.splice(
                                                          result.source.index,
                                                          1
                                                        );
                                                      items.splice(
                                                        result.destination
                                                          .index,
                                                        0,
                                                        reorderedItem
                                                      );
                                                      handleBlockContentChange(
                                                        index,
                                                        "listItems",
                                                        items
                                                      );
                                                    }}
                                                  >
                                                    <Droppable
                                                      droppableId={`list-items-${index}`}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          {...provided.droppableProps}
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          className="space-y-3"
                                                        >
                                                          {(
                                                            block.content
                                                              ?.listItems || []
                                                          ).map(
                                                            (
                                                              item,
                                                              itemIndex
                                                            ) => (
                                                              <Draggable
                                                                key={`list-item-${index}-${itemIndex}`}
                                                                draggableId={`list-item-${index}-${itemIndex}`}
                                                                index={
                                                                  itemIndex
                                                                }
                                                              >
                                                                {(provided) => (
                                                                  <div
                                                                    ref={
                                                                      provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    className="flex items-center space-x-2 border p-3 rounded bg-slate-50"
                                                                  >
                                                                    <div
                                                                      {...provided.dragHandleProps}
                                                                      className="cursor-move text-gray-400 hover:text-gray-600"
                                                                    >
                                                                      <Icon
                                                                        icon="Bars3"
                                                                        className="h-5 w-5"
                                                                      />
                                                                    </div>
                                                                    <Textinput
                                                                      value={
                                                                        item.text ||
                                                                        ""
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        handleItemChange(
                                                                          index,
                                                                          "listItems",
                                                                          itemIndex,
                                                                          "text",
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                      className="flex-grow"
                                                                      placeholder={`List item ${
                                                                        itemIndex +
                                                                        1
                                                                      }`}
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
                                                      handleAddItem(
                                                        index,
                                                        "listItems",
                                                        {
                                                          text: "",
                                                        }
                                                      )
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
                                                    value={
                                                      block.content?.title || ""
                                                    }
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
                                                    value={
                                                      block.content?.videoUrl ||
                                                      ""
                                                    }
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
                                                      value={
                                                        block.content
                                                          ?.description || ""
                                                      }
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
                                                  value={
                                                    block.content
                                                      ?.videoPosition || "right"
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "videoPosition",
                                                      e.target.value
                                                    )
                                                  }
                                                  options={[
                                                    {
                                                      value: "left",
                                                      label: "Left",
                                                    },
                                                    {
                                                      value: "right",
                                                      label: "Right",
                                                    },
                                                  ]}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <Textinput
                                                    label="Button Text"
                                                    value={
                                                      block.content
                                                        ?.buttonText || ""
                                                    }
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
                                                    value={
                                                      block.content
                                                        ?.buttonLink || ""
                                                    }
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
                                                        value={
                                                          block.content
                                                            ?.buttonBgColor ||
                                                          "#dd3333"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonBgColor ||
                                                          "#dd3333"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonTextColor ||
                                                          "#ffffff"
                                                        }
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
                                                        value={
                                                          block.content
                                                            ?.buttonTextColor ||
                                                          "#ffffff"
                                                        }
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
                                                  <h4 className="font-medium text-sm">
                                                    List Items:
                                                  </h4>
                                                  <DragDropContext
                                                    onDragEnd={(result) => {
                                                      if (!result.destination)
                                                        return;
                                                      const items = Array.from(
                                                        block.content
                                                          ?.listItems || []
                                                      );
                                                      const [reorderedItem] =
                                                        items.splice(
                                                          result.source.index,
                                                          1
                                                        );
                                                      items.splice(
                                                        result.destination
                                                          .index,
                                                        0,
                                                        reorderedItem
                                                      );
                                                      handleBlockContentChange(
                                                        index,
                                                        "listItems",
                                                        items
                                                      );
                                                    }}
                                                  >
                                                    <Droppable
                                                      droppableId={`list-items-${index}`}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          {...provided.droppableProps}
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          className="space-y-3"
                                                        >
                                                          {(
                                                            block.content
                                                              ?.listItems || []
                                                          ).map(
                                                            (
                                                              item,
                                                              itemIndex
                                                            ) => (
                                                              <Draggable
                                                                key={`list-item-${index}-${itemIndex}`}
                                                                draggableId={`list-item-${index}-${itemIndex}`}
                                                                index={
                                                                  itemIndex
                                                                }
                                                              >
                                                                {(provided) => (
                                                                  <div
                                                                    ref={
                                                                      provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    className="flex items-center space-x-2 border p-3 rounded bg-slate-50"
                                                                  >
                                                                    <div
                                                                      {...provided.dragHandleProps}
                                                                      className="cursor-move text-gray-400 hover:text-gray-600"
                                                                    >
                                                                      <Icon
                                                                        icon="Bars3"
                                                                        className="h-5 w-5"
                                                                      />
                                                                    </div>
                                                                    <Textinput
                                                                      value={
                                                                        item.text ||
                                                                        ""
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) =>
                                                                        handleItemChange(
                                                                          index,
                                                                          "listItems",
                                                                          itemIndex,
                                                                          "text",
                                                                          e
                                                                            .target
                                                                            .value
                                                                        )
                                                                      }
                                                                      className="flex-grow"
                                                                      placeholder={`List item ${
                                                                        itemIndex +
                                                                        1
                                                                      }`}
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
                                                      handleAddItem(
                                                        index,
                                                        "listItems",
                                                        {
                                                          text: "",
                                                        }
                                                      )
                                                    }
                                                    icon="Plus"
                                                    type="button"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {block.type === "partners" && (
                                              <div className="space-y-3">
                                                <Textinput
                                                  label="Section Title"
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "sectionTitle",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Our Partners"
                                                />
                                                <Textarea
                                                  label="Section Description"
                                                  value={
                                                    block.content
                                                      ?.sectionDescription || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "sectionDescription",
                                                      e.target.value
                                                    )
                                                  }
                                                  rows={2}
                                                  placeholder="Brief description about your partners"
                                                />

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Colored Description Section
                                                    Background
                                                  </label>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="color"
                                                      value={
                                                        block.content
                                                          ?.coloredSectionBg ||
                                                        "#f3f4f6"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "coloredSectionBg",
                                                          e.target.value
                                                        )
                                                      }
                                                      className="h-9 w-16 p-1 border rounded mr-2"
                                                    />
                                                    <Textinput
                                                      value={
                                                        block.content
                                                          ?.coloredSectionBg ||
                                                        "#f3f4f6"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "coloredSectionBg",
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="#f3f4f6"
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Colored Description Section
                                                    Text Color
                                                  </label>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="color"
                                                      value={
                                                        block.content
                                                          ?.coloredSectionTextColor ||
                                                        "#000000"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "coloredSectionTextColor",
                                                          e.target.value
                                                        )
                                                      }
                                                      className="h-9 w-16 p-1 border rounded mr-2"
                                                    />
                                                    <Textinput
                                                      value={
                                                        block.content
                                                          ?.coloredSectionTextColor ||
                                                        "#000000"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "coloredSectionTextColor",
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="#000000"
                                                    />
                                                  </div>
                                                </div>

                                                <Textinput
                                                  label="Colored Section Text"
                                                  value={
                                                    block.content
                                                      ?.coloredSectionText || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "coloredSectionText",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Over 2500 companies use our tools to better their business."
                                                />

                                                <Textinput
                                                  label="Colored Section Link Text"
                                                  value={
                                                    block.content
                                                      ?.coloredSectionLinkText ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "coloredSectionLinkText",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Read our customer stories"
                                                />

                                                <Textinput
                                                  label="Colored Section Link URL"
                                                  value={
                                                    block.content
                                                      ?.coloredSectionLinkUrl ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "coloredSectionLinkUrl",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="/customer-stories"
                                                />

                                                <div className="space-y-4 mt-2 border-t pt-4">
                                                  <h4 className="font-medium text-sm">
                                                    Partner Logos:
                                                  </h4>
                                                  {(
                                                    block.content?.partners ||
                                                    []
                                                  ).map(
                                                    (partner, partnerIndex) => {
                                                      const identifier = {
                                                        blockIndex: index,
                                                        partnerIndex:
                                                          partnerIndex,
                                                      };
                                                      const uploadKey = `partner-${index}-${partnerIndex}`;
                                                      const uState =
                                                        uploadStates[
                                                          uploadKey
                                                        ] || {
                                                          loading: false,
                                                          error: null,
                                                        };
                                                      return (
                                                        <div
                                                          key={partnerIndex}
                                                          className="border p-3 rounded bg-slate-50 space-y-3 relative"
                                                        >
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleRemoveItem(
                                                                index,
                                                                "partners",
                                                                partnerIndex
                                                              )
                                                            }
                                                            className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full z-10"
                                                            aria-label="Remove Partner"
                                                          >
                                                            <Icon
                                                              icon="XMark"
                                                              className="h-4 w-4"
                                                            />
                                                          </button>

                                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            <div className="sm:col-span-1">
                                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Partner{" "}
                                                                {partnerIndex +
                                                                  1}{" "}
                                                                Logo*
                                                              </label>
                                                              <MediaUpload
                                                                file={
                                                                  partner.imageUrl
                                                                }
                                                                onDrop={(e) =>
                                                                  handlePartnerImageUpload(
                                                                    e,
                                                                    identifier
                                                                  )
                                                                }
                                                                onRemove={() =>
                                                                  handleRemovePartnerImage(
                                                                    identifier
                                                                  )
                                                                }
                                                                loading={
                                                                  uState.loading
                                                                }
                                                                error={
                                                                  uState.error
                                                                }
                                                                maxSize={
                                                                  5 *
                                                                  1024 *
                                                                  1024
                                                                }
                                                                identifier={
                                                                  identifier
                                                                }
                                                              />
                                                            </div>
                                                            <div className="sm:col-span-2 space-y-3">
                                                              <Textinput
                                                                label={`Partner ${
                                                                  partnerIndex +
                                                                  1
                                                                } Name`}
                                                                value={
                                                                  partner.name ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "partners",
                                                                    partnerIndex,
                                                                    "name",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                placeholder="Partner name"
                                                              />
                                                              <Textinput
                                                                label={`Partner ${
                                                                  partnerIndex +
                                                                  1
                                                                } URL`}
                                                                value={
                                                                  partner.url ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  handleItemChange(
                                                                    index,
                                                                    "partners",
                                                                    partnerIndex,
                                                                    "url",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                placeholder="https://partner-website.com"
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                  <Button
                                                    text="Add Partner"
                                                    className="btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                      handleAddItem(
                                                        index,
                                                        "partners",
                                                        {
                                                          imageUrl: null,
                                                          name: "",
                                                          url: "",
                                                        }
                                                      )
                                                    }
                                                    icon="Plus"
                                                    type="button"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {block.type === "form" && (
                                              <div className="space-y-3">
                                                <Textinput
                                                  label="Section Title"
                                                  value={
                                                    block.content
                                                      ?.sectionTitle || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "sectionTitle",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Contact Us"
                                                />

                                                <Textarea
                                                  label="Section Description"
                                                  value={
                                                    block.content
                                                      ?.description || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleBlockContentChange(
                                                      index,
                                                      "description",
                                                      e.target.value
                                                    )
                                                  }
                                                  rows={3}
                                                  placeholder="Fill out the form below to get in touch with us"
                                                />

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Select Form
                                                  </label>
                                                  <Select
                                                    value={
                                                      block.content?.formId ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      handleBlockContentChange(
                                                        index,
                                                        "formId",
                                                        e.target.value
                                                          ? parseInt(
                                                              e.target.value
                                                            )
                                                          : null
                                                      )
                                                    }
                                                    options={[
                                                      {
                                                        value: "",
                                                        label:
                                                          "- Select a form -",
                                                      },
                                                      ...(
                                                        block._forms || []
                                                      ).map((form) => ({
                                                        value:
                                                          form.id.toString(),
                                                        label: form.title,
                                                      })),
                                                    ]}
                                                  />
                                                  {/* The "Load Forms" button below will be removed */}
                                                  {/*
                                                  <button
                                                    type="button"
                                                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                    onClick={async () => {
                                                      try {
                                                        const { data } =
                                                          await http.get(
                                                            "/forms/published"
                                                          );
                                                        const updatedBlocks = [
                                                          ...formData.blocks,
                                                        ];
                                                        updatedBlocks[index] = {
                                                          ...updatedBlocks[
                                                            index
                                                          ],
                                                          _forms: data || [],
                                                        };
                                                        setFormData((prev) => ({
                                                          ...prev,
                                                          blocks: updatedBlocks,
                                                        }));
                                                        toast.success(
                                                          "Forms loaded successfully"
                                                        );
                                                      } catch (error) {
                                                        console.error(
                                                          "Error loading forms:",
                                                          error
                                                        );
                                                        toast.error(
                                                          "Failed to load forms"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <Icon
                                                      icon="ArrowPath"
                                                      className="h-4 w-4 mr-1"
                                                    />
                                                    Load Forms
                                                  </button>
                                                  */}
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Submit Button Text
                                                  </label>
                                                  <Textinput
                                                    value={
                                                      block.content
                                                        ?.buttonText || ""
                                                    }
                                                    onChange={(e) =>
                                                      handleBlockContentChange(
                                                        index,
                                                        "buttonText",
                                                        e.target.value
                                                      )
                                                    }
                                                    placeholder="Submit"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Button Color
                                                  </label>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="color"
                                                      value={
                                                        block.content
                                                          ?.buttonColor ||
                                                        "#2563eb"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "buttonColor",
                                                          e.target.value
                                                        )
                                                      }
                                                      className="h-9 w-16 p-1 border rounded mr-2"
                                                    />
                                                    <Textinput
                                                      value={
                                                        block.content
                                                          ?.buttonColor ||
                                                        "#2563eb"
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "buttonColor",
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="#2563eb"
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Success Message
                                                  </label>
                                                  <Textarea
                                                    value={
                                                      block.content
                                                        ?.successMessage || ""
                                                    }
                                                    onChange={(e) =>
                                                      handleBlockContentChange(
                                                        index,
                                                        "successMessage",
                                                        e.target.value
                                                      )
                                                    }
                                                    rows={2}
                                                    placeholder="Thank you for your submission! We'll get back to you soon."
                                                  />
                                                </div>

                                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                                  <div className="flex items-center mb-2">
                                                    <input
                                                      type="checkbox"
                                                      className="h-4 w-4 text-primary-600 border-gray-300 rounded mr-2"
                                                      checked={
                                                        block.content
                                                          ?.showBackground ||
                                                        false
                                                      }
                                                      onChange={(e) =>
                                                        handleBlockContentChange(
                                                          index,
                                                          "showBackground",
                                                          e.target.checked
                                                        )
                                                      }
                                                      id={`show-bg-${index}`}
                                                    />
                                                    <label
                                                      htmlFor={`show-bg-${index}`}
                                                      className="text-sm text-gray-700"
                                                    >
                                                      Show Background
                                                    </label>
                                                  </div>

                                                  {block.content
                                                    ?.showBackground && (
                                                    <div>
                                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Background Color
                                                      </label>
                                                      <div className="flex items-center">
                                                        <input
                                                          type="color"
                                                          value={
                                                            block.content
                                                              ?.backgroundColor ||
                                                            "#f3f4f6"
                                                          }
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
                                                          value={
                                                            block.content
                                                              ?.backgroundColor ||
                                                            "#f3f4f6"
                                                          }
                                                          onChange={(e) =>
                                                            handleBlockContentChange(
                                                              index,
                                                              "backgroundColor",
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder="#f3f4f6"
                                                        />
                                                      </div>
                                                    </div>
                                                  )}
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
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0">
                <Button
                  text="Preview Page"
                  className="btn-outline-secondary"
                  type="button"
                  icon="Eye"
                  onClick={handlePreviewToggle}
                />
                <Button
                  text="Cancel"
                  className="btn-outline-dark"
                  icon="XMark"
                  onClick={() => router.push("/admin/pages")}
                />
                <Button
                  text={isEditMode ? "Update Page" : "Create Page"}
                  className="btn-primary"
                  type="submit"
                  icon="Check"
                  isLoading={loading}
                  disabled={
                    loading ||
                    Object.values(uploadStates).some((s) => s.loading)
                  }
                />
              </div>
            </div>
          </div>{" "}
          {/* End of space-y-6 div */}
        </form>
      </div>
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
                aria-selected={activeTab === "page"}
                onClick={() => setActiveTab("page")}
                className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === "page"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Page
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "block"}
                onClick={() => setActiveTab("block")}
                className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === "block"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Block
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

          {/* Page tab content */}
          {/* Page tab content */}
          {activeTab === "page" && (
            <div className="p-4 space-y-5">
              {" "}
              {/* Added consistent padding and vertical spacing */}
              {/* Page title card - Simplified */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center">
                  <Icon
                    icon="DocumentText"
                    className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0"
                  />
                  <h2
                    className="text-sm font-semibold text-gray-800 truncate flex-grow"
                    title={formData.title || "Untitled Page"}
                  >
                    {formData.title || "Untitled Page"}
                  </h2>
                  {/* Optional: Add functionality later if needed
                  <button className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
                    <Icon icon="Cog" className="h-4 w-4" />
                  </button>
                   */}
                </div>
              </div>
              {/* Featured image */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">
                  Featured Image
                </label>
                {formData.ogImage ? (
                  <div className="relative group">
                    <img
                      src={formData.ogImage.url}
                      alt="Featured"
                      className="w-full h-36 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => handleRemoveOgImage("ogImage")}
                      className="absolute top-1.5 right-1.5 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow text-gray-700 hover:bg-white hover:text-red-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                      aria-label="Remove featured image"
                    >
                      <Icon icon="XMark" className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button" // Explicitly set type
                    onClick={() =>
                      document.getElementById("featuredImageInput").click()
                    }
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-6 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-150 text-gray-500"
                  >
                    <Icon icon="Photo" className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">
                      Set featured image
                    </span>
                    <input
                      id="featuredImageInput"
                      type="file"
                      accept="image/*" // Added accept attribute
                      className="hidden"
                      onChange={(e) => handleOgImageUpload(e, "ogImage")}
                    />
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Used for social sharing (OG Image). Recommended: 1200x630.
                </p>
              </div>
              {/* Info rows - Structured with Disclosure for less critical info */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Page Details
                </h3>

                {/* Status */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Status:</span>
                  {/* Consider making this a dropdown/select later */}
                  <div
                    className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <Icon
                      icon={
                        formData.status === "published"
                          ? "CheckCircle"
                          : "Clock"
                      }
                      className="h-3 w-3 mr-1"
                    />
                    <span>
                      {formData.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Slug */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Slug:</span>
                  <span
                    className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs truncate max-w-[160px]"
                    title={formData.slug}
                  >
                    /{formData.slug}
                  </span>
                </div>

                {/* Last Edited / Publish Date */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Published:</span>
                  <span className="text-gray-700 text-xs">
                    {/* Add logic for actual publish date later */}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Collapsible Section for less critical info */}
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between items-center w-full text-sm text-gray-600 hover:text-gray-900 pt-2 mt-2 border-t border-gray-100">
                        <span>More Details</span>
                        <Icon
                          icon="ChevronDown"
                          className={`h-4 w-4 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
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
                        <Disclosure.Panel className="pt-2 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">
                              Author:
                            </span>
                            <span className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
                              admin {/* Replace with dynamic author later */}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">
                              Template:
                            </span>
                            <span className="text-gray-800 text-xs">
                              Default{" "}
                              {/* Replace with dynamic template later */}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">
                              Parent:
                            </span>
                            <span className="text-gray-800 text-xs">
                              None {/* Replace with dynamic parent later */}
                            </span>
                          </div>
                          {/* Lock Modified Date Toggle - Simplified */}
                          {/* <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                            <label htmlFor="lockDateToggle" className="text-sm text-gray-600 font-medium cursor-pointer">
                              Lock Set as Main Page (Homepage)Modified Date
                            </label>
                       
                            <input
                              id="lockDateToggle"
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              // Add state and onChange handler later
                            />
                          </div> */}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </div>
              {/* SEO section */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  SEO Settings
                </h3>
                <div>
                  <Textinput
                    label="Meta Title"
                    name="metaTitle"
                    placeholder="Page Title"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Textinput
                    label="Meta Keywords"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    placeholder="Keywords, comma-separated"
                  />
                </div>
              </div>
              {/* Move to trash button */}
              {/* <div className="border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                 
                     toast.warn("Delete functionality not yet implemented.");
                  }}
                  className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                   <Icon icon="Trash" className="h-4 w-4 mr-1.5" />
                  Move to trash
                </button>
              </div> */}
            </div>
          )}

          {/* Block tab content */}
          {activeTab === "block" && (
            <div className="p-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 "
                    >
                      {formData.blocks.map((block, index) => (
                        <Draggable
                          key={block.id || `sidebar-block-key-${index}`} // Unique key
                          draggableId={`sidebar-block-${block.id || index}`} // Unique draggableId
                          index={index}
                        >
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
                            >
                              <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center flex-grow min-w-0">
                                  {" "}
                                  {/* Added flex-grow and min-w-0 */}
                                  <div
                                    {...providedDraggable.dragHandleProps} // Apply drag handle here
                                    className="mr-2 cursor-move p-1 text-gray-400 hover:text-gray-600" // Added padding for easier grabbing
                                    aria-label="Drag block"
                                  >
                                    <Icon
                                      icon="Bars3" // Using Bars3 like the main editor
                                      className="h-5 w-5"
                                    />
                                  </div>
                                  <h3 className="font-medium text-gray-700 text-sm truncate">
                                    {" "}
                                    {/* Added text-sm and truncate */}
                                    {block.title ||
                                      `${
                                        block.type.charAt(0).toUpperCase() +
                                        block.type.slice(1)
                                      } Block` ||
                                      "Untitled Block"}{" "}
                                    {/* Show type if title empty */}
                                  </h3>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                  {" "}
                                  {/* Reduced space */}
                                  {/* <button
                                    onClick={() =>
                                      handleBlockPreviewToggle(index)
                                    }
                                    className="p-1 text-gray-500 hover:text-blue-600 rounded"
                                    aria-label="Preview Block"
                                  >
                                    <Icon icon="Eye" className="h-4 w-4" />
                                  </button> */}
                                  <button
                                    onClick={() => handleToggleBlockTab(index)}
                                    className={`p-1 rounded ${
                                      block.isExpanded
                                        ? "text-green-600 hover:text-green-800" // Green when expanded
                                        : "text-red-600 hover:text-red-800" // Red when collapsed
                                    }`}
                                    aria-label="Edit Block"
                                  >
                                    <Icon icon="Pencil" className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveBlock(index)}
                                    className="p-1 text-gray-500 hover:text-red-500 rounded"
                                    aria-label="Remove Block"
                                  >
                                    <Icon icon="Trash" className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {formData.blocks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No blocks added yet. Add blocks from the editor.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar toggle button (visible on smaller screens) */}
      {!sidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Icon icon="Cog" className="h-6 w-6 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default PageForm;
