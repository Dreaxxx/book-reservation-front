export type Borrower = { id: number; name: string; email: string };
export type Author = { id: number; name: string };
export type Genre = string;
export type Book = {
  id: number;
  title: string;
  year?: number | null;
  authors: Author[];
  genres: Genre[];
};
export type Reservation = {
  id: number;
  book: Book;
  reservedAt: string;
  reservedBy: Borrower;
  dueDate: string;
};
