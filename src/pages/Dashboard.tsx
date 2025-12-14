import React from 'react';
import { Users, Eye, Video, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardProps {
  earnings: number;
  isStreaming: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ earnings, isStreaming: _isStreaming }) => {
  const stats = [
    {
      label: 'Total Earnings',
      value: `$${earnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-600',
    },
    { label: 'Active Performers', value: '234', icon: Users, color: 'bg-blue-600' },
    { label: 'Total Clients Online', value: '1,234', icon: Eye, color: 'bg-purple-600' },
    { label: 'VideoCalls Today', value: '567', icon: Video, color: 'bg-pink-600' },
  ];

  const recentActivity = [
    { user: 'viewer123', action: 'sent you a tip', amount: '$25', time: '2 min ago' },
    { user: 'dancequeen', action: 'started following you', amount: '', time: '5 min ago' },
    { user: 'user456', action: 'liked your photo', amount: '', time: '10 min ago' },
    { user: 'premium_fan', action: 'requested private show', amount: '$50', time: '15 min ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Earnings Chart */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold">Weekly Earnings</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-32 md:h-48 flex items-end justify-between space-x-1 md:space-x-2">
            {[40, 65, 30, 80, 45, 90, 75].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-pink-600 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <h3 className="text-base md:text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{activity.user[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-green-500 font-medium text-xs md:text-sm">
                    {activity.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
