import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const MemberAccount: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, role')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      setEmail(data.email ?? user.email ?? '');
      setFullName(data.full_name ?? '');
      setRole(data.role ?? 'member');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    if (error) {
      setMessage('Failed to update profile: ' + error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Account Details</h1>
      {message && (
        <div className={`p-3 rounded text-sm ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleUpdate} className="p-6 space-y-4 bg-white rounded shadow">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Account ID</label>
          <input
            type="text"
            disabled
            value={user?.id ?? ''}
            className="w-full px-3 py-2 text-gray-500 bg-gray-100 border rounded cursor-not-allowed font-mono text-xs"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full px-3 py-2 text-gray-500 bg-gray-100 border rounded cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            disabled
            value={role}
            className="w-full px-3 py-2 text-gray-500 bg-gray-100 border rounded capitalize cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default MemberAccount;

