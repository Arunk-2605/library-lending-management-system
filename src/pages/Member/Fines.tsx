import React, { useEffect, useState } from 'react';
import { fetchUserFines } from '../../lib/api';
import type { Fine } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const MemberFines: React.FC = () => {
  const { user } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFines = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await fetchUserFines(user.id);
    if (error) {
      alert('Failed to load fines: ' + error.message);
    } else {
      setFines(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFines();
  }, [user?.id]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Fines</h1>
      <p className="text-sm text-gray-500">
        Fines can be settled in person with the library staff / librarian.
      </p>
      {loading ? (
        <LoadingSpinner />
      ) : fines.length === 0 ? (
        <p className="text-gray-600">No fines on your account.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Fine ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Issued At</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id} className="border-t">
                <td className="px-4 py-2 text-xs font-mono">{fine.id}</td>
                <td className="px-4 py-2 font-semibold">${fine.amount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  {fine.paid ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Paid</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">Unpaid</span>
                  )}
                </td>
                <td className="px-4 py-2">{new Date(fine.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberFines;

