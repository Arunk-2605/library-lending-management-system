import { supabase } from './supabase';
import type { Book, Loan, Reservation, Fine, LibrarySetting } from '../types';

// ---------- READ OPERATIONS (RLS protected) ----------

/** Fetch all books */
export const fetchAllBooks = async () => {
  const { data, error } = await supabase.from('books').select('*');
  return { data: data as Book[] | null, error };
};

/** Fetch books with optional search on title or author */
export const fetchBooks = async (search = '') => {
  const query = supabase
    .from('books')
    .select('id, title, author, isbn, description, total_copies, available_copies');
  if (search) {
    // ilike for case‑insensitive match, combine title and author
    query.ilike('title', `%${search}%`).or(`author.ilike.%${search}%`);
  }
  const { data, error } = await query;
  return { data: data as Book[] | null, error };
};

/** Fetch a single book by its ID */
export const fetchBookById = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Book | null, error };
};

// ---------- LOANS ----------

/** Fetch loans for the current user (or supplied userId) */
export const fetchUserLoans = async (userId?: string) => {
  const uid = await getUserId(userId);
  if (!uid) return { data: null, error: new Error('User not authenticated') };
  const { data, error } = await supabase.from('loans').select('*').eq('user_id', uid);
  return { data: data as Loan[] | null, error };
};

/** Fetch all loans (librarian view) */
export const fetchAllLoans = async () => {
  const { data, error } = await supabase.from('loans').select('*');
  return { data: data as Loan[] | null, error };
};

// ---------- RESERVATIONS ----------

export const fetchUserReservations = async (userId?: string) => {
  const uid = await getUserId(userId);
  if (!uid) return { data: null, error: new Error('User not authenticated') };
  const { data, error } = await supabase.from('reservations').select('*').eq('user_id', uid);
  return { data: data as Reservation[] | null, error };
};

// ---------- FINES ----------

export const fetchUserFines = async (userId?: string) => {
  const uid = await getUserId(userId);
  if (!uid) return { data: null, error: new Error('User not authenticated') };
  const { data, error } = await supabase.from('fines').select('*').eq('user_id', uid);
  return { data: data as Fine[] | null, error };
};

export const fetchAllFines = async () => {
  const { data, error } = await supabase.from('fines').select('*');
  return { data: data as Fine[] | null, error };
};

// ---------- SETTINGS ----------

export const fetchAllSettings = async () => {
  const { data, error } = await supabase.from('library_settings').select('*');
  return { data: data as LibrarySetting[] | null, error };
};

// ---------- RPC CALLS (POSTGREST FUNCTIONS) ----------

export const createBook = async (payload: {
  title: string;
  author: string;
  total_copies: number;
}) => {
  const { data, error } = await supabase.rpc('create_book', {
    p_title: payload.title,
    p_author: payload.author,
    p_copies: payload.total_copies,
  });
  return { data, error };
};

export const updateBook = async (payload: {
  id: string;
  title: string;
  author: string;
}) => {
  const { data, error } = await supabase.rpc('update_book', {
    p_book_id: payload.id,
    p_title: payload.title,
    p_author: payload.author,
  });
  return { data, error };
};

export const addBookCopies = async (bookId: string, count: number) => {
  const { data, error } = await supabase.rpc('add_book_copies', {
    p_book_id: bookId,
    p_quantity: count,
  });
  return { data, error };
};

export const checkoutBook = async (bookId: string) => {
  const { data, error } = await supabase.rpc('checkout_book', {
    p_book_id: bookId,
  });
  return { data, error };
};

export const processBookReturn = async (loanId: string) => {
  const { data, error } = await supabase.rpc('process_book_return', {
    p_loan_id: loanId,
  });
  return { data, error };
};

export const reserveBook = async (bookId: string) => {
  const { data, error } = await supabase.rpc('reserve_book', {
    p_book_id: bookId,
  });
  return { data, error };
};

export const recordFinePayment = async (fineId: string) => {
  const { data, error } = await supabase.rpc('record_fine_payment', {
    p_fine_id: fineId,
  });
  return { data, error };
};

export const updateLibrarySetting = async (key: string, value: any) => {
  // Numeric settings expected by database function update_library_setting(p_key TEXT, p_value JSONB)
  const numericSettingKeys = [
    'loan_period_days',
    'fine_per_day',
    'fine_cap',
    'max_active_loans',
    'reservation_hold_days',
    'reservation_hold_period_days',
    'borrowing_threshold',
    'borrowing_block_threshold',
  ];

  let formattedValue: any = value;
  if (numericSettingKeys.includes(key) || !isNaN(Number(value))) {
    const num = Number(value);
    if (!isNaN(num)) {
      formattedValue = num;
    }
  }

  const { data, error } = await supabase.rpc('update_library_setting', {
    p_key: key,
    p_value: formattedValue,
  });
  return { data, error };
};

/** Helper: get current user ID (supabase v2) */
const getUserId = async (providedId?: string): Promise<string | null> => {
  if (providedId) return providedId;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error('Auth error:', error);
  return user?.id ?? null;
};
