import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Award } from 'lucide-react';
import { Analytics } from '../../types';

interface DashboardStatsProps {
  analytics: Analytics;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ analytics }) => {
  const stats = [
    {
      name: 'Total Activities',
      value: analytics.totalActivities,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Credits',
      value: analytics.totalCredits,
      icon: Award,
      color: 'bg-green-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      name: 'Approved',
      value: analytics.approvedActivities,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+4.1%',
      changeType: 'positive'
    },
    {
      name: 'Pending',
      value: analytics.pendingActivities,
      icon: Clock,
      color: 'bg-amber-500',
      change: '-2.3%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};