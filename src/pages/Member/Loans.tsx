import React, { useEffect, useState } from 'react';
import { fetchUserLoans } from '../../lib/api';
import type { Loan } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const MemberLoans: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await fetchUserLoans(user.id);
    if (error) {
      alert('Failed to load loans: ' + error.message);
    } else {
      setLoans(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLoans();
  }, [user?.id]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Loans</h1>
      {loading ? (
        <LoadingSpinner />
      ) : loans.length === 0 ? (
        <p className="text-gray-600">No active loans.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Book ID</th>
              <th className="px-4 py-2 text-left">Borrowed At</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const isOverdue = !loan.returned_at && new Date(loan.due_date) < new Date();
              return (
                <tr key={loan.id} className="border-t">
                  <td className="px-4 py-2">{loan.book_id}</td>
                  <td className="px-4 py-2">{new Date(loan.borrowed_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(loan.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    {loan.returned_at ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Returned</span>
                    ) : isOverdue ? (
                      <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">Overdue</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">Active</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberLoans;
