export interface HistoryEntry {
  type: 'image' | 'speech' | 'doubt';
  question: string;
  solution: string;
}
