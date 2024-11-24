import React, { useState } from 'react';
import { Item } from '../types';
import { createItem } from '../api';

interface AddItemFormProps {
}

const AddItemForm: React.FC<AddItemFormProps> = () => {
  const [title, setTitle] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  const [error, setError] = useState('');

  const handleAddItem = async (newItem: Item) => {
    try {
      await createItem(newItem);
    } catch (error) {
      setError('Error adding item. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim().length === 0) {
      setError('Title cannot be empty');
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      title: title.trim(),
      icon: isFolder ? 'folder' : 'file',
      isFolder,
      parentId: null,
      order: 0,
      items: isFolder ? [] : undefined,
      isOpen: isFolder ? false : undefined,
    };

    handleAddItem(newItem);
    setTitle('');
    setIsFolder(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter item title"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isFolder}
          onChange={(e) => setIsFolder(e.target.checked)}
        />
        Is Folder
      </label>
      <button type="submit">Add Item</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddItemForm;