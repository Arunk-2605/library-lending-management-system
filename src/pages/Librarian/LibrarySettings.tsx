import React, { useEffect, useState } from 'react';
import { fetchAllSettings, updateLibrarySetting } from '../../lib/api';
import type { LibrarySetting } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const LibrarySettings: React.FC = () => {
  const [settings, setSettings] = useState<LibrarySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await fetchAllSettings();
    if (error) {
      alert('Failed to load settings: ' + error.message);
    } else {
      setSettings(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const startEdit = (key: string, current: any) => {
    setEditingKey(key);
    setNewValue(typeof current === 'object' ? JSON.stringify(current) : String(current));
  };

  const handleSave = async (key: string) => {
    const num = Number(newValue);
    const valueToSave = !isNaN(num) && newValue.trim() !== '' ? num : newValue;
    const { error } = await updateLibrarySetting(key, valueToSave);
    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Setting updated');
      setEditingKey(null);
      await loadSettings();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Library Settings</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Setting</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.key} className="border-t">
                <td className="px-4 py-2">{s.key}</td>
                <td className="px-4 py-2">
                  {editingKey === s.key ? (
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    s.value
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingKey === s.key ? (
                    <>
                      <button
                        onClick={() => handleSave(s.key)}
                        className="px-2 py-1 mr-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(s.key, s.value)}
                      className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
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

export default LibrarySettings;

