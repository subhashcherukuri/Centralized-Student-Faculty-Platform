import React from 'react';
import { Activity, User } from '../../types';
import { ActivityList } from './ActivityList';

interface AdminActivityListProps {
  activities: Activity[];
  users: User[];
}

export const AdminActivityList: React.FC<AdminActivityListProps> = ({ activities, users }) => {
  // Get all students and faculty
  // (Unused studentUsers/facultyUsers removed)

  // Activities by role
  const studentActivities = activities.filter(a => {
    const owner = users.find(u => u.id === a.studentId);
    return owner && owner.role === 'student';
  });
  const facultyActivities = activities.filter(a => {
    const owner = users.find(u => u.id === a.studentId);
    return owner && owner.role === 'faculty';
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-2">Student Activities</h2>
  <ActivityList activities={studentActivities} canAdd={false} onAddActivity={() => {}} studentId={""} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-purple-700 mb-2">Faculty Activities</h2>
  <ActivityList activities={facultyActivities} canAdd={false} onAddActivity={() => {}} studentId={""} />
      </div>
    </div>
  );
};