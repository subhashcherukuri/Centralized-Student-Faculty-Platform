import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Clock, CheckCircle, XCircle, Calendar, Award } from 'lucide-react';
import { Activity } from '../../types';
import { ActivityForm } from './ActivityForm';
import { format } from 'date-fns';


type ActivityListProps = {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt'>) => void;
  studentId: string;
  canAdd?: boolean;
  isAdmin?: boolean;
};

export const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onAddActivity, 
  studentId, 
  canAdd = true,
  isAdmin = false
}) => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // For admin: map of userId to user name (faculty only)
  const [facultyMap, setFacultyMap] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (isAdmin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const faculty = users.filter((u: any) => u.role === 'faculty');
      const map: { [id: string]: string } = {};
      faculty.forEach((f: any) => {
        map[f.id] = f.name;
      });
      setFacultyMap(map);
    }
  }, [isAdmin]);

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.status === filter;
    const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) ||
                         activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

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

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'extracurricular', label: 'Extracurricular' },
    { value: 'internship', label: 'Internship' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'volunteering', label: 'Volunteering' },
    { value: 'certificate', label: 'Certificate' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
        {canAdd && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <span>{filteredActivities.length} activities found</span>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-6">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {canAdd ? 'Get started by adding your first activity.' : 'No activities match your current filters.'}
            </p>
          </div>
        ) : (
          filteredActivities.map((activity: Activity, index: number) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                    <span className={getStatusBadge(activity.status)}>
                      {activity.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                    <span className="capitalize flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {activity.category}
                    </span>
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {activity.credits} credits
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Semester {activity.semester}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600 leading-relaxed">{activity.description}</p>


                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-400 gap-1 sm:gap-0">
                    <span>Submitted {format(new Date(activity.submittedAt), 'MMM dd, yyyy')}</span>
                    <div className="flex items-center gap-2">
                      {activity.reviewedAt && (
                        <span>Reviewed {format(new Date(activity.reviewedAt), 'MMM dd, yyyy')}</span>
                      )}
                      {/* Show faculty name who approved (admin only, approved activities) */}
                      {isAdmin && activity.status === 'approved' && activity.reviewedBy && facultyMap[activity.reviewedBy] && (
                        <span className="ml-2 text-blue-600 font-semibold">Approved by: {facultyMap[activity.reviewedBy]}</span>
                      )}
                    </div>
                  </div>

                  {activity.reviewComments && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Review Comments:</strong> {activity.reviewComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onSubmit={onAddActivity}
          onClose={() => setShowForm(false)}
          studentId={studentId}
        />
      )}
    </div>
  );
};