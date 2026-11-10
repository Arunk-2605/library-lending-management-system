import React, { useEffect, useState } from 'react';
import { fetchAllLoans, processBookReturn } from '../../lib/api';
import type { Loan } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProcessReturns: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    setLoading(true);
    const { data, error } = await fetchAllLoans();
    if (error) {
      alert('Failed to load loans: ' + error.message);
    } else {
      // Show only loans not yet returned
      setLoans((data ?? []).filter(l => !l.returned_at));
    }
    setLoading(false);
  };

  const handleReturn = async (loanId: string) => {
    const { error } = await processBookReturn(loanId);
    if (error) {
      alert('Return failed: ' + error.message);
    } else {
      alert('Book returned successfully');
      await loadLoans();
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Process Returns</h1>
      {loading ? (
        <LoadingSpinner />
      ) : loans.length === 0 ? (
        <p className="text-gray-600">No pending returns.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Loan ID</th>
              <th className="px-4 py-2 text-left">Book ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Borrowed</th>
              <th className="px-4 py-2 text-left">Due</th>
              <th className="px-4 py-2 text-left">Action</th>
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
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessReturns;

