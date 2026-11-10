import React, { useEffect, useState } from 'react';
import { fetchBooks, checkoutBook, reserveBook } from '../../lib/api';
import type { Book } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookSearch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = async (query = '') => {
    setLoading(true);
    const { data, error } = await fetchBooks(query);
    if (error) {
      alert('Failed to load books: ' + error.message);
    } else {
      setBooks(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks(search);
  };

  const handleCheckout = async (bookId: string) => {
    const { error } = await checkoutBook(bookId);
    if (error) {
      alert('Checkout failed: ' + error.message);
    } else {
      alert('Book checked out successfully');
      loadBooks(search);
    }
  };

  const handleReserve = async (bookId: string) => {
    const { error } = await reserveBook(bookId);
    if (error) {
      alert('Reservation failed: ' + error.message);
    } else {
      alert('Book reserved successfully');
      loadBooks(search);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Browse Books</h1>
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-left">Available</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t">
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.author}</td>
                <td className="px-4 py-2">{book.available_copies}</td>
                <td className="px-4 py-2 space-x-2">
                  {book.available_copies > 0 ? (
                    <button
                      onClick={() => handleCheckout(book.id)}
                      className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Checkout
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(book.id)}
                      className="px-2 py-1 text-sm text-white bg-orange-600 rounded hover:bg-orange-700"
                    >
                      Reserve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookSearch;

