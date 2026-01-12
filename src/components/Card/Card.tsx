import { useState } from "react";
import type { KanbanCard } from "../../types/kanban";
import { Modal } from "../Modal/Modal";
import "./Card.css";

import EditIcon from "../../assets/edit.svg";
import DeleteIcon from "../../assets/delete.svg";

interface CardProps {
  card: KanbanCard;
  onEditTask: (cardId: string, title: string) => void;
}

export const Card = ({ card, onEditTask }: CardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(card.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onEditTask(card.id, title);
    setIsEditOpen(false);
  };

return (
  <div className="card">
    <div className="card-left">
      <span className="card-line" />
      <p className="card-title">{card.title}</p>
    </div>

    <div className="card-actions">
      <button onClick={() => setIsEditOpen(true)}>
        <img src={EditIcon} alt="Edit" />
      </button>

      <button>
        <img src={DeleteIcon} alt="Delete" />
      </button>
    </div>

    {isEditOpen && (
      <Modal title="Edit Task" onClose={() => setIsEditOpen(false)}>
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <button type="submit">Save</button>
        </form>
      </Modal>
    )}
  </div>
);


};
