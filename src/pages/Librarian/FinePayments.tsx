import React, { useEffect, useState } from 'react';
import { fetchAllFines, recordFinePayment } from '../../lib/api';
import type { Fine } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const FinePayments: React.FC = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFines = async () => {
    setLoading(true);
    const { data, error } = await fetchAllFines();
    if (error) {
      alert('Failed to load fines: ' + error.message);
    } else {
      setFines(data ?? []);
    }
    setLoading(false);
  };

  const handlePay = async (fineId: string) => {
    const { error } = await recordFinePayment(fineId);
    if (error) {
      alert('Payment failed: ' + error.message);
    } else {
      alert('Fine payment recorded');
      await loadFines();
    }
  };

  useEffect(() => {
    loadFines();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Fine Payments (Librarian)</h1>
      {loading ? (
        <LoadingSpinner />
      ) : fines.length === 0 ? (
        <p className="text-gray-600">No fines to process.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Fine ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Paid</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id} className="border-t">
                <td className="px-4 py-2">{fine.id}</td>
                <td className="px-4 py-2">{fine.user_id}</td>
                <td className="px-4 py-2">${fine.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{fine.paid ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{new Date(fine.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {!fine.paid && (
                    <button
                      onClick={() => handlePay(fine.id)}
                      className="px-2 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                      Mark Paid
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

export default FinePayments;

