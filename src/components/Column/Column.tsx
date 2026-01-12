import { useState } from "react";
import { Card } from "../Card/Card";
import { Modal } from "../Modal/Modal";
import "./Column.css";
import type { KanbanCard, KanbanColumn } from "../../types/kanban";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: KanbanColumn;
  cards: Record<string, KanbanCard>;
  onAddTask: (columnId: string, title: string) => void;
  onEditTask: (cardId: string, title: string) => void;
  onDeleteTask: (cardId: string) => void;
}

export const Column = ({
  column,
  cards,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ColumnProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { setNodeRef } = useDroppable({
  id: column.id,
});


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(column.id, title);
    setTitle("");
    setIsAddOpen(false);
  };

  return (
    <div className={`column column-${column.id}`}>
      <div className="column-header">
        <h4>{column.title}</h4>
        <span>{column.cardIds.length}</span>
        <button onClick={() => setIsAddOpen(true)}>+</button>
      </div>

      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="column-list" 
        ref={setNodeRef} 
        >
          {column.cardIds.map((cardId) => {
            const card = cards[cardId];

            return (
              <Card
                key={card.id}
                card={card}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                columnId={column.id}
              />
            );
          })}
        </div>
      </SortableContext>

      {isAddOpen && (
        <Modal title="Add Task" onClose={() => setIsAddOpen(false)}>
          <form onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
            <button type="submit" disabled={!title.trim()}>
              Add Task
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
