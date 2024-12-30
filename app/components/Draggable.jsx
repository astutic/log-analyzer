// Draggable.jsx
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';

export function Draggable({children, id}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}


export function Droppable({children, id}) {
  const {isOver, setNodeRef} = useDroppable({
    id: id
  });

  const style = {
    backgroundColor: isOver ? 'rgb(229, 231, 235)' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
