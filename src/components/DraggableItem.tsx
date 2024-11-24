import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Item } from '../types';
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';
import ItemList from './ItemList';

interface DraggableItemProps {
  item: Item;
  allItems : Item[]
  index: number;
  moveItem: (itemId: string, targetId: string | null, targetIsFolder: boolean) => void;
  onToggleFolder: (id: string) => void;
  onDragEnd: () => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem, onToggleFolder, onDragEnd, allItems }) => {
  
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        onDragEnd();
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(draggedItem: { id: string; index: number}) {
      if (!ref.current) {
        return;
      }

      const draggedId = draggedItem.id;
      const hoveredId = item.id;

      if (draggedId === hoveredId) {
        return;
      }

      moveItem(draggedId, hoveredId, item.isFolder);
    }
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={ref} style={{ opacity, marginLeft: item.parentId ? '20px' : '0' }}>
      {item.isFolder ? (
        <div onClick={() => onToggleFolder(item.id)}>
          {item.isOpen ? <FaFolderOpen /> : <FaFolder />}
          <span>{item.title}</span>
        </div>
      ) : (
        <div>
          <FaFile />
          <span>{item.title}</span>
        </div>
      )}
      {item.isFolder && item.isOpen && item.items && (
        <div style={{ marginLeft: '20px' }}>
          <ItemList items={allItems} parentId={item.id} moveItem={moveItem} onToggleFolder={onToggleFolder} onDragEnd={onDragEnd} />
        </div>
      )}
    </div>
  );
};

export default DraggableItem;