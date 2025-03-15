'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Trash
} from 'lucide-react';
import { useTodos } from '@/app/TodoContext/page';

const ToolbarButton = ({ onClick, Icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 hover:bg-gray-200 rounded-md transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon size={18} />
  </button>
);

export default function TodoEditor({ selectedTodo, toggleEditor }) {
  const { addTodo, updateTodo, deleteTodo } = useTodos();
  const [title, setTitle] = useState(selectedTodo?.title || 'New Task');
  const [currentTaskId, setCurrentTaskId] = useState(selectedTodo?.id || null);
  const [Underline, setUnderline] = useState(null);
  const saveTimeout = useRef(null);

  useEffect(() => {
    import('@tiptap/extension-underline')
      .then((mod) => setUnderline(mod.default))
      .catch(() => setUnderline(null));
  }, []);

  const editor = useEditor({
    extensions: useMemo(() => {
      let baseExtensions = [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })];
      if (Underline) baseExtensions.push(Underline);
      return baseExtensions;
    }, [Underline]),
    content: selectedTodo?.description || '',
    onUpdate: ({ editor }) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveTask(editor.getText().trim()), 1000);
    },
  });

  useEffect(() => {
    console.log("📝 Editor received new selectedTodo:", selectedTodo);
    if (!selectedTodo) {
      setTitle("New Task");
      setCurrentTaskId(null);
      editor?.commands.clearContent();
      return;
    }

    setTitle(selectedTodo.title);
    setCurrentTaskId(selectedTodo.id);
    editor?.commands.setContent(selectedTodo.description || "");
  }, [selectedTodo, editor]);

  const saveTask = (content) => {
    if (!editor || !content.trim()) return;

    const taskData = {
      id: currentTaskId || Date.now(),
      title: title.trim() || "Untitled Task",
      description: content.trim(),
      date: new Date().toDateString(),
    };

    if (!currentTaskId) {
      addTodo(taskData);
      setCurrentTaskId(taskData.id);
    } else {
      updateTodo(currentTaskId, taskData);
    }

    toggleEditor(taskData);
  };

  const handleDeleteTodo = () => {
    if (currentTaskId) {
      deleteTodo(currentTaskId);
      setCurrentTaskId(null);
    }
    setTitle('New Task');
    if (editor) editor.commands.clearContent();
    toggleEditor(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => toggleEditor(null)} className="flex items-center gap-1 text-lg font-bold">← Back</button>
      </div>

      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-bold text-lg bg-transparent focus:outline-none"
        />
        <button onClick={handleDeleteTodo} className="text-red-500">
          <Trash size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-md bg-gray-100">
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} Icon={Bold} disabled={!editor} />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} Icon={Italic} disabled={!editor} />
        <ToolbarButton
          onClick={() => editor?.can().toggleUnderline() && editor?.chain().focus().toggleUnderline().run()}
          Icon={UnderlineIcon}
          disabled={!editor || !Underline}
        />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} Icon={List} disabled={!editor} />
        <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} Icon={ListOrdered} disabled={!editor} />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} Icon={AlignLeft} disabled={!editor} />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} Icon={AlignCenter} disabled={!editor} />
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} Icon={AlignRight} disabled={!editor} />
      </div>

      <div className="p-2 rounded-md min-h-[100px] max-h-[300px] overflow-y-auto">
        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );
}
