import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';
import ItemList from './components/ItemList';
import AddItemForm from './components/AddItemForm';
import { fetchItems, updateItem, updateItems } from './api';
import { Item } from './types';

const socket = io('http://localhost:5450');

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();

    socket.on('itemCreated', (newItem: Item) => {
      setItems((prevItems) => [...prevItems, newItem]);
    });

    socket.on('itemUpdated', (updatedItem: Item) => {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    });

    socket.on('itemDeleted', (deletedItemId: string) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== deletedItemId));
    });

    socket.on('itemsReordered', (reorderedItems: Item[]) => {
      setItems(reorderedItems);
    });

    return () => {
      socket.off('itemCreated');
      socket.off('itemUpdated');
      socket.off('itemDeleted');
      socket.off('itemsReordered');
    };
  }, []);

  const loadItems = async () => {
    try {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    } catch (error) {
      setError('Error loading items. Please try again.');
    }
  };

  const handleToggleFolder = async (id: string) => {
    try {
      const itemToUpdate = items.find((item) => item.id === id);
      if (itemToUpdate && itemToUpdate.isFolder) {
        const updatedItem = { ...itemToUpdate, isOpen: !itemToUpdate.isOpen };
        await updateItem(updatedItem);
      }
    } catch (error) {
      setError('Error toggling folder. Please try again.');
    }
  };

  const moveItem = useCallback(
    (draggedItemId: string, targetItemId: string | null) => {
      setItems((prevItems) => {
        console.log(draggedItemId, targetItemId)
        const draggedItem = prevItems.find((item) => item.id === draggedItemId);
        const targetItem = targetItemId ? prevItems.find((item) => item.id === targetItemId) : null;

        if (!draggedItem) return prevItems;

        const newItems = prevItems.filter((item) => item.id !== draggedItemId);

        if (targetItem && targetItem.isFolder) {
          // Moving into a folder
          draggedItem.parentId = targetItem.id;
          newItems.push(draggedItem);
        } else if (targetItem) {
          // Reordering within the same level
          const targetIndex = newItems.findIndex((item) => item.id === targetItemId);
          newItems.splice(targetIndex, 0, { ...draggedItem, parentId: targetItem.parentId });
        } else {
          // Moving to the root level
          newItems.push({ ...draggedItem, parentId: null });
        }

        return newItems;
      });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    updateItems(items).catch(() => {
      setError('Error reordering items. Please try again.');
    });
  }, [items]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Item Organizer</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <AddItemForm />
        <ItemList
          items={items}
          moveItem={moveItem}
          onToggleFolder={handleToggleFolder}
          onDragEnd={handleDragEnd}
          parentId = {null}
        />
      </div>
    </DndProvider>
  );
};

export default App;