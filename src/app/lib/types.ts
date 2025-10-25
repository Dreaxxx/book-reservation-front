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

export type CreateBookPayload = {
  title: string;
  year?: number | null;
  authorIds: number[];
  genres: Genre[];
};

export type CreateReservationPayload = {
  bookId: number;
  dueDate: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type UpdateBookPayload = {
  id: number;
  title: string;
  year?: number | null;
  authorIds: number[];
  genres: Genre[];
};

export type UpdateReservationPayload = {
  id: number;
  dueDate: string;
};

export type CreateAuthorPayload = {
  name: string;
};

export type CustomCfgConfig = { config: { retryCount?: number; startedAt?: number } };
export type ErrorResponseData = { message?: string; error?: string };
