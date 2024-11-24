import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';
import { Item } from '../types';

interface ItemListProps {
  items: Item[];
  moveItem: (itemId: string, targetId: string | null, targetIsFolder: boolean) => void;
  onToggleFolder: (id: string) => void;
  onDragEnd: () => void;
  parentId : string | null
}

const ItemList: React.FC<ItemListProps> = ({ items, moveItem, onToggleFolder, onDragEnd, parentId }) => {
  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: (item: { id: string }, monitor) => {
      if (!monitor.didDrop()) {
        moveItem(item.id, null, false);
        onDragEnd();
      }
    },
  });

  return (
    <div ref={drop} style={{ minHeight: '100px', padding: '10px' }}>
      {items.filter(item => item.parentId === parentId).map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          moveItem={moveItem}
          onToggleFolder={onToggleFolder}
          onDragEnd={onDragEnd}
          allItems={items}
        />
      ))}
    </div>
  );
};

export default ItemList;