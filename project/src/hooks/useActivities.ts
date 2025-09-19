import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { useAuth } from '../context/AuthContext';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/activities`);
        const data = await res.json();
        setActivities(data);
      } catch (e) {
        setActivities([]);
      }
      setLoading(false);
    };
    loadActivities();
  }, []);

  const addActivity = async (activity: Omit<Activity, 'id' | 'submittedAt'>) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      const data = await res.json();
      if (res.ok) {
        setActivities(prev => [...prev, data]);
        return data;
      }
      throw new Error(data.error || 'Failed to add activity');
    } catch (e) {
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setActivities(prev => prev.map(a => a.id === id ? data : a));
      }
    } catch (e) {}
  };

  const deleteActivity = async (id: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/activities/${id}`, { method: 'DELETE' });
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (e) {}
  };

  const getStudentActivities = (studentId: string) => {
    return activities.filter(activity => activity.studentId === studentId);
  };

  const getPendingActivities = () => {
    return activities.filter(activity => activity.status === 'pending');
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    getStudentActivities,
    getPendingActivities
  };
};