import React, { useEffect, useState } from 'react';
import { fetchAllBooks, fetchBooks, createBook, updateBook } from '../../lib/api';
import type { Book } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Book>>({});
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async (q = '') => {
    setLoading(true);
    if (q) {
      const { data, error } = await fetchBooks(q);
      if (error) {
        setError(error.message);
        setBooks([]);
      } else {
        setBooks(data ?? []);
      }
    } else {
      const { data, error } = await fetchAllBooks();
      if (error) {
        setError(error.message);
        setBooks([]);
      } else {
        setBooks(data ?? []);
      }
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

  const startAdd = () => {
    setEditId(null);
    setForm({ title: '', author: '', isbn: '', total_copies: 1, description: '' });
  };

  const startEdit = (book: Book) => {
    setEditId(book.id);
    setForm({ ...book });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'total_copies' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      const { error } = await updateBook({ id: editId, ...form } as any);
      if (error) alert('Update failed: ' + error.message);
    } else {
      const { error } = await createBook(form as any);
      if (error) alert('Create failed: ' + error.message);
    }
    await loadBooks(search);
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Books</h1>
      {error && <div className="p-2 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none"
          />
        </form>
        <button onClick={startAdd} className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700">
          Add Book
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-left">ISBN</th>
              <th className="px-4 py-2 text-left">Copies</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-t">
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.author}</td>
                <td className="px-4 py-2">{book.isbn}</td>
                <td className="px-4 py-2">{book.total_copies}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => startEdit(book)} className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add / Edit Form */}
      {(editId !== null || editId === null && form.title !== undefined) && (
        <div className="mt-6 p-4 bg-gray-50 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Book' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input name="title" required value={form.title ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Author</label>
              <input name="author" required value={form.author ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">ISBN</label>
              <input name="isbn" required value={form.isbn ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Total Copies</label>
              <input name="total_copies" type="number" min={1} required value={form.total_copies ?? 1} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Description</label>
              <textarea name="description" value={form.description ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded" rows={3} />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700">
                {editId ? 'Save Changes' : 'Create Book'}
              </button>
              <button type="button" onClick={() => setEditId(null)} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
