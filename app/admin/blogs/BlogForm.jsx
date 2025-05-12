// BlogForm.jsx with TipTap editor replacing React-Quill
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'react-query';
import { getBlogCategories, createBlog, updateBlog } from '@services/api';
import http from '@services/api/http';
import { toast } from 'react-toastify';
import { XMarkIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Switch } from "@headlessui/react";
import MediaUpload from '@components/ui/MediaUpload';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Textinput from '@components/ui/TextinputBlog';
import Textarea from '@components/ui/TextareaBlog';
import Select from '@components/ui/SelectBlog';
import BlogSeoDashboard from '@components/SEO/Blog/BlogSeoDashboard';
import MediaModal from '@components/modal/MediaModal';

// TipTap imports
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import CodeBlock from '@tiptap/extension-code-block'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import FontFamily from '@tiptap/extension-font-family'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

// Custom TipTap Toolbar Component
const TipTapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  const headingMenuRef = useRef(null);
  const insertMenuRef = useRef(null);
  const colorMenuRef = useRef(null);

  const addImage = useCallback(() => {
    setImageModalOpen(true);
  }, []);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])
  
  // Text colors
  const textColors = [
    { color: '#000000', name: 'Black' },
    { color: '#FFFFFF', name: 'White' },
    { color: '#FF0000', name: 'Red' },
    { color: '#00FF00', name: 'Green' },
    { color: '#0000FF', name: 'Blue' },
    { color: '#FFFF00', name: 'Yellow' },
    { color: '#FF00FF', name: 'Magenta' },
    { color: '#00FFFF', name: 'Cyan' },
    { color: '#FFA500', name: 'Orange' },
    { color: '#800080', name: 'Purple' },
    { color: '#A52A2A', name: 'Brown' },
    { color: '#808080', name: 'Gray' },
  ];
  
  // Background colors
  const bgColors = [
    { color: '#FFFFFF', name: 'White' },
    { color: '#F8F9FA', name: 'Light Gray' },
    { color: '#F0F0F0', name: 'Silver' },
    { color: '#FFEEEE', name: 'Light Red' },
    { color: '#EEFFEE', name: 'Light Green' },
    { color: '#EEEEFF', name: 'Light Blue' },
    { color: '#FFFFEE', name: 'Light Yellow' },
    { color: '#FFDDFF', name: 'Light Pink' },
    { color: '#DDFFFF', name: 'Light Cyan' },
  ];
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
        setShowHeadingMenu(false);
      }
      if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) {
        setShowInsertMenu(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setShowColorMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageFileSelect = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  return (
    <>
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 p-2 rounded-t-lg flex flex-wrap gap-2 items-center">
        {/* Title/Headings Dropdown */}
        <div className="relative" ref={headingMenuRef}>
          <button
            type="button"
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[80px] justify-between"
          >
            <span className="font-medium text-gray-700">
              {editor.isActive('heading', { level: 1 }) ? 'Heading 1' : 
               editor.isActive('heading', { level: 2 }) ? 'Heading 2' : 
               editor.isActive('heading', { level: 3 }) ? 'Heading 3' : 'Title'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          
          {showHeadingMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[200px] z-20">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setShowHeadingMenu(false);
                }}
                className={`p-3 hover:bg-gray-100 w-full text-left ${editor.isActive('paragraph') ? 'bg-gray-50' : ''}`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setShowHeadingMenu(false);
                }}
                className={`p-3 hover:bg-gray-100 w-full text-left font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-50' : ''}`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setShowHeadingMenu(false);
                }}
                className={`p-3 hover:bg-gray-100 w-full text-left font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-50' : ''}`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setShowHeadingMenu(false);
                }}
                className={`p-3 hover:bg-gray-100 w-full text-left font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-50' : ''}`}
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4"></line>
              <line x1="14" y1="20" x2="5" y2="20"></line>
              <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
              <line x1="4" y1="21" x2="20" y2="21"></line>
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Color Menu */}
        <div className="relative" ref={colorMenuRef}>
          <button
            type="button"
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
            title="Text & Background Colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 11 3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2.2 2c-.68 0-1.3-.38-1.64-1L12 11"></path>
              <path d="M9 8c.4 0 .78.11 1.11.32"></path>
              <path d="M3 8c0-1.1.9-2 2-2"></path>
              <path d="M11.1 3.08A3.93 3.93 0 0 0 8 2c-2.2 0-4 1.8-4 4"></path>
              <path d="M2 22h20"></path>
            </svg>
            <span className="font-medium text-gray-700">Colors</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          
          {showColorMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-3 z-20 min-w-[240px]">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Text Colors</h3>
                <div className="grid grid-cols-6 gap-1">
                  {textColors.map((color) => (
                    <button
                      key={color.color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color.color).run();
                      }}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    >
                      {color.color === '#FFFFFF' && (
                        <div className="w-7 h-7 rounded-full border border-gray-300"></div>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                    }}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white"
                    title="Remove color"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Background Colors</h3>
                <div className="grid grid-cols-6 gap-1">
                  {bgColors.map((color) => (
                    <button
                      key={color.color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color: color.color }).run();
                      }}
                      className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center"
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    >
                      {color.color === '#FFFFFF' && (
                        <div className="w-7 h-7 rounded border border-gray-300"></div>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleHighlight().run();
                    }}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center bg-white"
                    title="Remove background"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6"></line>
              <line x1="9" y1="12" x2="20" y2="12"></line>
              <line x1="9" y1="18" x2="20" y2="18"></line>
              <circle cx="4" cy="6" r="2"></circle>
              <circle cx="4" cy="12" r="2"></circle>
              <circle cx="4" cy="18" r="2"></circle>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Ordered List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="20" y2="6"></line>
              <line x1="10" y1="12" x2="20" y2="12"></line>
              <line x1="10" y1="18" x2="20" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
            title="Blockquote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"></path>
              <path d="M7 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"></path>
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            title="Align Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="14" y2="12"></line>
              <line x1="4" y1="18" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            title="Align Center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="6" y1="18" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            title="Align Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="10" y1="12" x2="20" y2="12"></line>
              <line x1="6" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Insert Menu */}
        <div className="relative" ref={insertMenuRef}>
          <button
            type="button"
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
            title="Insert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span className="font-medium text-gray-700">Insert</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          
          {showInsertMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[180px] z-20">
              <button
                type="button"
                onClick={() => {
                  setLink();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Link
              </button>
              <button
                type="button"
                onClick={() => {
                  addImage();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Image
              </button>
              <button
                type="button"
                onClick={() => {
                  addYoutubeVideo();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                YouTube
              </button>
              <button
                type="button"
                onClick={() => {
                  addTable();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                Table
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHorizontalRule().run();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Divider
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                  setShowInsertMenu(false);
                }}
                className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Code Block
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow"></div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsertUrl={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
        }}
        onFileSelect={handleImageFileSelect}
      />
    </>
  );
};

function FileUpload({ file, onDrop, onRemove, loading, error, maxSize }) {
  // FileUpload component remains unchanged
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
      onDrop({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleInputChange = (e) => {
    onDrop(e);
  };

  const handleBoxClick = () => {
    if (!loading) fileInputRef.current.click();
  };

  const getFileSize = (size) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

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
      {!file ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors min-h-[120px] cursor-pointer
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
            ${error ? 'border-red-400 bg-red-50' : ''}
            ${loading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">
            Drag & drop image or <span className="text-primary-500 font-semibold">click to upload</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max {getFileSize(maxSize)}. Only images allowed.
          </p>
        </div>
      ) : (
        <div className="flex items-center border rounded-lg p-3 bg-gray-50 relative">
          <div className="w-20 h-20 rounded overflow-hidden flex items-center justify-center bg-gray-100 mr-4">
            <img
              src={file.url}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-700 truncate">
              {file.name || 'Image uploaded'}
            </div>
            <div className="text-xs text-gray-400">
              {getFileSize(file.size)}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 p-2 rounded-full hover:bg-red-100 text-red-600 transition"
            aria-label="Remove"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

const ImageUploadModal = ({ isOpen, onClose, onInsertUrl, onFileSelect }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url', 'upload', or 'library'
  const fileInputRef = useRef(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  
  if (!isOpen) return null;
  
  const handleMediaSelect = (mediaItem) => {
    if (mediaItem && mediaItem.url) {
      onInsertUrl(mediaItem.url);
      onClose();
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Insert Image</h3>
            <button 
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-5">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button 
                type='button'
                className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('url')}
              >
                URL
              </button>
              <button 
                type="button"
                className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload
              </button>
              <button 
                type="button"
                className={`py-2 px-4 ${activeTab === 'library' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('library')}
              >
                Media Library
              </button>
            </div>
            
            {/* URL Tab Content */}
            {activeTab === 'url' && (
              <div>
                <input 
                  type="text" 
                  placeholder="Enter image URL"
                  className="w-full border border-gray-300 rounded-md p-2 mb-4"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                
                <div className="flex justify-end">
                  <button
                    type='button'
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                    onClick={() => {
                      if (imageUrl.trim()) {
                        onInsertUrl(imageUrl);
                        onClose();
                      }
                    }}
                  >
                    Insert
                  </button>
                </div>
              </div>
            )}
            
            {/* Upload Tab Content */}
            {activeTab === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onFileSelect(e.target.files[0]);
                      onClose();
                    }
                  }}
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-md p-8 mb-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to select an image from your computer</p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            )}
            
            {/* Media Library Tab Content */}
            {activeTab === 'library' && (
              <div>
                <div className="text-center py-6">
                  <Button
                    text="Browse Media Library"
                    className="btn-primary"
                    onClick={() => setShowMediaModal(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Media Modal */}
      <MediaModal
        open={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelect={handleMediaSelect}
        title="Select Image"
        accept="image/*"
      />
    </>
  );
};

const BlogForm = ({ initialData = null }) => {
  const router = useRouter();
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || null);
  const [ogImage, setOgImage] = useState(initialData?.ogImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');
  const [uploadStates, setUploadStates] = useState({});
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'seo', or 'preview'
  
  // Content generation states
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState('full'); // 'full', 'intro', 'section', 'conclusion'
  const [showContentModal, setShowContentModal] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationTone, setGenerationTone] = useState('professional');
  
  // Custom editor styles
  const editorStyles = `
    .ProseMirror {
      min-height: 400px;
      padding: 1rem;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      border: 1px solid #e5e7eb;
      border-top: none;
      outline: none;
      overflow-y: auto;
    }
    
    .ProseMirror p {
      margin-bottom: 0.75rem;
    }
    
    .ProseMirror h1 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .ProseMirror h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    
    .ProseMirror h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
    }
    
    .ProseMirror blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1rem;
      font-style: italic;
      color: #6b7280;
      margin: 1rem 0;
    }
    
    .ProseMirror ul, .ProseMirror ol {
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
    }
    
    .ProseMirror ul {
      list-style-type: disc;
    }
    
    .ProseMirror ol {
      list-style-type: decimal;
    }
    
    .ProseMirror a {
      color: #3b82f6;
      text-decoration: underline;
    }
    
    .ProseMirror img {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
    }
    
    .ProseMirror .youtube-video {
      width: 100%;
      aspect-ratio: 16/9;
      margin: 1rem 0;
    }
    
    .ProseMirror .ProseMirror-placeholder {
      color: #9ca3af;
      pointer-events: none;
    }
    
    .ProseMirror table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 1rem 0;
      overflow: hidden;
    }
    
    .ProseMirror th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    
    .ProseMirror td, .ProseMirror th {
      border: 1px solid #e5e7eb;
      padding: 0.5rem;
      position: relative;
    }
    
    .ProseMirror code {
      background-color: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }
    
    .ProseMirror pre {
      background-color: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.375rem;
      font-family: monospace;
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    .ProseMirror hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 1rem 0;
    }
  `;

  // Set up TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto',
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-video rounded-lg overflow-hidden',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      CodeBlock,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      HorizontalRule,
    ],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      // Get HTML content when editor updates
      const html = editor.getHTML();
      // We don't need to save editor state or cursor position
      // since TipTap handles this internally
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: initialData || {
      isIndexing: true,
      title: '',
      excerpt: '',
      categoryId: '',
      status: 'draft',
      // SEO fields
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      canonicalUrl: '',
      robots: 'index, follow',
    },
  });


  const isIndexing = watch('isIndexing');

  // Format blog data for SEO analysis
  const getBlogDataForSeo = () => {
    const values = getValues();
    return {
      title: values.title || '',
      metaTitle: values.metaTitle || values.title || '',
      description: values.metaDescription || values.excerpt || '',
      slug: values.slug || '',
      metaKeywords: values.metaKeywords || '',
      robots: values.robots || 'index, follow',
      ogImage: ogImage,
      contentType: 'blog',
      category: values.categoryId,
      categoryName: values.category?.name,
    };
  };

  // Handle SEO suggestions
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
      switch(type) {
        case 'title':
          setValue('metaTitle', value);
          toast.success('Title suggestion applied successfully');
          break;
        case 'metaDescription':
          setValue('metaDescription', value);
          toast.success('Meta description suggestion applied successfully');
          break;
        case 'keywords':
          setValue('metaKeywords', value);
          toast.success('Keywords applied successfully');
          break;
        default:
          break;
      }
      return;
    }
    
    // Update form with SEO suggestions
    const updates = {};
    
    if (seoData.analysis?.titleSuggestion && !getValues('metaTitle')) {
      updates.metaTitle = seoData.analysis.titleSuggestion;
    }
    
    if (seoData.analysis?.metaDescriptionSuggestions?.[0] && !getValues('metaDescription')) {
      updates.metaDescription = seoData.analysis.metaDescriptionSuggestions[0];
    }
    
    if (seoData.analysis?.recommendedKeywords?.length > 0 && !getValues('metaKeywords')) {
      updates.metaKeywords = seoData.analysis.recommendedKeywords.join(', ');
    }
    
    if (Object.keys(updates).length > 0) {
      // Update form values
      Object.entries(updates).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  };

  // 

  // Get blog categories
  const { data: categories, isLoading: loadingCategories } = useQuery('blogCategories', getBlogCategories);

  // Set up mutations
  const createMutation = useMutation(createBlog, {
    onSuccess: (data) => {
      setIsSubmitting(false);
      setSavingStatus('Blog post saved successfully!');
      router.push('/admin/blogs');
    },
    onError: (error) => {
      setIsSubmitting(false);
      setSavingStatus(`Error: ${error.message}`);
    }
  });

  const updateMutation = useMutation(updateBlog, {
    onSuccess: (data) => {
      setIsSubmitting(false);
      setSavingStatus('Blog post updated successfully!');
      router.push('/admin/blogs');
    },
    onError: (error) => {
      setIsSubmitting(false);
      setSavingStatus(`Error: ${error.message}`);
    }
  });

  useEffect(() => {
    // Reset form when initialData changes
    if (initialData) {
      reset(initialData);
      if (editor) {
        editor.commands.setContent(initialData.content || '');
      }
      setFeaturedImage(initialData.featuredImage || null);
      setOgImage(initialData.ogImage || null);
    }
  }, [initialData, reset, editor]);

  // AI Content Generation functions
  const generateBlogContent = async () => {
    setIsGeneratingContent(true);
    
    try {
      const formValues = getValues();
      
      const payload = {
        title: formValues.title,
        description: formValues.excerpt || formValues.metaDescription,
        keywords: formValues.metaKeywords,
        category: categories?.find(c => c.id.toString() === formValues.categoryId)?.name,
        contentType: contentType,
        tone: generationTone,
        customPrompt: generationPrompt || undefined,
        existingContent: editor ? editor.getHTML() : '',
      };
      
      // Make API call to generate content
      const { data } = await http.post('/generate-blog-content', payload);
      
      if (data && data.generatedContent) {
        setGeneratedContent(data.generatedContent);
        setShowContentModal(true);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setSavingStatus(`Error generating content: ${error.message}`);
    } finally {
      setIsGeneratingContent(false);
    }
  };
  
  const applyGeneratedContent = () => {
    if (!generatedContent || !editor) return;
    
    // Apply based on content type
    if (contentType === 'full') {
      editor.commands.setContent(generatedContent);
    } else if (contentType === 'intro') {
      editor.commands.insertContentAt(0, generatedContent);
    } else if (contentType === 'conclusion') {
      // Append at end
      editor.commands.focus('end');
      editor.commands.insertContent(generatedContent);
    } else if (contentType === 'section') {
      // Insert at cursor position
      editor.commands.insertContent(generatedContent);
    }
    
    setShowContentModal(false);
    setGeneratedContent(null);
  };

  const handleFeaturedImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const uploadKey = `featured-image`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      setFeaturedImage({
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      setValue('featuredImage', {
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
    formData.append('file', file);
    formData.append('addToMediaLibrary', 'true');
    formData.append('setAsInUse', 'true');

    try {
      const { data } = await http.post('/uploadfile', formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
      setFeaturedImage(imageObj);
      setValue('featuredImage', imageObj);
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to upload image.';
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: errorMessage },
      }));
    }
  };

  const handleRemoveFeaturedImage = async (identifier, isFromLibrary = false) => {
    const uploadKey = `featured-image`;
    
    if (featuredImage && featuredImage._id && !isFromLibrary && !featuredImage.fromMediaLibrary) {
      try {
        await http.delete(`/deletefile?fileName=${featuredImage._id}`);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    
    setFeaturedImage(null);
    setValue('featuredImage', null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const handleOgImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const uploadKey = `og-image`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      setOgImage({
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      setValue('ogImage', {
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
    formData.append('file', file);
    formData.append('addToMediaLibrary', 'true');
    formData.append('setAsInUse', 'true');

    try {
      const { data } = await http.post('/uploadfile', formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
      setOgImage(imageObj);
      setValue('ogImage', imageObj);
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to upload image.';
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: errorMessage },
      }));
    }
  };

  const handleRemoveOgImage = async (identifier, isFromLibrary = false) => {
    const uploadKey = `og-image`;
    
    if (ogImage && ogImage._id && !isFromLibrary && !ogImage.fromMediaLibrary) {
      try {
        await http.delete(`/deletefile?fileName=${ogImage._id}`);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    
    setOgImage(null);
    setValue('ogImage', null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const onSubmit = (data) => {
    if (!editor) {
      setSavingStatus('Editor not initialized');
      return;
    }
    
    const content = editor.getHTML();
    
    if (!content || content === '<p></p>') {
      setSavingStatus('Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setSavingStatus('Saving...');

    // Create a slug from the title if it doesn't exist
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }

    // Combine form data with content
    const blogData = {
      ...data,
      content,
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...blogData });
    } else {
      createMutation.mutate(blogData);
    }
  };

  // Strip HTML tags from content for plain text analysis
  const getPlainTextContent = () => {
    if (!editor) return '';
    const html = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || '';
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'main'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('main')}
        >
          Blog Content
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'seo'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('seo')}
        >
          SEO & Optimization
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'preview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === 'main' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Information</h2>
                
                {/* Title */}
                <div className="mb-6">
                  <Textinput
                    label="Title"
                    name="title"
                    placeholder="Enter blog title"
                    required
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <Select
                    label="Category"
                    name="categoryId"
                    required
                    error={errors.categoryId?.message}
                    {...register('categoryId', { required: 'Category is required' })}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Excerpt/Summary */}
                <div className="mb-6">
                  <Textarea
                    label="Excerpt/Summary"
                    name="excerpt"
                    placeholder="Brief summary of the blog (optional)"
                    rows={3}
                    helperText="If left empty, an excerpt will be generated from the beginning of your content."
                    {...register('excerpt')}
                  />
                </div>

                {/* Featured Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image
                  </label>
                  <MediaUpload
                    file={featuredImage}
                    onDrop={(e) => handleFeaturedImageUpload(e, 'featuredImage')}
                    onRemove={() => handleRemoveFeaturedImage('featuredImage', featuredImage?.fromMediaLibrary)}
                    loading={uploadStates['featured-image']?.loading}
                    error={uploadStates['featured-image']?.error}
                    identifier='featuredImage'
                    helperText="Featured image for your blog post"
                  />
                </div>

                {/* AI Content Generation Card */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
                      <h3 className="text-md font-semibold text-indigo-800">AI Content Generation</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={contentType}
                          onChange={(e) => setContentType(e.target.value)}
                        >
                          <option value="full">Full Blog Post</option>
                          <option value="intro">Introduction</option>
                          <option value="section">Blog Section</option>
                          <option value="conclusion">Conclusion</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Writing Tone
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={generationTone}
                          onChange={(e) => setGenerationTone(e.target.value)}
                        >
                          <option value="professional">Professional</option>
                          <option value="conversational">Conversational</option>
                          <option value="authoritative">Authoritative</option>
                          <option value="friendly">Friendly</option>
                          <option value="educational">Educational</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          text={isGeneratingContent ? "Generating..." : "Generate Content"}
                          className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 w-full"
                          icon="Sparkles"
                          onClick={generateBlogContent}
                          disabled={isGeneratingContent || !watch('title')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Prompt (Optional)
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add specific instructions for the AI content generation"
                        rows={2}
                        value={generationPrompt}
                        onChange={(e) => setGenerationPrompt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* TipTap Editor */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <style jsx>{editorStyles}</style>
                  <div
                    className={`tiptap-editor-container${
                      !editor?.getHTML() && savingStatus.includes('Content cannot be empty')
                        ? ' border-2 border-red-300 rounded-lg'
                        : ''
                    }`}
                  >
                    {editor && <TipTapToolbar editor={editor} />}
                    <EditorContent editor={editor} />
                  </div>
                  {!editor?.getHTML() && savingStatus.includes('Content cannot be empty') && (
                    <p className="mt-1 text-sm text-red-600">Content is required</p>
                  )}
                </div>

                {/* Status */}
                <div className="mb-6">
                  <Select
                    label="Status"
                    name="status"
                    {...register('status')}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Textinput
                    label="Meta Title"
                    name="metaTitle"
                    placeholder="Meta title for SEO (defaults to blog title if empty)"
                    helperText="Recommended length: 50-60 characters"
                    {...register('metaTitle')}
                  />
                  
                  <Textinput
                    label="Canonical URL"
                    name="canonicalUrl"
                    placeholder="https://example.com/blog/canonical-url"
                    helperText="Optional: Use this to specify the preferred URL for SEO"
                    {...register('canonicalUrl')}
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Meta Description"
                    name="metaDescription"
                    placeholder="Meta description for SEO (defaults to excerpt if empty)"
                    rows={3}
                    helperText="Recommended length: 150-160 characters"
                    {...register('metaDescription')}
                  />
                </div>
                
                <div className="mb-6">
                  <Textinput
                    label="Meta Keywords"
                    name="metaKeywords"
                    placeholder="Comma-separated keywords"
                    {...register('metaKeywords')}
                  />
                </div>
                
                <div className="mb-6">
                  <Select
                    label="Robots Meta Tag"
                    name="robots"
                    {...register('robots')}
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Image
                  </label>
                  <p className="mb-2 text-xs text-gray-500">
                    This image will be used when sharing on social media. If not provided, featured image will be used.
                  </p>
                  <MediaUpload
                    file={ogImage}
                    onDrop={(e) => handleOgImageUpload(e, 'ogImage')}
                    onRemove={() => handleRemoveOgImage('ogImage', ogImage?.fromMediaLibrary)}
                    loading={uploadStates['og-image']?.loading}
                    error={uploadStates['og-image']?.error}
                    identifier='ogImage'
                    helperText="Recommended size: 1200x630px"
                  />
                </div>
              </div>
            </Card>
            
            {/* SEO Analysis Dashboard */}
            <BlogSeoDashboard
              pageData={getBlogDataForSeo()}
              content={getPlainTextContent()}
              onUpdateSuggestions={handleSeoSuggestions}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Preview</h2>
                
                <div className="border rounded-lg overflow-hidden">
                  {featuredImage && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={featuredImage.url} 
                        alt={watch('title') || 'Blog featured image'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {watch('title') || 'Blog Title'}
                    </h1>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      Category: {categories?.find(c => c.id.toString() === watch('categoryId'))?.name || initialData?.category?.name}
                      {' · '}
                      Status: <span className={`${watch('status') === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                        {watch('status') === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="text-gray-700 mb-4">
                      {watch('excerpt') || 'No excerpt provided'}
                    </div>
                    
                    <div className="prose max-w-none border-t pt-4 mt-4">
                      <div dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : '' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Status message */}
        {savingStatus && (
          <div
            className={`mb-6 p-3 rounded ${
              savingStatus.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {savingStatus}
          </div>
        )}

        {/* Form Actions */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg mt-6 sticky bottom-0 z-10 shadow-md">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0">
            <label className="flex items-center">
              <Switch
                checked={isIndexing}
                onChange={(checked) => setValue('isIndexing', checked)}
                className={`${
                  isIndexing ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable Google Indexing</span>
                <span
                  className={`${
                    isIndexing ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <span className="text-gray-700 font-medium ml-3">
                Enable Google Indexing
              </span>
            </label>
            <Button
              text='Cancel'
              className='btn-outline-dark'
              onClick={() => router.push('/admin/blogs')}
              type='button'
            />
            <Button
              text={isSubmitting ? 'Saving...' : initialData ? 'Update Blog' : 'Create Blog'}
              className='btn-primary'
              disabled={isSubmitting}
              type='submit'
              icon={initialData ? 'Check' : 'Plus'}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </form>

      {/* AI Content Generation Modal */}
      {showContentModal && generatedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-100 animate-fadeIn">
            <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Generated Content
              </h3>
              <button 
                onClick={() => setShowContentModal(false)}
                className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-[50vh] overflow-auto">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent }}></div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  text="Discard"
                  className="btn-outline-gray"
                  onClick={() => setShowContentModal(false)}
                />
                <Button
                  text="Apply Content"
                  className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600"
                  icon="CheckCircle"
                  onClick={applyGeneratedContent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogForm;