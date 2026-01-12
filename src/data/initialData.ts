import type { KanbanState } from "../types/kanban";


export const initialData: KanbanState = {
  columns: {
    todo: {
      id: "todo",
      title: "Todo",
      cardIds: ["card-1", "card-2"],
    },
    inprogress: {
      id: "inprogress",
      title: "In Progress",
      cardIds: ["card-3"],
    },
    done: {
      id: "done",
      title: "Done",
      cardIds: [],
    },
  },
  cards: {
    "card-1": { id: "card-1", title: "Setup project" },
    "card-2": { id: "card-2", title: "Design data structure" },
    "card-3": { id: "card-3", title: "Implement drag and drop" },
  },
  columnOrder: ["todo", "inprogress", "done"],
};
