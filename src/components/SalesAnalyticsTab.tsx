import React, { useState } from 'react';
import { TrendingUp, Download } from 'lucide-react';

type CategoryKey = 'privateChats' | 'photos' | 'videos' | 'streaming' | 'gifts' | 'tokens';

interface CategoryData {
  count?: number;
  hours?: number;
  amount: number;
}

interface WeeklyData {
  week: string;
  period: string;
  totalEarnings: number;
  privateChats: CategoryData;
  photos: CategoryData;
  videos: CategoryData;
  streaming: CategoryData;
  gifts: CategoryData;
  tokens: CategoryData;
}

const SalesAnalyticsTab: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('2025-W33');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const weeklyData = [
    {
      week: '2025-W33',
      period: 'Aug 12-18, 2025',
      totalEarnings: 234.5,
      privateChats: { count: 15, amount: 89.25 },
      photos: { count: 8, amount: 32.0 },
      videos: { count: 3, amount: 67.5 },
      streaming: { hours: 12, amount: 36.0 },
      gifts: { count: 22, amount: 9.75 },
      tokens: { count: 450, amount: 0.0 },
    },
    {
      week: '2025-W32',
      period: 'Aug 5-11, 2025',
      totalEarnings: 189.3,
      privateChats: { count: 12, amount: 72.0 },
      photos: { count: 6, amount: 24.0 },
      videos: { count: 2, amount: 45.0 },
      streaming: { hours: 10, amount: 30.0 },
      gifts: { count: 18, amount: 8.3 },
      tokens: { count: 380, amount: 10.0 },
    },
    {
      week: '2025-W31',
      period: 'Jul 29-Aug 4, 2025',
      totalEarnings: 156.75,
      privateChats: { count: 10, amount: 60.0 },
      photos: { count: 5, amount: 20.0 },
      videos: { count: 2, amount: 45.0 },
      streaming: { hours: 8, amount: 24.0 },
      gifts: { count: 15, amount: 7.75 },
      tokens: { count: 320, amount: 0.0 },
    },
    {
      week: '2025-W30',
      period: 'Jul 22-28, 2025',
      totalEarnings: 198.2,
      privateChats: { count: 14, amount: 84.0 },
      photos: { count: 7, amount: 28.0 },
      videos: { count: 3, amount: 67.5 },
      streaming: { hours: 11, amount: 33.0 },
      gifts: { count: 20, amount: 8.7 },
      tokens: { count: 420, amount: -23.0 },
    },
    {
      week: '2025-W29',
      period: 'Jul 15-21, 2025',
      totalEarnings: 167.85,
      privateChats: { count: 11, amount: 66.0 },
      photos: { count: 6, amount: 24.0 },
      videos: { count: 2, amount: 45.0 },
      streaming: { hours: 9, amount: 27.0 },
      gifts: { count: 16, amount: 5.85 },
      tokens: { count: 350, amount: 0.0 },
    },
    {
      week: '2025-W28',
      period: 'Jul 8-14, 2025',
      totalEarnings: 145.6,
      privateChats: { count: 9, amount: 54.0 },
      photos: { count: 4, amount: 16.0 },
      videos: { count: 2, amount: 45.0 },
      streaming: { hours: 7, amount: 21.0 },
      gifts: { count: 13, amount: 9.6 },
      tokens: { count: 280, amount: 0.0 },
    },
    {
      week: '2025-W27',
      period: 'Jul 1-7, 2025',
      totalEarnings: 178.9,
      privateChats: { count: 13, amount: 78.0 },
      photos: { count: 6, amount: 24.0 },
      videos: { count: 3, amount: 67.5 },
      streaming: { hours: 10, amount: 30.0 },
      gifts: { count: 18, amount: -20.6 },
      tokens: { count: 390, amount: 0.0 },
    },
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: '📊' },
    { id: 'privateChats', label: 'Private Chats', icon: '💬' },
    { id: 'photos', label: 'Photos', icon: '📸' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'streaming', label: 'Streaming', icon: '📺' },
    { id: 'gifts', label: 'Gifts', icon: '🎁' },
    { id: 'tokens', label: 'Tokens', icon: '🪙' },
  ];

  const currentWeekData = weeklyData.find((week) => week.week === selectedWeek) || weeklyData[0];
  const previousWeekData =
    weeklyData[weeklyData.findIndex((week) => week.week === selectedWeek) + 1];

  const calculateTrend = (category: 'total' | CategoryKey) => {
    if (!previousWeekData) return { change: '0.0', isPositive: true };

    let currentValue, previousValue;

    if (category === 'total') {
      currentValue = currentWeekData.totalEarnings;
      previousValue = previousWeekData.totalEarnings;
    } else {
      currentValue = (currentWeekData as WeeklyData)[category].amount;
      previousValue = (previousWeekData as WeeklyData)[category].amount;
    }

    const change = ((currentValue - previousValue) / previousValue) * 100;
    return { change: change.toFixed(1), isPositive: change >= 0 };
  };

  const getRecommendations = () => {
    const last7Weeks = weeklyData.slice(0, 7);
    const avgEarnings = last7Weeks.reduce((sum, week) => sum + week.totalEarnings, 0) / 7;
    const bestCategory = (Object.entries(currentWeekData) as [string, unknown][])
      .filter(([key]) => !['week', 'period', 'totalEarnings'].includes(key))
      .sort(([, a], [, b]) => {
        const aAmount = (a as CategoryData).amount ?? 0;
        const bAmount = (b as CategoryData).amount ?? 0;
        return bAmount - aAmount;
      })[0];

    return [
      {
        type: 'success',
        title: 'Top Performer',
        message: `${bestCategory[0]} generated $${((bestCategory[1] as CategoryData).amount ?? 0).toFixed(2)} this week`,
        action: 'Focus more time on this category',
      },
      {
        type: 'info',
        title: 'Weekly Average',
        message: `Your 7-week average is $${avgEarnings.toFixed(2)}`,
        action:
          currentWeekData.totalEarnings > avgEarnings
            ? 'Great job! Above average'
            : 'Try to increase engagement',
      },
      {
        type: 'warning',
        title: 'Growth Opportunity',
        message: 'Videos have the highest per-item value',
        action: 'Consider creating more premium video content',
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Sales Analytics</h3>
          <p className="text-gray-400 text-sm">
            Detailed breakdown of your earnings and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {weeklyData.map((week) => (
              <option key={week.week} value={week.week}>
                {week.period}
              </option>
            ))}
          </select>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Resumen semanal */}
      <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-lg border border-pink-500/30 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-semibold text-lg md:text-xl">Week Summary</h4>
            <p className="text-pink-300 text-sm">{currentWeekData.period}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold text-white">
              ${currentWeekData.totalEarnings.toFixed(2)}
            </div>
            <div
              className={`text-sm flex items-center justify-end space-x-1 ${
                calculateTrend('total').isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              <span>{calculateTrend('total').isPositive ? '↗' : '↘'}</span>
              <span>{calculateTrend('total').change}% vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-pink-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Desglose por categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💬</span>
              <h5 className="text-white font-medium">Private Chats</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('privateChats').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('privateChats').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sessions:</span>
              <span className="text-white font-medium">{currentWeekData.privateChats.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Earnings:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.privateChats.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg per session:</span>
              <span className="text-white">
                $
                {(currentWeekData.privateChats.amount / currentWeekData.privateChats.count).toFixed(
                  2
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📸</span>
              <h5 className="text-white font-medium">Photos Sold</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('photos').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('photos').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Photos sold:</span>
              <span className="text-white font-medium">{currentWeekData.photos.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Earnings:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.photos.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg per photo:</span>
              <span className="text-white">
                ${(currentWeekData.photos.amount / currentWeekData.photos.count).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎥</span>
              <h5 className="text-white font-medium">Videos Sold</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('videos').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('videos').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Videos sold:</span>
              <span className="text-white font-medium">{currentWeekData.videos.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Earnings:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.videos.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg per video:</span>
              <span className="text-white">
                ${(currentWeekData.videos.amount / currentWeekData.videos.count).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📺</span>
              <h5 className="text-white font-medium">Live Streaming</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('streaming').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('streaming').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Hours streamed:</span>
              <span className="text-white font-medium">{currentWeekData.streaming.hours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Earnings:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.streaming.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Per hour:</span>
              <span className="text-white">
                ${(currentWeekData.streaming.amount / currentWeekData.streaming.hours).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎁</span>
              <h5 className="text-white font-medium">Gifts Received</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('gifts').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('gifts').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gifts received:</span>
              <span className="text-white font-medium">{currentWeekData.gifts.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total value:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.gifts.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg per gift:</span>
              <span className="text-white">
                ${(currentWeekData.gifts.amount / currentWeekData.gifts.count).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🪙</span>
              <h5 className="text-white font-medium">Token Packages</h5>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                calculateTrend('tokens').isPositive
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {calculateTrend('tokens').change}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tokens received:</span>
              <span className="text-white font-medium">{currentWeekData.tokens.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cash value:</span>
              <span className="text-green-400 font-bold">
                ${currentWeekData.tokens.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Token rate:</span>
              <span className="text-white">
                ${(currentWeekData.tokens.amount / currentWeekData.tokens.count).toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de tendencias */}
      <div className="bg-slate-700 rounded-lg border border-slate-600 p-4 md:p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          <span>7-Week Trend Analysis</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de tendencias */}
          <div>
            <h5 className="text-gray-300 font-medium mb-3">Weekly Earnings Trend</h5>
            <div className="h-32 flex items-end justify-between space-x-1">
              {weeklyData
                .slice(0, 7)
                .reverse()
                .map((week, _index) => {
                  const maxEarnings = Math.max(
                    ...weeklyData.slice(0, 7).map((w) => w.totalEarnings)
                  );
                  const height = (week.totalEarnings / maxEarnings) * 100;
                  return (
                    <div key={week.week} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-pink-600 to-purple-600 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-left">
                        W{week.week.split('-W')[1]}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Top categorías */}
          <div>
            <h5 className="text-gray-300 font-medium mb-3">Category Performance</h5>
            <div className="space-y-2">
              {Object.entries(currentWeekData)
                .filter(([key]) => !['week', 'period', 'totalEarnings'].includes(key))
                .sort(([, a], [, b]) => {
                  const aAmount = (a as CategoryData).amount ?? 0;
                  const bAmount = (b as CategoryData).amount ?? 0;
                  return bAmount - aAmount;
                })
                .map(([category, data]) => {
                  const cat = data as CategoryData;
                  const percentage = (cat.amount / currentWeekData.totalEarnings) * 100;
                  const categoryLabels: { [key: string]: string } = {
                    privateChats: 'Private Chats',
                    photos: 'Photos',
                    videos: 'Videos',
                    streaming: 'Streaming',
                    gifts: 'Gifts',
                    tokens: 'Tokens',
                  };
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">{categoryLabels[category]}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white font-medium">
                          ${cat.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-slate-700 rounded-lg border border-slate-600 p-4 md:p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <span className="text-lg">💡</span>
          <span>AI-Powered Recommendations</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getRecommendations().map((rec, _index) => (
            <div
              key={_index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.type === 'success'
                  ? 'bg-green-900/20 border-green-500'
                  : rec.type === 'warning'
                  ? 'bg-yellow-900/20 border-yellow-500'
                  : 'bg-blue-900/20 border-blue-500'
              }`}
            >
              <h5 className="text-white font-medium mb-2">{rec.title}</h5>
              <p className="text-gray-300 text-sm mb-2">{rec.message}</p>
              <p
                className={`text-xs font-medium ${
                  rec.type === 'success'
                    ? 'text-green-400'
                    : rec.type === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}
              >
                {rec.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparación histórica */}
      <div className="bg-slate-700 rounded-lg border border-slate-600 p-4 md:p-6">
        <h4 className="text-white font-semibold mb-4">Historical Comparison</h4>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-slate-600">
                <th className="pb-2">Week</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Chats</th>
                <th className="pb-2">Photos</th>
                <th className="pb-2">Videos</th>
                <th className="pb-2">Streaming</th>
                <th className="pb-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.slice(0, 5).map((week, index) => {
                const prevWeek = weeklyData[index + 1];
                const change = prevWeek
                  ? ((week.totalEarnings - prevWeek.totalEarnings) / prevWeek.totalEarnings) * 100
                  : 0;
                return (
                  <tr key={week.week} className="border-b border-slate-600">
                    <td className="py-2 text-white text-sm">{week.period}</td>
                    <td className="py-2 text-green-400 font-medium text-sm">
                      ${week.totalEarnings.toFixed(2)}
                    </td>
                    <td className="py-2 text-gray-300 text-sm">
                      ${week.privateChats.amount.toFixed(0)}
                    </td>
                    <td className="py-2 text-gray-300 text-sm">${week.photos.amount.toFixed(0)}</td>
                    <td className="py-2 text-gray-300 text-sm">${week.videos.amount.toFixed(0)}</td>
                    <td className="py-2 text-gray-300 text-sm">
                      ${week.streaming.amount.toFixed(0)}
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsTab;
