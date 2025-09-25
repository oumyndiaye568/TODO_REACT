import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import History from './History';

const Dashboard = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskRefreshTrigger, setTaskRefreshTrigger] = useState(0);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'EN_COURS', 'TERMINEE'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-xl shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                  Todo App
                </h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`${
                    activeTab === 'tasks'
                      ? 'border-gray-500 text-gray-600 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                  } inline-flex items-center px-4 py-2 rounded-lg border-b-2 text-sm font-semibold transition-all duration-200`}
                >
                  📋 Tâches
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`${
                    activeTab === 'history'
                      ? 'border-gray-500 text-gray-600 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                  } inline-flex items-center px-4 py-2 rounded-lg border-b-2 text-sm font-semibold transition-all duration-200`}
                >
                  📊 Historique
                </button>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                <span className="text-green-600 mr-2">👋</span>
                <span className="text-gray-800 font-medium">Bonjour, {user.fullname}</span>
              </div>
              <button
                onClick={logout}
                className="ml-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🔓 Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">📋 Mes Tâches</h2>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-white text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
                  >
                    <span className="mr-2">✨</span>
                    Nouvelle Tâche
                  </button>
                </div>
              </div>
              <div className="px-8 py-6 bg-gray-50">
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      taskFilter === 'all'
                        ? 'bg-gray-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    📋 Toutes
                  </button>
                  <button
                    onClick={() => setTaskFilter('EN_COURS')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      taskFilter === 'EN_COURS'
                        ? 'bg-yellow-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    ⏳ En cours
                  </button>
                  <button
                    onClick={() => setTaskFilter('TERMINEE')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      taskFilter === 'TERMINEE'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    ✅ Terminées
                  </button>
                </div>
                <TaskList refreshTrigger={taskRefreshTrigger} filter={taskFilter} />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6">
                <h2 className="text-3xl font-bold text-white">📊 Historique</h2>
              </div>
              <div className="px-8 py-6">
                <History />
              </div>
            </div>
          )}
        </div>
      </main>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSuccess={() => {
            console.log('onSuccess appelé dans Dashboard, incrémentation du refreshTrigger');
            setShowTaskForm(false);
            setTaskRefreshTrigger(prev => {
              const newValue = prev + 1;
              console.log('Nouveau refreshTrigger:', newValue);
              return newValue;
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;