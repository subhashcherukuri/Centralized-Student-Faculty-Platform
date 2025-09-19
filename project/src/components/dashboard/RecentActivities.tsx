import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Activity, User } from '../../types';
import { format } from 'date-fns';

interface RecentActivitiesProps {
  activities: Activity[];
  users?: User[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, users }) => {
  const recentActivities = activities.slice(0, 5);

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-amber-100 text-amber-800`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white shadow-lg rounded-xl border border-gray-100"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Recent Activities
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentActivities.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by submitting your first activity.</p>
          </div>
        ) : (
          recentActivities.map((activity, index) => {
            let owner: User | undefined = undefined;
            if (users) {
              owner = users.find(u => u.id === activity.studentId);
            }
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <span className={getStatusBadge(activity.status)}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="capitalize">{activity.category}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.credits} credits</span>
                      <span className="mx-2">•</span>
                      <span>Semester {activity.semester}</span>
                    </div>
                    {owner && (
                      <div className="mt-1 text-xs text-blue-700">
                        By: {owner.name} ({owner.role})
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Submitted {format(new Date(activity.submittedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};