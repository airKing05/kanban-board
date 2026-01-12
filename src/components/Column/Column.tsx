import { useState } from "react";
import { Card } from "../Card/Card";
import { Modal } from "../Modal/Modal";
import "./Column.css";
import type { KanbanCard, KanbanColumn } from "../../types/kanban";

interface ColumnProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  onAddTask: (columnId: string, title: string) => void;
  onEditTask: (cardId: string, title: string) => void;
}

export const Column = ({
  column,
  cards,
  onAddTask,
  onEditTask,
}: ColumnProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(column.id, title);
    setTitle("");
    setIsAddOpen(false);
  };

  const columnClass = `column column-${column.id}`;

  return (
    <div className={columnClass}>
      <div className="column-header">
        <h4>{column.title}</h4>
        <span>{cards.length}</span>
        <button onClick={() => setIsAddOpen(true)}>+</button>
      </div>

      <div className="column-list">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onEditTask={onEditTask}
          />
        ))}
      </div>

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
