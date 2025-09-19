import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ActivityList } from './components/activities/ActivityList';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { ProfileView } from './components/profile/ProfileView';
import { AcademicsTab } from './components/academics/AcademicsTab';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ReviewPanel } from './components/admin/ReviewPanel';
import { useActivities } from './hooks/useActivities';
import { calculateAnalytics } from './utils/analytics';

// Initialize demo data only if there are no users or activities at all
const initializeDemoData = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!Array.isArray(users) || users.length === 0) {
      const demoUsers = [
        {
          id: '1',
          email: 'student@demo.com',
          password: 'password',
          name: 'John Doe',
          role: 'student',
          studentId: 'ST12345',
          department: 'Computer Science',
          semester: 6,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'faculty@demo.com',
          password: 'password',
          name: 'Dr. Jane Smith',
          role: 'faculty',
          department: 'Computer Science',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          email: 'admin@demo.com',
          password: 'password',
          name: 'Admin User',
          role: 'admin',
          department: 'Administration',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
  } catch (e) {
    // fallback: set demo users if error
    const demoUsers = [
      {
        id: '1',
        email: 'student@demo.com',
        password: 'password',
        name: 'John Doe',
        role: 'student',
        studentId: 'ST12345',
        department: 'Computer Science',
        semester: 6,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'faculty@demo.com',
        password: 'password',
        name: 'Dr. Jane Smith',
        role: 'faculty',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'admin@demo.com',
        password: 'password',
        name: 'Admin User',
        role: 'admin',
        department: 'Administration',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }

  try {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    if (!Array.isArray(activities) || activities.length === 0) {
      const demoActivities = [
        {
          id: '1',
          studentId: '1',
          title: 'Machine Learning Certification',
          description: 'Completed advanced machine learning course with practical projects on neural networks and deep learning.',
          category: 'certificate',
          semester: 6,
          credits: 3,
          status: 'approved',
          submittedAt: '2024-01-15T10:00:00Z',
          reviewedAt: '2024-01-16T14:30:00Z',
          reviewedBy: '2',
          reviewComments: 'Excellent work on the certification!'
        },
        {
          id: '2',
          studentId: '1',
          title: 'Software Engineering Internship',
          description: 'Worked as a software development intern at TechCorp, developing web applications using React and Node.js.',
          category: 'internship',
          semester: 5,
          credits: 5,
          status: 'approved',
          submittedAt: '2024-01-10T09:00:00Z',
          reviewedAt: '2024-01-12T16:15:00Z',
          reviewedBy: '2'
        },
        {
          id: '3',
          studentId: '1',
          title: 'Hackathon Winner',
          description: 'Won first place in the university hackathon by developing an innovative mobile app for student productivity.',
          category: 'extracurricular',
          semester: 6,
          credits: 2,
          status: 'pending',
          submittedAt: '2024-01-20T11:30:00Z'
        },
        {
          id: '4',
          studentId: '1',
          title: 'Research Paper Publication',
          description: 'Published research paper on "AI Applications in Education" in the International Journal of Educational Technology.',
          category: 'academic',
          semester: 6,
          credits: 4,
          status: 'approved',
          submittedAt: '2024-01-05T14:20:00Z',
          reviewedAt: '2024-01-07T10:45:00Z',
          reviewedBy: '2'
        }
      ];
      localStorage.setItem('activities', JSON.stringify(demoActivities));
    }
  } catch (e) {
    // fallback: set demo activities if error
    const demoActivities = [
      {
        id: '1',
        studentId: '1',
        title: 'Machine Learning Certification',
        description: 'Completed advanced machine learning course with practical projects on neural networks and deep learning.',
        category: 'certificate',
        semester: 6,
        credits: 3,
        status: 'approved',
        submittedAt: '2024-01-15T10:00:00Z',
        reviewedAt: '2024-01-16T14:30:00Z',
        reviewedBy: '2',
        reviewComments: 'Excellent work on the certification!'
      },
      {
        id: '2',
        studentId: '1',
        title: 'Software Engineering Internship',
        description: 'Worked as a software development intern at TechCorp, developing web applications using React and Node.js.',
        category: 'internship',
        semester: 5,
        credits: 5,
        status: 'approved',
        submittedAt: '2024-01-10T09:00:00Z',
        reviewedAt: '2024-01-12T16:15:00Z',
        reviewedBy: '2'
      },
      {
        id: '3',
        studentId: '1',
        title: 'Hackathon Winner',
        description: 'Won first place in the university hackathon by developing an innovative mobile app for student productivity.',
        category: 'extracurricular',
        semester: 6,
        credits: 2,
        status: 'pending',
        submittedAt: '2024-01-20T11:30:00Z'
      },
      {
        id: '4',
        studentId: '1',
        title: 'Research Paper Publication',
        description: 'Published research paper on "AI Applications in Education" in the International Journal of Educational Technology.',
        category: 'academic',
        semester: 6,
        credits: 4,
        status: 'approved',
        submittedAt: '2024-01-05T14:20:00Z',
        reviewedAt: '2024-01-07T10:45:00Z',
        reviewedBy: '2'
      }
    ];
    localStorage.setItem('activities', JSON.stringify(demoActivities));
  }
};


const AppContent: React.FC = () => {
  // All hooks must be called unconditionally at the top
  const { user, loading } = useAuth();
  const { activities, addActivity, updateActivity, getStudentActivities, getPendingActivities } = useActivities();

  // Compute userActivities and analytics safely
  let userActivities = activities;
  if (user && user.role === 'student') {
    userActivities = getStudentActivities(user.id);
  } else if (user && user.role === 'faculty') {
    userActivities = activities.filter(a => a.reviewedBy === user.id);
  }
  const analytics = calculateAnalytics(userActivities);

  // Pending activities for review panel (admin/faculty)
  const pendingActivities = getPendingActivities ? getPendingActivities() : [];

  // Handlers for edit academics modal
  const openEditAcademics = () => setIsEditingAcademics(true);
  const closeEditAcademics = () => setIsEditingAcademics(false);

  // Dummy handler for review panel (implement as needed)
  const handleReviewActivity = () => {};
  const [currentView, setCurrentView] = useState('dashboard');

  // Admin: select student to edit academics
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [academics, setAcademics] = useState<any>({
    records: Array.from({ length: 6 }, (_, i) => ({ semester: i + 1, sgpa: 0, attendance: 0 })),
    cgpa: 0,
    extraDetails: { backlogs: 0, awards: '', remarks: '' }
  });
  const [isEditingAcademics, setIsEditingAcademics] = useState(false);
  const [editAcademics, setEditAcademics] = useState(academics);

  // Only run user-dependent logic after user is loaded
  React.useEffect(() => {
    if (!user) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchUsersAndAcademics = async () => {
      if (user.role === 'admin') {
        // Fetch all users from backend
        try {
          const res = await fetch(`${apiUrl}/users`);
          if (res.ok) {
            const loaded = await res.json();
            setAllUsers(loaded.filter((u: any) => u.role === 'student'));
            if (!selectedStudentId && loaded.length > 0) {
              const firstStudent = loaded.find((u: any) => u.role === 'student');
              if (firstStudent) setSelectedStudentId(firstStudent._id || firstStudent.id);
            }
          }
        } catch {}
      }
      // Load academics for selected student (admin) or self (student)
      const sid = user.role === 'admin' ? (selectedStudentId || '') : user.id;
      if (sid) {
        try {
          const res = await fetch(`${apiUrl}/academics/${sid}`);
          if (res.ok) {
            const data = await res.json();
            if (data) setAcademics(data);
            else setAcademics({
              records: Array.from({ length: 6 }, (_, i) => ({ semester: i + 1, sgpa: 0, attendance: 0 })),
              cgpa: 0,
              extraDetails: { backlogs: 0, awards: '', remarks: '' }
            });
          } else {
            setAcademics({
              records: Array.from({ length: 6 }, (_, i) => ({ semester: i + 1, sgpa: 0, attendance: 0 })),
              cgpa: 0,
              extraDetails: { backlogs: 0, awards: '', remarks: '' }
            });
          }
        } catch {
          setAcademics({
            records: Array.from({ length: 6 }, (_, i) => ({ semester: i + 1, sgpa: 0, attendance: 0 })),
            cgpa: 0,
            extraDetails: { backlogs: 0, awards: '', remarks: '' }
          });
        }
      }
    };
    fetchUsersAndAcademics();
    // eslint-disable-next-line
  }, [user, selectedStudentId]);

  // Keep editAcademics in sync with academics when student changes
  React.useEffect(() => {
    setEditAcademics(academics);
  }, [academics]);

  useEffect(() => {
    // Update navigation based on URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      setCurrentView(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If loading, show loading spinner
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  const renderContent = () => {
    if (!user) return null;
    switch (currentView) {
      case 'activities':
        return (
          <ActivityList
            activities={userActivities}
            onAddActivity={addActivity}
            studentId={user.id}
            canAdd={user.role === 'student'}
            isAdmin={user.role === 'admin'}
          />
        );
      case 'portfolio':
        if (user.role === 'student') {
          return <PortfolioView user={user} activities={userActivities} />;
        } else {
          return <ProfileView user={user} />;
        }
      case 'academics':
        return (
          <div className="max-w-2xl mx-auto mt-8 space-y-8">
            {user.role === 'admin' && (
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-lg text-blue-800">Select Student</label>
                <select
                  className="border border-blue-400 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50 text-blue-900 font-medium"
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <AcademicsTab
                records={academics.records}
                cgpa={academics.cgpa}
                extraDetails={academics.extraDetails}
              />
            </div>
            {user.role === 'admin' && selectedStudentId && (
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-800 font-semibold text-lg transition"
                  onClick={openEditAcademics}
                >
                  Edit Academics
                </button>
              </div>
            )}
            {/* Modal for editing academics (admin only) */}
            {isEditingAcademics && user.role === 'admin' && selectedStudentId && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-700">Edit Academic Records</h3>
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {editAcademics.records.map((rec: any, idx: number) => (
                        <div key={rec.semester} className="flex flex-col bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <span className="font-semibold text-blue-800 mb-1">Semester {rec.semester}</span>
                          <label className="text-xs text-blue-700">SGPA</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            className="border rounded px-2 py-1 w-full mb-2"
                            value={rec.sgpa}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              setEditAcademics((prev: any) => {
                                const updated = { ...prev };
                                updated.records[idx].sgpa = isNaN(val) ? 0 : val;
                                updated.cgpa = updated.records.reduce((sum: number, r: any) => sum + (parseFloat(r.sgpa) || 0), 0) / updated.records.length;
                                return updated;
                              });
                            }}
                          />
                          <label className="text-xs text-blue-700">Attendance (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="border rounded px-2 py-1 w-full"
                            value={rec.attendance}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              setEditAcademics((prev: any) => {
                                const updated = { ...prev };
                                updated.records[idx].attendance = isNaN(val) ? 0 : val;
                                return updated;
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="font-semibold text-blue-800">Backlogs</label>
                        <input
                          type="number"
                          min="0"
                          className="border rounded px-2 py-1 w-full"
                          value={editAcademics.extraDetails.backlogs}
                          onChange={e => setEditAcademics((prev: any) => ({ ...prev, extraDetails: { ...prev.extraDetails, backlogs: parseInt(e.target.value) || 0 } }))}
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-blue-800">Awards</label>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editAcademics.extraDetails.awards}
                          onChange={e => setEditAcademics((prev: any) => ({ ...prev, extraDetails: { ...prev.extraDetails, awards: e.target.value } }))}
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-blue-800">Remarks</label>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editAcademics.extraDetails.remarks}
                          onChange={e => setEditAcademics((prev: any) => ({ ...prev, extraDetails: { ...prev.extraDetails, remarks: e.target.value } }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
                      onClick={closeEditAcademics}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-800 font-semibold"
                      onClick={async () => {
                        try {
                          const apiUrl = import.meta.env.VITE_API_URL;
                          const sid = selectedStudentId;
                          const res = await fetch(`${apiUrl}/academics/${sid}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editAcademics)
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setAcademics(data);
                            setIsEditingAcademics(false);
                          }
                        } catch {}
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard analytics={analytics} />;
      case 'review':
        if (user.role === 'faculty' || user.role === 'admin') {
          return <ReviewPanel 
            pendingActivities={pendingActivities} 
            onReviewActivity={handleReviewActivity}
          />;
        }
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

// ...existing code...