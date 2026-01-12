import { useState } from "react";
import { initialData } from "../../data/initialData";
import { Column } from "../Column/Column";
import "./KanbanBoard.css";
import type { KanbanState } from "../../types/kanban";
import { generateId } from "../../utils/common";


export const KanbanBoard = () => {
  const [state, setState] = useState<KanbanState>(initialData);

   const handleAddTask = (columnId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newCardId = generateId();

    setState((prev) => ({
        ...prev,
        cards: {
        ...prev.cards,
        [newCardId]: {
            id: newCardId,
            title: trimmedTitle,
        },
        },
        columns: {
        ...prev.columns,
        [columnId]: {
            ...prev.columns[columnId],
            cardIds: [...prev.columns[columnId].cardIds, newCardId],
        },
        },
    }));
    };

   const handleEditTask = (cardId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    setState((prev) => ({
        ...prev,
        cards: {
        ...prev.cards,
        [cardId]: {
            ...prev.cards[cardId],
            title: trimmedTitle,
        },
        },
    }));
    };



  return (
    <div className="kanban-board">
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId];
        const cards = column.cardIds.map(
          (cardId) => state.cards[cardId]
        );

        return (
         <Column
            key={column.id}
            column={column}
            cards={cards}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
        />

        );
      })}
    </div>
  );
};
