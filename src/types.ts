export type Profile = {
  id: string;
  role: 'member' | 'librarian';
  full_name?: string;
  email: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  total_copies: number;
  available_copies: number;
};

export type Loan = {
  id: string;
  book_id: string;
  user_id: string;
  borrowed_at: string; // ISO date
  due_date: string; // ISO date
  returned_at?: string;
};

export type Reservation = {
  id: string;
  book_id: string;
  user_id: string;
  position: number; // queue position
  created_at: string;
};

export type Fine = {
  id: string;
  user_id: string;
  amount: number;
  paid: boolean;
  created_at: string;
};

export type LibrarySetting = {
  key: string;
  value: any;
};


