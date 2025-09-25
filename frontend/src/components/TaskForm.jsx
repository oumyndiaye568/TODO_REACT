import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ onClose, task, onSuccess }) => {
  const { token } = useAuth();
  const [libelle, setLibelle] = useState(task?.libelle || '');
  const [description, setDescription] = useState(task?.description || '');
  const [photo, setPhoto] = useState(null);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'voice-message.wav', { type: 'audio/wav' });
        setVoiceMessage(file);
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          setRecordingTime(prev => {
            if (prev >= 29) {
              stopRecording();
              return 30;
            }
            return prev + 1;
          });
        }
      }, 1000);

      // Auto stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000);
    } catch (err) {
      setError('Erreur lors de l\'accès au microphone. Assurez-vous d\'autoriser l\'accès au microphone dans les paramètres de votre navigateur et que vous utilisez HTTPS ou localhost.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setVoiceMessage(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('libelle', libelle);
      formData.append('description', description);
      if (photo) {
        formData.append('photo', photo);
      }
      if (voiceMessage) {
        formData.append('voiceMessage', voiceMessage);
      }

      if (task) {
        // Update existing task
        await axios.put(`http://localhost:3010/tasks/${task.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new task
        await axios.post('http://localhost:3010/tasks', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log('Tâche créée/modifiée avec succès, appel de onSuccess');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 rounded-t-xl">
          <h3 className="text-xl font-bold text-center">
            {task ? '✏️ Modifier la tâche' : '📝 Nouvelle tâche'}
          </h3>
        </div>
        <div className="p-5">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                required
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Titre de la tâche"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
                placeholder="Description de la tâche"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (optionnel)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message vocal (optionnel)
              </label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {!isRecording ? (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      🎤 Enregistrer
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="text-sm text-gray-600">
                      {isPaused ? '⏸️ En pause' : '🔴 Enregistrement'} - {recordingTime}s / 30s
                    </div>
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={pauseRecording}
                        className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      >
                        {isPaused ? '▶️' : '⏸️'}
                      </button>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                      >
                        ⏹️
                      </button>
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                )}
                {voiceMessage && !isRecording && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-green-600">✅ Message enregistré</span>
                    <audio controls className="h-6" src={URL.createObjectURL(voiceMessage)} />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;