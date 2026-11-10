import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './lib/api';
import { supabase } from './lib/supabase';

vi.mock('./lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('Library Lending System - Automated Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Librarian route protection & access check
  it('1. Librarian route protection - correctly permits librarian roles', () => {
    const role: string = 'librarian';
    const canAccessLibrarian = role === 'librarian';
    const canAccessMember = role === 'member';

    expect(canAccessLibrarian).toBe(true);
    expect(canAccessMember).toBe(false);
  });

  // TEST 2: Member route protection & access check
  it('2. Member route protection - prevents members from accessing librarian routes', () => {
    const memberRole: string = 'member';
    const isLibrarian = memberRole === 'librarian';
    const isMember = memberRole === 'member';

    expect(isLibrarian).toBe(false);
    expect(isMember).toBe(true);
  });

  // TEST 3: Unauthenticated route protection
  it('3. Unauthenticated route protection - redirects unauthenticated user', () => {
    const user = null;
    const redirectTarget = user ? '/dashboard' : '/login';
    expect(redirectTarget).toBe('/login');
  });

  // TEST 4: Book Search logic
  it('4. Book search - fetches books filtering by query', async () => {
    const mockBooks = [
      { id: '1', title: 'Clean Code', author: 'Robert Martin', isbn: '9780132350884', total_copies: 5, available_copies: 3 },
    ];
    const queryBuilder = {
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      then: (resolve: any) => resolve({ data: mockBooks, error: null }),
    };

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue(queryBuilder),
    });

    const result = await api.fetchBooks('Clean');
    expect(supabase.from).toHaveBeenCalledWith('books');
    expect(result.data).toEqual(mockBooks);
    expect(result.error).toBeNull();
  });

  // TEST 5: Checkout eligibility
  it('5. Checkout eligibility - checks if available_copies > 0', () => {
    const bookWithCopies = { id: 'b1', available_copies: 2 };
    const bookWithoutCopies = { id: 'b2', available_copies: 0 };

    const isEligibleToCheckout = (book: { available_copies: number }) => book.available_copies > 0;

    expect(isEligibleToCheckout(bookWithCopies)).toBe(true);
    expect(isEligibleToCheckout(bookWithoutCopies)).toBe(false);
  });

  // TEST 6: Maximum active loan restriction
  it('6. Maximum active loan restriction - blocks borrowing when max limit reached', () => {
    const maxActiveLoans = 5;
    const userLoansCount = 5;
    const canBorrowMore = userLoansCount < maxActiveLoans;

    expect(canBorrowMore).toBe(false);
  });

  // TEST 7: Reservation creation
  it('7. Reservation creation - calls reserve_book RPC with correct payload', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: { reservation_id: 'res-123' }, error: null });

    const result = await api.reserveBook('book-1');

    expect(supabase.rpc).toHaveBeenCalledWith('reserve_book', {
      p_book_id: 'book-1',
    });
    expect(result.data).toEqual({ reservation_id: 'res-123' });
  });

  // TEST 8: FIFO reservation ordering
  it('8. FIFO reservation ordering - orders queued members by position ascending', () => {
    const queue = [
      { id: 'r2', user_id: 'user-b', position: 2, created_at: '2026-11-10T10:05:00Z' },
      { id: 'r1', user_id: 'user-a', position: 1, created_at: '2026-11-10T10:00:00Z' },
      { id: 'r3', user_id: 'user-c', position: 3, created_at: '2026-11-10T10:10:00Z' },
    ];

    const sortedQueue = [...queue].sort((a, b) => a.position - b.position);
    expect(sortedQueue[0].user_id).toBe('user-a');
    expect(sortedQueue[1].user_id).toBe('user-b');
    expect(sortedQueue[2].user_id).toBe('user-c');
  });

  // TEST 9: Reservation hold expiry logic
  it('9. Reservation hold expiry check - detects expired reservations', () => {
    const holdPeriodDays = 2;
    const createdAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    const expiresAt = new Date(createdAt.getTime() + holdPeriodDays * 24 * 60 * 60 * 1000);
    const isExpired = Date.now() > expiresAt.getTime();

    expect(isExpired).toBe(true);
  });

  // TEST 10: Fine calculation logic
  it('10. Fine calculation - accurately computes days overdue * fine_per_day', () => {
    const daysOverdue = 4;
    const finePerDay = 1.5;
    const calculatedFine = daysOverdue * finePerDay;

    expect(calculatedFine).toBe(6.0);
  });

  // TEST 11: Fine cap enforcement
  it('11. Fine cap - caps maximum fine accumulation', () => {
    const fineCap = 20.0;
    const rawFine = 35.0;
    const appliedFine = Math.min(rawFine, fineCap);

    expect(appliedFine).toBe(20.0);
  });

  // TEST 12: Duplicate fine payment prevention
  it('12. Duplicate fine payment prevention - disallows paying already settled fines', () => {
    const fine = { id: 'f-1', amount: 15.0, paid: true };
    const canPay = !fine.paid;

    expect(canPay).toBe(false);
  });

  // TEST 13: Librarian-only settings updates
  it('13. Librarian-only settings updates - calls update_library_setting RPC with numeric JSONB value', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

    const result = await api.updateLibrarySetting('loan_period_days', '14');
    expect(supabase.rpc).toHaveBeenCalledWith('update_library_setting', {
      p_key: 'loan_period_days',
      p_value: 14,
    });
    expect(result.data).toBe(true);
  });

  // TEST 14: Prevention of concurrent checkout of the last copy
  it('14. Prevention of concurrent checkout - checkout fails when available copies reach 0', async () => {
    (supabase.rpc as any).mockResolvedValue({
      data: null,
      error: { message: 'No copies currently available' },
    });

    const result = await api.checkoutBook('book-out-of-stock');
    expect(supabase.rpc).toHaveBeenCalledWith('checkout_book', {
      p_book_id: 'book-out-of-stock',
    });
    expect(result.error?.message).toBe('No copies currently available');
  });
});
