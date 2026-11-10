import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBooks, fetchAllLoans, fetchAllFines } from '../../lib/api';

const LibrarianDashboard: React.FC = () => {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [activeLoans, setActiveLoans] = useState<number>(0);
  const [unpaidFinesCount, setUnpaidFinesCount] = useState<number>(0);

  useEffect(() => {
    fetchAllBooks().then(({ data }) => setTotalBooks(data?.length ?? 0));
    fetchAllLoans().then(({ data }) => {
      const active = (data ?? []).filter((l) => !l.returned_at);
      setActiveLoans(active.length);
    });
    fetchAllFines().then(({ data }) => {
      const unpaid = (data ?? []).filter((f) => !f.paid);
      setUnpaidFinesCount(unpaid.length);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Librarian Management Dashboard</h1>
        <p className="text-gray-600">Overview and control center for library operations.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Total Book Titles</p>
          <p className="text-3xl font-bold text-emerald-900 mt-2">{totalBooks}</p>
        </div>
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-blue-600">Active Borrowed Copies</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{activeLoans}</p>
        </div>
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-rose-600">Pending Unpaid Fines</p>
          <p className="text-3xl font-bold text-rose-900 mt-2">{unpaidFinesCount}</p>
        </div>
      </div>

      {/* Modules */}
      <h2 className="text-xl font-semibold text-gray-800 pt-4">Staff Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/librarian/books" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Manage Books</h3>
          <p className="mt-2 text-sm text-gray-600">Add new catalog entries, edit titles, ISBNs, authors and view inventory.</p>
        </Link>
        <Link to="/librarian/copies" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Book Copies</h3>
          <p className="mt-2 text-sm text-gray-600">Add inventory copies to existing book records.</p>
        </Link>
        <Link to="/librarian/loans" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">All Loans</h3>
          <p className="mt-2 text-sm text-gray-600">Audit all member borrow histories, active checkouts and overdue dates.</p>
        </Link>
        <Link to="/librarian/returns" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Process Returns</h3>
          <p className="mt-2 text-sm text-gray-600">Check in returned books, recalculate overdue fines and update stock.</p>
        </Link>
        <Link to="/librarian/fines" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Fine Payments</h3>
          <p className="mt-2 text-sm text-gray-600">Record settlements for overdue fines and unblock member privileges.</p>
        </Link>
        <Link to="/librarian/settings" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Library Settings</h3>
          <p className="mt-2 text-sm text-gray-600">Configure loan periods, fine rates, maximum loan limits and thresholds.</p>
        </Link>
      </div>
    </div>
  );
};

export default LibrarianDashboard;

