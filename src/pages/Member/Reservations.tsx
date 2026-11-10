import React, { useEffect, useState } from 'react';
import { fetchUserReservations } from '../../lib/api';
import type { Reservation } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const MemberReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    setLoading(true);
    const { data, error } = await fetchUserReservations();
    if (error) {
      alert('Failed to load reservations: ' + error.message);
    } else {
      setReservations(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Reservations</h1>
      {loading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <p className="text-gray-600">No active reservations.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Book ID</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.book_id}</td>
                <td className="px-4 py-2">{r.position}</td>
                <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberReservations;

