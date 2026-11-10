import React, { useEffect, useState } from 'react';
import { addBookCopies, fetchAllBooks } from '../../lib/api';
import type { Book } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCopies: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    const { data, error } = await fetchAllBooks();
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

  const handleAddCopies = async () => {
    if (!selectedBook) return;
    const { error } = await addBookCopies(selectedBook.id, count);
    if (error) {
      alert('Add copies failed: ' + error.message);
    } else {
      alert('Copies added');
      await loadBooks();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Book Copies</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedBook?.id ?? ''}
            onChange={e => setSelectedBook(books.find(b => b.id === e.target.value) ?? null)}
            className="px-3 py-2 border rounded"
          >
            <option value="" disabled>Select a book</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.author})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddCopies}
            disabled={!selectedBook}
            className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Add Copies
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCopies;

