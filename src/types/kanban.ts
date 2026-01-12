
export type CardId = string;
export type ColumnId = string;

export interface KanbanCard {
  id: CardId;
  title: string;
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  cardIds: CardId[];
}

export interface KanbanState {
  columns: Record<ColumnId, KanbanColumn>;
  cards: Record<CardId, KanbanCard>;
  columnOrder: ColumnId[];
}
