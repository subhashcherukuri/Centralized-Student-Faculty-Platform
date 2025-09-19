import React from 'react';
import { User } from '../../types';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  // Simple avatar using initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    faculty: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex-shrink-0">
          <div className="h-20 w-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700">
            {getInitials(user.name)}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="font-semibold text-gray-700">Email:</span>
          <div className="text-gray-900">{user.email}</div>
        </div>
        {user.department && (
          <div>
            <span className="font-semibold text-gray-700">Department:</span>
            <div className="text-gray-900">{user.department}</div>
          </div>
        )}
        {user.studentId && (
          <div>
            <span className="font-semibold text-gray-700">Student ID:</span>
            <div className="text-gray-900">{user.studentId}</div>
          </div>
        )}
        {user.semester && (
          <div>
            <span className="font-semibold text-gray-700">Semester:</span>
            <div className="text-gray-900">{user.semester}</div>
          </div>
        )}
        {user.mobile && (
          <div>
            <span className="font-semibold text-gray-700">Mobile:</span>
            <div className="text-gray-900">{user.mobile}</div>
          </div>
        )}
        <div>
          <span className="font-semibold text-gray-700">Joined:</span>
          <div className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};
