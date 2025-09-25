import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from './TaskForm';

const TaskActions = ({ task, onEdit, onDelegate, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.task-actions-menu')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="relative task-actions-menu">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
      >
        ⋮⋮
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => { onEdit(task); setShowMenu(false); }}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center"
            >
              🔧 Modifier
            </button>
            <button
              onClick={() => { onDelegate(task); setShowMenu(false); }}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center"
            >
              👥 Déléguer
            </button>
            <button
              onClick={() => { onDelete(task.id); setShowMenu(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              ❌ Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskList = ({ refreshTrigger, filter = 'all' }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [delegatingTask, setDelegatingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const tasksPerPage = 2; // Pagination after 2 tasks

  useEffect(() => {
    console.log('TaskList: useEffect déclenché avec refreshTrigger:', refreshTrigger);
    fetchTasks(1); // Reset to page 1 on refresh
    setCurrentPage(1);
  }, [refreshTrigger]);

  useEffect(() => {
    if (delegatingTask) {
      fetchUsers();
    }
  }, [delegatingTask]);

  const fetchTasks = async (page = 1) => {
    console.log('TaskList: fetchTasks appelé, page:', page);
    try {
      const skip = (page - 1) * tasksPerPage;
      const response = await axios.get(`http://localhost:3010/tasks?skip=${skip}&take=${tasksPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('TaskList: réponse reçue:', response.data);
      const tasksData = response.data.tasks || [];
      const totalCount = response.data.total || 0;
      console.log('TaskList: tâches extraites:', tasksData, 'total:', totalCount);
      setTasks(tasksData);
      setTotal(totalCount);
      setCurrentPage(page);
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err);
      setError('Erreur lors du chargement des tâches');
      setTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3010/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      await axios.delete(`http://localhost:3010/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3010/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const handleDelegate = async (taskId, userId) => {
    try {
      await axios.post(
        `http://localhost:3010/tasks/${taskId}/delegate/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
      setDelegatingTask(null);
    } catch (err) {
      setError('Erreur lors de la délégation');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  // For now, since backend doesn't support status filtering, we filter client-side
  // In production, this should be done server-side
  const allFilteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const totalPages = Math.ceil(allFilteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = allFilteredTasks.slice(startIndex, startIndex + tasksPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white shadow-xl  sm:rounded-2xl border border-gray-100">
      <div className="p-6">
        {!Array.isArray(paginatedTasks) || paginatedTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-medium">Aucune tâche trouvée</p>
            <p className="text-sm mt-2">
              {filter === 'all' ? 'Créez votre première tâche !' :
               filter === 'EN_COURS' ? 'Aucune tâche en cours' :
               'Aucune tâche terminée'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {paginatedTasks.map((task) => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8 w-full mx-auto min-h-64">
                {task.photo && (
                  <img
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                    src={`http://localhost:3010/${task.photo}`}
                    alt="Task"
                  />
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{task.libelle}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    task.status === 'TERMINEE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'TERMINEE' ? '✅' : '⏳'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                {task.voiceMessage && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-500 text-white rounded-full p-1 mr-2">
                          <span className="text-xs">🎵</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">Message vocal</span>
                      </div>
                      <audio
                        controls
                        className="h-6 rounded"
                        src={`http://localhost:3010/${task.voiceMessage}`}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:border-gray-500 focus:outline-none"
                  >
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINEE">Terminée</option>
                  </select>
                  <TaskActions
                    task={task}
                    onEdit={setEditingTask}
                    onDelegate={setDelegatingTask}
                    onDelete={deleteTask}
                  />
                </div>
              </div>
            ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}

      {delegatingTask && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-center">
                👤 Déléguer la tâche
              </h3>
              <p className="text-center text-sm opacity-90 mt-1">{delegatingTask.libelle}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleDelegate(delegatingTask.id, user.id)}
                    className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center"
                  >
                    <span className="text-lg mr-3">👤</span>
                    <span className="font-medium text-gray-800">{user.fullname}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setDelegatingTask(null)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all duration-200"
                >
                  ❌ Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;