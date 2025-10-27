export type Borrower = { id: string; name: string; email: string };
export type Author = { id: string; name: string };
export type Genre = string;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

export type AuthResponse = { accessToken: string; user: AuthUser };

export type Book = {
  id: string;
  title: string;
  year?: string | null;
  authors: Author[];
  genres: Genre[];
};

export type CreateBookPayload = {
  title: string;
  year?: string | null;
  authorNames: string[];
  genreNames: string[];
};

export type Reservation = {
  id: string;
  book: Book;
  reservedAt: string;
  reservedBy: Borrower;
  dueDate: string;
};

export type GoogleBook = {
  id?: string;
  provider: 'google';
  providerId: string;
  title: string;
  authors: string[];
  year?: number;
  genres: string[];
  thumbnail?: string;
  description?: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    description?: string;
  };
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

export type UpdateReservationPayload = {
  id: string;
  dueDate: string;
};

export type CreateAuthorPayload = {
  name: string;
};

export type SearchBookResponse = {
  data: { items: Book[]; total: number; page: number; pageSize: number; totalPages: number };
  status: number;
  statusText: string;
};

export type CustomCfgConfig = { config: { retryCount?: number; startedAt?: number } };
export type ErrorResponseData = { message?: string; error?: string };
