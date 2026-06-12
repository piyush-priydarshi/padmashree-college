'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  applications: number;
  unreadMessages: number;
  subscribers: number;
  news: number;
  totalAlbums: number;
  totalPhotos: number;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetch('/api/stats/admin'),
          fetch('/api/applications')
        ]);
        const statsData = await statsRes.json();
        const appsData = await appsRes.json();

        if (!statsData.error) setStats(statsData);
        if (!appsData.error) setApplications(appsData.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Welcome to Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Summary and recent operations log for Padmashree College.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">Applications</span>
            <span className="text-xl">🎓</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.applications || 0}</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">Unread Msgs</span>
            <span className="text-xl">✉️</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.unreadMessages || 0}</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">Subscribers</span>
            <span className="text-xl">📢</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.subscribers || 0}</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">News Posts</span>
            <span className="text-xl">📰</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.news || 0}</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">Albums</span>
            <span className="text-xl">📁</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.totalAlbums || 0}</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border border-gray-200" hoverable={false}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Photos</span>
            <span className="text-xl">🖼️</span>
          </div>
          <span className="text-2xl font-bold text-navy">{stats?.totalPhotos || 0}</span>
        </Card>
      </div>

      {/* Quick Action Links */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/admin/news/new" className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm">
          ✍️ Add News Notice
        </Link>
        <Link href="/admin/gallery" className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm">
          🖼️ Create Album
        </Link>
        <Link href="/admin/applications" className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm">
          👀 View Applications
        </Link>
      </div>

      {/* Recent Applications Table */}
      <Card className="p-6 overflow-hidden flex flex-col bg-white border border-gray-200" hoverable={false}>
        <h3 className="text-base font-bold text-navy mb-4">Recent Admission Applications</h3>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                <th className="py-3 font-semibold">Student Name</th>
                <th className="py-3 font-semibold">Email</th>
                <th className="py-3 font-semibold">Program</th>
                <th className="py-3 font-semibold text-center">Status</th>
                <th className="py-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3.5 font-semibold text-navy">{app.fullName}</td>
                    <td className="py-3.5 text-gray-600">{app.email}</td>
                    <td className="py-3.5 font-medium">{app.program}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No applications received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
