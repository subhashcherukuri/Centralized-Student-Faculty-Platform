import { Activity, Analytics } from '../types';

export const calculateAnalytics = (activities: Activity[]): Analytics => {
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const pendingActivities = activities.filter(a => a.status === 'pending');

  // Activities by semester
  const activitiesBySemester = Array.from({ length: 8 }, (_, i) => ({
    semester: i + 1,
    count: activities.filter(a => a.semester === i + 1).length
  })).filter(s => s.count > 0);

  // Activities by category
  const categories = ['academic', 'extracurricular', 'internship', 'workshop', 'volunteering', 'certificate'];
  const activitiesByCategory = categories.map(category => ({
    category,
    count: activities.filter(a => a.category === category).length
  })).filter(c => c.count > 0);

  // Credits per month (last 12 months)
  const now = new Date();
  const creditsPerMonth = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthActivities = approvedActivities.filter(a => {
      const activityDate = new Date(a.submittedAt);
      return activityDate.getMonth() === date.getMonth() && 
             activityDate.getFullYear() === date.getFullYear();
    });
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      credits: monthActivities.reduce((sum, a) => sum + a.credits, 0)
    };
  }).reverse();

  return {
    totalActivities: activities.length,
    totalCredits: approvedActivities.reduce((sum, a) => sum + a.credits, 0),
    approvedActivities: approvedActivities.length,
    pendingActivities: pendingActivities.length,
    activitiesBySemester,
    activitiesByCategory,
    creditsPerMonth
  };
};

export const getCreditsByCategory = (activities: Activity[]): Record<string, number> => {
  const approved = activities.filter(a => a.status === 'approved');
  const result: Record<string, number> = {};
  
  approved.forEach(activity => {
    result[activity.category] = (result[activity.category] || 0) + activity.credits;
  });
  
  return result;
};