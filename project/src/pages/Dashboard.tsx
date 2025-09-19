
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../hooks/useActivities';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { calculateAnalytics } from '../utils/analytics';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  React.useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(loaded);
  }, []);
  const { activities, getStudentActivities } = useActivities();

  let userActivities = activities;
  if (user?.role === 'student') {
    userActivities = getStudentActivities(user.id);
  } else if (user?.role === 'faculty') {
    // Faculty: show only activities reviewed by this faculty
    userActivities = activities.filter(a => a.reviewedBy === user.id);
  }

  const analytics = calculateAnalytics(userActivities);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your {user?.role === 'student' ? 'academic progress' : 'platform activity'}.
        </p>
      </div>

      <DashboardStats analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivities activities={userActivities} users={user?.role === 'admin' ? users : undefined} />
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role === 'student' && (
              <>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <p className="font-medium text-blue-900">Submit New Activity</p>
                  <p className="text-sm text-blue-600">Add a new achievement or activity</p>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <p className="font-medium text-green-900">Download Portfolio</p>
                  <p className="text-sm text-green-600">Generate your verified portfolio PDF</p>
                </button>
              </>
            )}
            {(user?.role === 'faculty' || user?.role === 'admin') && (
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <p className="font-medium text-purple-900">Review Activities</p>
                <p className="text-sm text-purple-600">{analytics.pendingActivities} activities pending review</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};