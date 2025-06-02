
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateValue: (value: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateValue
}) => {
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(String(value || ''));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdateValue(editValue);
    onStopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(String(value || ''));
      onStopEditing();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="h-8 text-sm"
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 rounded px-1 py-1 min-h-[24px]"
      onClick={onStartEditing}
      title="Click to edit"
    >
      {value}
    </div>
  );
};

export default EditableCell;
