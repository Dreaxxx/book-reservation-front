export type Borrower = { id: string; name: string; email: string };
export type Author = { id: string; name: string };
export type Genre = string;

export type Book = {
    id: string;
    title: string;
    year?: string | null;
    authors: Author[];
    genres: Genre[];
};
export type Reservation = {
    id: string;
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
    bookId: string;
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
    id: string;
    title: string;
    year?: number | null;
    authorIds: number[];
    genres: Genre[];
};

export type UpdateReservationPayload = {
    id: string;
    dueDate: string;
};

export type CreateAuthorPayload = {
    name: string;
};

export type CustomCfgConfig = { config: { retryCount?: number; startedAt?: number } };
export type ErrorResponseData = { message?: string; error?: string };
