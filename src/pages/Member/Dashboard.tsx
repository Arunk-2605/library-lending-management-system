import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserLoans, fetchUserReservations, fetchUserFines } from '../../lib/api';

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeLoansCount, setActiveLoansCount] = useState<number>(0);
  const [reservationsCount, setReservationsCount] = useState<number>(0);
  const [unpaidFinesTotal, setUnpaidFinesTotal] = useState<number>(0);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserLoans(user.id).then(({ data }) => {
      const active = (data ?? []).filter((l) => !l.returned_at);
      setActiveLoansCount(active.length);
    });
    fetchUserReservations(user.id).then(({ data }) => {
      setReservationsCount((data ?? []).length);
    });
    fetchUserFines(user.id).then(({ data }) => {
      const unpaid = (data ?? []).filter((f) => !f.paid);
      const sum = unpaid.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      setUnpaidFinesTotal(sum);
    });
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-blue-600">Active Borrowed Books</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{activeLoansCount}</p>
        </div>
        <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-purple-600">Active Reservations</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{reservationsCount}</p>
        </div>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-amber-600">Outstanding Fines</p>
          <p className="text-3xl font-bold text-amber-900 mt-2">${unpaidFinesTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <h2 className="text-xl font-semibold text-gray-800 pt-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/member/books" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Browse Books</h3>
          <p className="mt-2 text-sm text-gray-600">Search library catalog, check availability, borrow or reserve books.</p>
        </Link>
        <Link to="/member/loans" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">My Loans</h3>
          <p className="mt-2 text-sm text-gray-600">Review currently borrowed books, due dates, and past borrowing history.</p>
        </Link>
        <Link to="/member/reservations" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">My Reservations</h3>
          <p className="mt-2 text-sm text-gray-600">Check queue priority and hold statuses for currently reserved titles.</p>
        </Link>
        <Link to="/member/fines" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">My Fines</h3>
          <p className="mt-2 text-sm text-gray-600">Track overdue balances and fine records.</p>
        </Link>
        <Link to="/member/account" className="p-6 bg-white border border-gray-100 rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
          <p className="mt-2 text-sm text-gray-600">View and update membership profile information.</p>
        </Link>
      </div>
    </div>
  );
};

export default MemberDashboard;

