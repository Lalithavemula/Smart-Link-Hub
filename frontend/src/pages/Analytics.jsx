import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card, CardContent } from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { Eye, QrCode, MousePointerClick, TrendingUp, Clock, Globe } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function Analytics() {
  const { data, loading, fetchAnalytics } = useAnalytics();
  const [filter, setFilter] = useState('ALL'); // ALL, PROFILE_VIEW, LINK_CLICK, QR_SCAN

  useEffect(() => {
    fetchAnalytics({ eventType: filter === 'ALL' ? undefined : filter });
  }, [filter, fetchAnalytics]);

  if (loading && !data) {
    return <div className="flex justify-center py-12"><Loader /></div>;
  }

  // Calculate totals from data if possible, else default to 0
  const events = data?.content || [];
  const totals = {
    views: events.filter(e => e.eventType === 'PROFILE_VIEW').length || 0,
    clicks: events.filter(e => e.eventType === 'LINK_CLICK').length || 0,
    scans: events.filter(e => e.eventType === 'QR_SCAN').length || 0,
  };

  // Mock Top Link
  const topLink = { title: 'GitHub Portfolio', clicks: Math.max(totals.clicks, 42), trend: '+12%' };
  
  // Mock Recent Visitors
  const recentVisitors = [
    { id: 1, location: 'San Francisco, US', device: 'iPhone', time: '2 mins ago' },
    { id: 2, location: 'London, UK', device: 'MacBook', time: '15 mins ago' },
    { id: 3, location: 'Tokyo, JP', device: 'Android', time: '1 hour ago' },
    { id: 4, location: 'Toronto, CA', device: 'Windows', time: '3 hours ago' },
  ];

  // Mock data for charts since backend might not return aggregated time series directly
  const mockTimeSeries = [
    { name: 'Mon', views: 40, clicks: 24, scans: 24 },
    { name: 'Tue', views: 30, clicks: 13, scans: 22 },
    { name: 'Wed', views: 20, clicks: 58, scans: 22 },
    { name: 'Thu', views: 27, clicks: 39, scans: 20 },
    { name: 'Fri', views: 18, clicks: 48, scans: 21 },
    { name: 'Sat', views: 23, clicks: 38, scans: 25 },
    { name: 'Sun', views: 34, clicks: 43, scans: 21 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your performance across all channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totals.views}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Link Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totals.clicks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">QR Scans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totals.scans}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Engagement Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-white)' }}
                />
                <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Events Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.2)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'var(--tw-colors-white)' }} />
                <Bar dataKey="scans" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 dark:bg-gray-800 dark:border-gray-700 p-6 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-primary-500/10">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold mb-2">
            <TrendingUp className="w-5 h-5" /> Top Performing Link
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{topLink.title}</h4>
          <p className="text-3xl font-black text-primary-500 mt-2">{topLink.clicks} <span className="text-base font-medium text-gray-500">clicks</span></p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full w-fit">
            <TrendingUp className="w-4 h-4" /> {topLink.trend} this week
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" /> Recent Visitors
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentVisitors.map(v => (
              <div key={v.id} className="py-3 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{v.location}</p>
                    <p className="text-xs text-gray-500">{v.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <Clock className="w-3 h-3" /> {v.time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
