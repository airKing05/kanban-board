import { useState } from "react";
import { initialData } from "../../data/initialData";
import { Column } from "../Column/Column";
import "./KanbanBoard.css";
import type { KanbanState } from "../../types/kanban";
import { generateId } from "../../utils/common";
import { 
  DndContext, 
  closestCenter, 
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
 } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";



export const KanbanBoard = () => {
  const [state, setState] = useState<KanbanState>(initialData);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, 
      },
    })
  );


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

  const handleDeleteTask = (cardId: string) => {
    setState((prev) => {
      // check that this card is exist ont which column
      const columnId = Object.keys(prev.columns).find((colId) =>
        prev.columns[colId].cardIds.includes(cardId)
      );

      if (!columnId) return prev;

      const { [cardId]: _, ...remainingCards } = prev.cards;

      return {
        ...prev,
        cards: remainingCards,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            cardIds: prev.columns[columnId].cardIds.filter(
              (id) => id !== cardId
            ),
          },
        },
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const sourceColumnId = active.data.current?.columnId;

    // Dropped on column (empty space)
    const targetColumnId =
      over.data.current?.columnId || over.id;

    if (!sourceColumnId || !targetColumnId) return;

    setState((prev) => {
      const sourceCardIds = [...prev.columns[sourceColumnId].cardIds];
      const sourceIndex = sourceCardIds.indexOf(activeCardId);

      if (sourceIndex === -1) return prev;

      // re-order the card in the same column
      if (sourceColumnId === targetColumnId) {
        const overIndex = sourceCardIds.indexOf(overId);
        if (overIndex === -1) return prev;

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...prev.columns[sourceColumnId],
              cardIds: arrayMove(sourceCardIds, sourceIndex, overIndex),
            },
          },
        };
      }

      // Move one column to different column
      sourceCardIds.splice(sourceIndex, 1);

      const targetCardIds = [...prev.columns[targetColumnId].cardIds];
      targetCardIds.push(activeCardId);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColumnId]: {
            ...prev.columns[sourceColumnId],
            cardIds: sourceCardIds,
          },
          [targetColumnId]: {
            ...prev.columns[targetColumnId],
            cardIds: targetCardIds,
          },
        },
      };
    });
  };

  const handleDragStart = (event: any) => {
    setActiveCardId(event.active.id as string);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="kanban-board">
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];

          return (
          <Column
              key={column.id}
              column={column}
              cards={state.cards} 
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
          />

          );
        })}
      </div>

       <DragOverlay>
        {activeCardId ? (
          <div className="card card-overlay">
            {state.cards[activeCardId].title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
