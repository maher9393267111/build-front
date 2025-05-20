
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
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
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

const TipTapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const headingMenuRef = useRef(null);
  const insertMenuRef = useRef(null);
  const colorMenuRef = useRef(null);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  // New function to add checkmark list
  const addCheckmarkList = useCallback(() => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    
    if (text) {
      // If text is selected, convert it to checkmark list
      const lines = text.split('\n').filter(line => line.trim());
      const checkmarkList = lines.map(line => `✅ ${line.trim()}`).join('\n\n');
      editor.chain().focus().deleteSelection().insertContent(checkmarkList).run();
    } else {
      // If no text selected, insert a new checkmark list item
      editor.chain().focus().insertContent('✅ ').run();
    }
  }, [editor]);

  const textColors = [
    { color: '#000000', name: 'Black' }, { color: '#FFFFFF', name: 'White' }, { color: '#FF0000', name: 'Red' }, 
    { color: '#00FF00', name: 'Green' }, { color: '#0000FF', name: 'Blue' }, { color: '#FFFF00', name: 'Yellow' },
    { color: '#FF00FF', name: 'Magenta' }, { color: '#00FFFF', name: 'Cyan' }, { color: '#FFA500', name: 'Orange' },
    { color: '#800080', name: 'Purple' }, { color: '#A52A2A', name: 'Brown' }, { color: '#808080', name: 'Gray' },
  ];

  const bgColors = [
    { color: '#FFFFFF', name: 'White' }, { color: '#F8F9FA', name: 'Light Gray' }, { color: '#F0F0F0', name: 'Silver' },
    { color: '#FFEEEE', name: 'Light Red' }, { color: '#EEFFEE', name: 'Light Green' }, { color: '#EEEEFF', name: 'Light Blue' },
    { color: '#FFFFEE', name: 'Light Yellow' }, { color: '#FFDDFF', name: 'Light Pink' }, { color: '#DDFFFF', name: 'Light Cyan' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) setShowHeadingMenu(false);
      if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) setShowInsertMenu(false);
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) setShowColorMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10 p-2 rounded-t-lg flex flex-wrap gap-2 items-center">
      <div className="relative" ref={headingMenuRef}>
        <button type="button" onClick={() => setShowHeadingMenu(!showHeadingMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[80px] justify-between">
          <span className="font-medium text-gray-700">
            {editor.isActive('heading', { level: 1 }) ? 'H1' :
             editor.isActive('heading', { level: 2 }) ? 'H2' :
             editor.isActive('heading', { level: 3 }) ? 'H3' : 'Normal'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {showHeadingMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px] z-20">
            {[ { label: 'Normal', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
              { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
              { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
              { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
            ].map(item => (
              <button key={item.label} type="button" onClick={() => { item.action(); setShowHeadingMenu(false); }} className={`p-2 hover:bg-gray-100 w-full text-left ${item.active ? 'bg-gray-50 font-semibold' : ''}`}>{item.label}</button>
            ))}
          </div>
        )}
      </div>
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      <div className="flex items-center gap-1">
        {[{ icon: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
         { icon: 'M19 4h-9 M14 20H5 M15 4L9 20', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
         { icon: 'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3 M4 21h16', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
        ].map(item => (
          <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
          </button>
        ))}
      </div>
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      <div className="relative" ref={colorMenuRef}>
        <button type="button" onClick={() => setShowColorMenu(!showColorMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1" title="Text & Background Colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4 M21 12v7a2 2 0 0 1-2.2 2c-.68 0-1.3-.38-1.64-1L12 11 M9 8c.4 0 .78.11 1.11.32 M3 8c0-1.1.9-2 2-2 M11.1 3.08A3.93 3.93 0 0 0 8 2c-2.2 0-4 1.8-4 4 M2 22h20"/></svg>
            <span className="font-medium text-gray-700 text-xs">Colors</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {showColorMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-3 z-20 min-w-[240px]">
                <div className="mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Text</h3>
                    <div className="grid grid-cols-6 gap-1">
                        {textColors.map(c => <button key={c.color} type="button" onClick={() => editor.chain().focus().setColor(c.color).run()} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: c.color }} title={c.name}></button>)}
                        <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center bg-white" title="Remove color"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Background</h3>
                    <div className="grid grid-cols-6 gap-1">
                        {bgColors.map(c => <button key={c.color} type="button" onClick={() => editor.chain().focus().toggleHighlight({ color: c.color }).run()} className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: c.color }} title={c.name}></button>)}
                        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center bg-white" title="Remove background"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      <div className="flex items-center gap-1">
        {[{ icon: 'M9 6h11 M9 12h11 M9 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
         { icon: 'M9 6h11 M9 12h11 M9 18h11 M5 6h-1 M5 12h-1 M5 18h-1', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
         // Add the new checkmark list button
         { icon: 'M20 6L9 17l-5-5', action: addCheckmarkList, active: false, title: 'Checkmark List (✅)' },
         { icon: 'M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1 M7 22H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Blockquote' },
        ].map(item => (
          <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
          </button>
        ))}
      </div>
       <div className="h-6 w-px bg-gray-300 mx-1"></div>
      <div className="flex items-center gap-1">
        {[{ icon: 'M4 6h16 M4 12h10 M4 18h14', action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }), title: 'Align Left' },
            { icon: 'M4 6h16 M7 12h10 M6 18h12', action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }), title: 'Align Center' },
            { icon: 'M4 6h16 M10 12h10 M8 18h12', action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }), title: 'Align Right' },
        ].map(item => (
            <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
            </button>
        ))}
      </div>
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      <div className="relative" ref={insertMenuRef}>
          <button type="button" onClick={() => setShowInsertMenu(!showInsertMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1" title="Insert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              <span className="font-medium text-gray-700 text-xs">Insert</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {showInsertMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[180px] z-20">
                  {[ { label: 'Link', icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', action: setLink },
                    { label: 'Image', icon: 'M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z M21 15l-5-5-11 11', action: addImage },
                    { label: 'YouTube', icon: 'M2 4h20v16H2z M10 8l6 4-6 4z', action: addYoutubeVideo },
                    { label: 'Table', icon: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18', action: addTable },
                    { label: 'Divider', icon: 'M5 12h14', action: () => editor.chain().focus().setHorizontalRule().run() },
                    { label: 'Code Block', icon: 'M16 18l6-6-6-6 M8 6l-6 6 6 6', action: () => editor.chain().focus().toggleCodeBlock().run() },
                    // Add checkmark list to insert menu as well
                    { label: 'Checkmark List', icon: 'M20 6L9 17l-5-5', action: addCheckmarkList },
                  ].map(item => (
                      <button key={item.label} type="button" onClick={() => { item.action(); setShowInsertMenu(false); }} className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon}/></svg>
                          {item.label}
                      </button>
                  ))}
              </div>
          )}
      </div>
      <div className="flex-grow"></div>
      <div className="flex items-center gap-1">
        {[{ icon: 'M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6', action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: 'Undo' },
         { icon: 'M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6', action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: 'Redo' },
        ].map(item => (
          <button key={item.title} type="button" onClick={item.action} disabled={item.disabled} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30" title={item.title}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
          </button>
        ))}
      </div>
    </div>
  );
};

const editorStyles = `
  .ProseMirror {
    min-height: 300px;
    padding: 1rem;
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    border: 1px solid #e5e7eb; /* cool-gray-300 */
    border-top: none;
    outline: none;
    overflow-y: auto;
  }
  .ProseMirror p { margin-bottom: 0.75rem; }
  .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; }
  .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem; }
  .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #6b7280; margin: 1rem 0; }
  .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
  .ProseMirror ul { list-style-type: disc; }
  .ProseMirror ol { list-style-type: decimal; }
  .ProseMirror a { color: #3b82f6; text-decoration: underline; }
  .ProseMirror img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 0.5rem; }
  .ProseMirror .youtube-video { width: 100%; aspect-ratio: 16/9; margin: 1rem 0; border-radius: 0.5rem; overflow: hidden; }
  .ProseMirror .ProseMirror-placeholder { color: #9ca3af; pointer-events: none; position: absolute; }
  .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1rem 0; overflow: hidden; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
  .ProseMirror th { background-color: #f3f4f6; font-weight: bold; text-align: left; }
  .ProseMirror td, .ProseMirror th { border: 1px solid #e5e7eb; padding: 0.5rem; position: relative; min-width: 50px; }
  .ProseMirror code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
  .ProseMirror pre { background-color: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.375rem; font-family: monospace; overflow-x: auto; margin: 1rem 0; }
  .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0; }
  
  /* Custom styles for checkmark lists */
  .ProseMirror p:has-text('✅') {
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
`;

const TipTapEditor = ({ content, onChange, placeholder = 'Write something...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline' } }),
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' } }),
      Underline, TextStyle, Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'youtube-video' } }),
      Highlight.configure({ multicolor: true }),
      Typography, CodeBlock, HorizontalRule,
      Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
      FontFamily.configure({ types: ['textStyle'] }),
      Subscript, Superscript,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false to avoid re-triggering onUpdate
    }
  }, [content, editor]);

  return (
    <div className="tiptap-editor-container rounded-lg border border-gray-300">
      <style jsx>{editorStyles}</style>
      {editor && <TipTapToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;


// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import TextAlign from '@tiptap/extension-text-align';
// import Youtube from '@tiptap/extension-youtube';
// import Highlight from '@tiptap/extension-highlight';
// import Typography from '@tiptap/extension-typography';
// import CodeBlock from '@tiptap/extension-code-block';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import FontFamily from '@tiptap/extension-font-family';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';
// import HorizontalRule from '@tiptap/extension-horizontal-rule';

// const TipTapToolbar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   const [showHeadingMenu, setShowHeadingMenu] = useState(false);
//   const [showInsertMenu, setShowInsertMenu] = useState(false);
//   const [showColorMenu, setShowColorMenu] = useState(false);

//   const headingMenuRef = useRef(null);
//   const insertMenuRef = useRef(null);
//   const colorMenuRef = useRef(null);

//   const addImage = useCallback(() => {
//     const url = window.prompt('Enter image URL');
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   }, [editor]);

//   const addYoutubeVideo = useCallback(() => {
//     const url = window.prompt('YouTube URL');
//     if (url) {
//       editor.chain().focus().setYoutubeVideo({ src: url }).run();
//     }
//   }, [editor]);

//   const setLink = useCallback(() => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('URL', previousUrl);
//     if (url === null) return;
//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }
//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   }, [editor]);

//   const addTable = useCallback(() => {
//     editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
//   }, [editor]);

//   const textColors = [
//     { color: '#000000', name: 'Black' }, { color: '#FFFFFF', name: 'White' }, { color: '#FF0000', name: 'Red' }, 
//     { color: '#00FF00', name: 'Green' }, { color: '#0000FF', name: 'Blue' }, { color: '#FFFF00', name: 'Yellow' },
//     { color: '#FF00FF', name: 'Magenta' }, { color: '#00FFFF', name: 'Cyan' }, { color: '#FFA500', name: 'Orange' },
//     { color: '#800080', name: 'Purple' }, { color: '#A52A2A', name: 'Brown' }, { color: '#808080', name: 'Gray' },
//   ];

//   const bgColors = [
//     { color: '#FFFFFF', name: 'White' }, { color: '#F8F9FA', name: 'Light Gray' }, { color: '#F0F0F0', name: 'Silver' },
//     { color: '#FFEEEE', name: 'Light Red' }, { color: '#EEFFEE', name: 'Light Green' }, { color: '#EEEEFF', name: 'Light Blue' },
//     { color: '#FFFFEE', name: 'Light Yellow' }, { color: '#FFDDFF', name: 'Light Pink' }, { color: '#DDFFFF', name: 'Light Cyan' },
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) setShowHeadingMenu(false);
//       if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) setShowInsertMenu(false);
//       if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) setShowColorMenu(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="border-b border-gray-200 bg-white sticky top-0 z-10 p-2 rounded-t-lg flex flex-wrap gap-2 items-center">
//       <div className="relative" ref={headingMenuRef}>
//         <button type="button" onClick={() => setShowHeadingMenu(!showHeadingMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[80px] justify-between">
//           <span className="font-medium text-gray-700">
//             {editor.isActive('heading', { level: 1 }) ? 'H1' :
//              editor.isActive('heading', { level: 2 }) ? 'H2' :
//              editor.isActive('heading', { level: 3 }) ? 'H3' : 'Normal'}
//           </span>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
//         </button>
//         {showHeadingMenu && (
//           <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px] z-20">
//             {[ { label: 'Normal', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
//               { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
//               { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
//               { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
//             ].map(item => (
//               <button key={item.label} type="button" onClick={() => { item.action(); setShowHeadingMenu(false); }} className={`p-2 hover:bg-gray-100 w-full text-left ${item.active ? 'bg-gray-50 font-semibold' : ''}`}>{item.label}</button>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="h-6 w-px bg-gray-300 mx-1"></div>
//       <div className="flex items-center gap-1">
//         {[{ icon: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
//          { icon: 'M19 4h-9 M14 20H5 M15 4L9 20', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
//          { icon: 'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3 M4 21h16', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
//         ].map(item => (
//           <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
//           </button>
//         ))}
//       </div>
//       <div className="h-6 w-px bg-gray-300 mx-1"></div>
//       <div className="relative" ref={colorMenuRef}>
//         <button type="button" onClick={() => setShowColorMenu(!showColorMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1" title="Text & Background Colors">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4 M21 12v7a2 2 0 0 1-2.2 2c-.68 0-1.3-.38-1.64-1L12 11 M9 8c.4 0 .78.11 1.11.32 M3 8c0-1.1.9-2 2-2 M11.1 3.08A3.93 3.93 0 0 0 8 2c-2.2 0-4 1.8-4 4 M2 22h20"/></svg>
//             <span className="font-medium text-gray-700 text-xs">Colors</span>
//             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
//         </button>
//         {showColorMenu && (
//             <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-3 z-20 min-w-[240px]">
//                 <div className="mb-3">
//                     <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Text</h3>
//                     <div className="grid grid-cols-6 gap-1">
//                         {textColors.map(c => <button key={c.color} type="button" onClick={() => editor.chain().focus().setColor(c.color).run()} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: c.color }} title={c.name}></button>)}
//                         <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center bg-white" title="Remove color"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
//                     </div>
//                 </div>
//                 <div>
//                     <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Background</h3>
//                     <div className="grid grid-cols-6 gap-1">
//                         {bgColors.map(c => <button key={c.color} type="button" onClick={() => editor.chain().focus().toggleHighlight({ color: c.color }).run()} className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: c.color }} title={c.name}></button>)}
//                         <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center bg-white" title="Remove background"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
//                     </div>
//                 </div>
//             </div>
//         )}
//       </div>
//       <div className="h-6 w-px bg-gray-300 mx-1"></div>
//       <div className="flex items-center gap-1">
//         {[{ icon: 'M9 6h11 M9 12h11 M9 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
//          { icon: 'M9 6h11 M9 12h11 M9 18h11 M5 6h-1 M5 12h-1 M5 18h-1', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
//          { icon: 'M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1 M7 22H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Blockquote' },
//         ].map(item => (
//           <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
//           </button>
//         ))}
//       </div>
//        <div className="h-6 w-px bg-gray-300 mx-1"></div>
//       <div className="flex items-center gap-1">
//         {[{ icon: 'M4 6h16 M4 12h10 M4 18h14', action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }), title: 'Align Left' },
//             { icon: 'M4 6h16 M7 12h10 M6 18h12', action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }), title: 'Align Center' },
//             { icon: 'M4 6h16 M10 12h10 M8 18h12', action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }), title: 'Align Right' },
//         ].map(item => (
//             <button key={item.title} type="button" onClick={item.action} className={`p-2 rounded hover:bg-gray-100 ${item.active ? 'bg-gray-200' : ''}`} title={item.title}>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
//             </button>
//         ))}
//       </div>
//       <div className="h-6 w-px bg-gray-300 mx-1"></div>
//       <div className="relative" ref={insertMenuRef}>
//           <button type="button" onClick={() => setShowInsertMenu(!showInsertMenu)} className="p-2 rounded hover:bg-gray-100 flex items-center gap-1" title="Insert">
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
//               <span className="font-medium text-gray-700 text-xs">Insert</span>
//               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
//           </button>
//           {showInsertMenu && (
//               <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[180px] z-20">
//                   {[ { label: 'Link', icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', action: setLink },
//                     { label: 'Image', icon: 'M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z M21 15l-5-5-11 11', action: addImage },
//                     { label: 'YouTube', icon: 'M2 4h20v16H2z M10 8l6 4-6 4z', action: addYoutubeVideo },
//                     { label: 'Table', icon: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18', action: addTable },
//                     { label: 'Divider', icon: 'M5 12h14', action: () => editor.chain().focus().setHorizontalRule().run() },
//                     { label: 'Code Block', icon: 'M16 18l6-6-6-6 M8 6l-6 6 6 6', action: () => editor.chain().focus().toggleCodeBlock().run() },
//                   ].map(item => (
//                       <button key={item.label} type="button" onClick={() => { item.action(); setShowInsertMenu(false); }} className="p-2 hover:bg-gray-100 w-full text-left flex items-center gap-2 text-sm">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon}/></svg>
//                           {item.label}
//                       </button>
//                   ))}
//               </div>
//           )}
//       </div>
//       <div className="flex-grow"></div>
//       <div className="flex items-center gap-1">
//         {[{ icon: 'M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6', action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: 'Undo' },
//          { icon: 'M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6', action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: 'Redo' },
//         ].map(item => (
//           <button key={item.title} type="button" onClick={item.action} disabled={item.disabled} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30" title={item.title}>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const editorStyles = `
//   .ProseMirror {
//     min-height: 300px;
//     padding: 1rem;
//     border-bottom-left-radius: 0.375rem;
//     border-bottom-right-radius: 0.375rem;
//     border: 1px solid #e5e7eb; /* cool-gray-300 */
//     border-top: none;
//     outline: none;
//     overflow-y: auto;
//   }
//   .ProseMirror p { margin-bottom: 0.75rem; }
//   .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; }
//   .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
//   .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem; }
//   .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #6b7280; margin: 1rem 0; }
//   .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
//   .ProseMirror ul { list-style-type: disc; }
//   .ProseMirror ol { list-style-type: decimal; }
//   .ProseMirror a { color: #3b82f6; text-decoration: underline; }
//   .ProseMirror img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 0.5rem; }
//   .ProseMirror .youtube-video { width: 100%; aspect-ratio: 16/9; margin: 1rem 0; border-radius: 0.5rem; overflow: hidden; }
//   .ProseMirror .ProseMirror-placeholder { color: #9ca3af; pointer-events: none; position: absolute; }
//   .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1rem 0; overflow: hidden; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
//   .ProseMirror th { background-color: #f3f4f6; font-weight: bold; text-align: left; }
//   .ProseMirror td, .ProseMirror th { border: 1px solid #e5e7eb; padding: 0.5rem; position: relative; min-width: 50px; }
//   .ProseMirror code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
//   .ProseMirror pre { background-color: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.375rem; font-family: monospace; overflow-x: auto; margin: 1rem 0; }
//   .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0; }
// `;

// const TipTapEditor = ({ content, onChange, placeholder = 'Write something...' }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({ placeholder }),
//       Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline' } }),
//       Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' } }),
//       Underline, TextStyle, Color,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//       Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'youtube-video' } }),
//       Highlight.configure({ multicolor: true }),
//       Typography, CodeBlock, HorizontalRule,
//       Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
//       FontFamily.configure({ types: ['textStyle'] }),
//       Subscript, Superscript,
//     ],
//     content: content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content, false); // false to avoid re-triggering onUpdate
//     }
//   }, [content, editor]);

//   return (
//     <div className="tiptap-editor-container rounded-lg border border-gray-300">
//       <style jsx>{editorStyles}</style>
//       {editor && <TipTapToolbar editor={editor} />}
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// export default TipTapEditor; 