import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, Calendar, User, Mail, GraduationCap, Pencil } from 'lucide-react';
import { Activity, User as UserType } from '../../types';
import { generatePortfolioPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface PortfolioViewProps {
  user: UserType;
  activities: Activity[];
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ user, activities }) => {
  const approvedActivities = activities.filter(activity => activity.status === 'approved');
  const totalCredits = approvedActivities.reduce((sum, activity) => sum + activity.credits, 0);

  // Profile state
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    studentId: user.studentId || '',
    department: user.department || '',
    semester: user.semester || 1,
    mobile: user.mobile || '',
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });

  useEffect(() => {
    // Load from localStorage if available
    const data = localStorage.getItem(`profile_links_${user.id}`);
    if (data) {
      const parsed = JSON.parse(data);
      setProfile(prev => ({ ...prev, ...parsed }));
    }
  }, [user.id]);

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating portfolio...');
      const doc = await generatePortfolioPDF(user, approvedActivities);
      doc.save(`${user.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
      toast.dismiss();
      toast.success('Portfolio downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate portfolio');
    }
  };

  const handleSharePortfolio = async () => {
    const portfolioUrl = `${window.location.origin}/portfolio/${user.id}`;
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      toast.success('Portfolio link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const categoriesData = approvedActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.credits;
    return acc;
  }, {} as Record<string, number>);

  // Edit Profile Modal logic
  const openEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(true);
  };
  const closeEdit = () => setIsEditing(false);
  const saveEdit = () => {
    setProfile(editProfile);
    localStorage.setItem(`profile_links_${user.id}`, JSON.stringify(editProfile));
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div>
              {/* Name */}
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
              </div>
              {/* Email */}
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 mr-1" />
                {profile.email}
              </div>
              {/* Department */}
              <div className="flex items-center gap-2 mt-1">
                <GraduationCap className="h-4 w-4 mr-1" />
                {profile.department}
              </div>
              {/* Student ID */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">ID:</span>  
                {profile.studentId}
              </div>
              {/* Semester */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">Semester:</span>
                {profile.semester}
              </div>
              {/* Mobile */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">Mobile:</span>
                {profile.mobile}
              </div>
              {/* Professional URLs */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline hover:text-white text-sm">GitHub</a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline hover:text-white text-sm">LinkedIn</a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline hover:text-white text-sm">Twitter</a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline hover:text-white text-sm">Website</a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={openEdit}
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Portfolio
            </button>
            <button
              onClick={handleSharePortfolio}
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal/Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Name
                <input type="text" value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Email
                <input type="email" value={editProfile.email} onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Department
                <input type="text" value={editProfile.department} onChange={e => setEditProfile(p => ({ ...p, department: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Student ID
                <input type="text" value={editProfile.studentId} onChange={e => setEditProfile(p => ({ ...p, studentId: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Semester
                <input type="number" min={1} value={editProfile.semester} onChange={e => setEditProfile(p => ({ ...p, semester: Number(e.target.value) }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Mobile
                <input type="text" value={editProfile.mobile} onChange={e => setEditProfile(p => ({ ...p, mobile: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">GitHub
                <input type="url" value={editProfile.github} onChange={e => setEditProfile(p => ({ ...p, github: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">LinkedIn
                <input type="url" value={editProfile.linkedin} onChange={e => setEditProfile(p => ({ ...p, linkedin: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Twitter
                <input type="url" value={editProfile.twitter} onChange={e => setEditProfile(p => ({ ...p, twitter: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="font-semibold">Website
                <input type="url" value={editProfile.website} onChange={e => setEditProfile(p => ({ ...p, website: e.target.value }))} className="block w-full border rounded px-2 py-1 mt-1" />
              </label>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={saveEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              >
                Save
              </button>
              <button
                onClick={closeEdit}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{approvedActivities.length}</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{user.semester || 'N/A'}</p>
              <p className="text-sm text-gray-600">Current Semester</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories Overview */}
      {Object.keys(categoriesData).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Credits by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoriesData).map(([category, credits]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                <span className="text-sm font-bold text-blue-600">{credits} credits</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Activities List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approved Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {approvedActivities.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No approved activities yet</h3>
              <p className="mt-1 text-sm text-gray-500">Submit activities to build your portfolio.</p>
            </div>
          ) : (
            approvedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">{activity.title}</h4>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{activity.category}</span>
                      <span>{activity.credits} credits</span>
                      <span>Semester {activity.semester}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Completed {format(new Date(activity.submittedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}