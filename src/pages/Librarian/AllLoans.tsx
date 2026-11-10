import React, { useEffect, useState } from 'react';
import { fetchAllLoans } from '../../lib/api';
import type { Loan } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const AllLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    setLoading(true);
    const { data, error } = await fetchAllLoans();
    if (error) {
      alert('Failed to load loans: ' + error.message);
    } else {
      setLoans(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Loans</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Loan ID</th>
              <th className="px-4 py-2 text-left">Book ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Borrowed</th>
              <th className="px-4 py-2 text-left">Due</th>
              <th className="px-4 py-2 text-left">Returned</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-t">
                <td className="px-4 py-2">{loan.id}</td>
                <td className="px-4 py-2">{loan.book_id}</td>
                <td className="px-4 py-2">{loan.user_id}</td>
                <td className="px-4 py-2">{new Date(loan.borrowed_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(loan.due_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {loan.returned_at ? new Date(loan.returned_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllLoans;

