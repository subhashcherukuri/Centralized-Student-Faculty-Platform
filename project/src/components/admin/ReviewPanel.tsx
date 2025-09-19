import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Award, CheckCircle, XCircle, MessageSquare, User as UserIcon } from 'lucide-react';
import { Activity, User as UserType } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ReviewPanelProps {
  pendingActivities: Activity[];
  onReviewActivity: (id: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ pendingActivities, onReviewActivity }) => {
  // Load all users from localStorage
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  React.useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(loaded);
    const admin = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentAdminId(admin?.id || null);
  }, []);

  // Remove user account
  const handleRemoveUser = (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this account?')) return;
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Account removed successfully!');
  };
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');

  const handleReviewClick = (activity: Activity, action: 'approved' | 'rejected') => {
    setSelectedActivity(activity);
    setReviewAction(action);
    setReviewComments('');
    setIsModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedActivity) return;

    onReviewActivity(selectedActivity.id, reviewAction, reviewComments || undefined);
    toast.success(`Activity ${reviewAction}!`);
    setIsModalOpen(false);
    setSelectedActivity(null);
    setReviewComments('');
  };

  return (
    <div className="space-y-10">
      {/* Only show Account Management Section if logged-in user is admin */}
      {(() => {
        const admin = JSON.parse(localStorage.getItem('user') || 'null');
        if (admin && admin.role === 'admin') {
          return (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">User Accounts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Student ID</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Mobile</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'student' || u.role === 'faculty').map(user => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 capitalize">{user.role}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{user.department || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{user.studentId || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{user.mobile || '-'}</td>
                        <td className="px-4 py-2">
                          {user.id !== admin.id && (
                            <button
                              onClick={() => handleRemoveUser(user.id)}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-all"
                            >
                              Remove Account
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        return null;
      })()}

        {/* Activity Review Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Activities</h2>
          <p className="text-gray-600 mt-1">{pendingActivities.length} activities pending review</p>

          {pendingActivities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500">No activities pending review at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending Review
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <UserIcon className="h-4 w-4 mr-2" />
                            Student ID: {activity.studentId}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="h-4 w-4 mr-2" />
                            {activity.credits} credits
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Semester {activity.semester}
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Category:</p>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                            {activity.category}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                          <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                        </div>
                        {activity.documentName && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Document:</p>
                            <p className="text-sm text-blue-600">{activity.documentName}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          Submitted on {format(new Date(activity.submittedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="ml-6 flex flex-col space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReviewClick(activity, 'approved')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReviewClick(activity, 'rejected')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Review Modal */}
          {isModalOpen && selectedActivity && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {reviewAction === 'approved' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reviewAction === 'approved' ? 'Approve' : 'Reject'} Activity
                    </h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Activity:</strong> {selectedActivity.title}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                      Comments {reviewAction === 'rejected' ? '(Required)' : '(Optional)'}
                    </label>
                    <textarea
                      id="comments"
                      rows={4}
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        reviewAction === 'approved' 
                          ? 'Add any congratulatory message or feedback...' 
                          : 'Please explain why this activity was rejected...'
                      }
                      required={reviewAction === 'rejected'}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewAction === 'rejected' && !reviewComments.trim()}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-2 focus:ring-offset-2 transition-all ${
                        reviewAction === 'approved'
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {reviewAction === 'approved' ? 'Approve' : 'Reject'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
  );
}