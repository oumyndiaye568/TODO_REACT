import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3010/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'creation':
        return 'Création';
      case 'modification':
        return 'Modification';
      case 'suppression':
        return 'Suppression';
      case 'lecture':
        return 'Lecture';
      default:
        return action;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des actions</h2>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
          {history.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Aucun historique trouvé
            </li>
          ) : (
            history.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getActionLabel(item.action)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Par {item.user.fullname}
                          {item.tache && ` - Tâche: ${item.tache.libelle}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleString('fr-FR')}
                  </div>
                </div>
              </li>
            ))
          )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;