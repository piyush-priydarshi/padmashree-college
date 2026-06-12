'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [updating, setUpdating] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?status=${statusFilter}`);
      const data = await res.json();
      if (!data.error) {
        setApps(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMsg('Status updated successfully!');
        setToastType('success');
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        loadApplications();
      } else {
        setToastMsg(data.error || 'Failed to update status.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const exportToCSV = () => {
    if (apps.length === 0) return;
    
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Program', 'Message', 'Status', 'Created At'];
    const rows = apps.map(app => [
      app.id,
      app.fullName,
      app.email,
      app.phone,
      app.program,
      app.message || '',
      app.status,
      new Date(app.createdAt).toISOString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Admission Applications</h1>
          <p className="text-xs text-gray-500 mt-1">Review student applications, change status, and export CSV logs.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={apps.length === 0}
          className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          📥 Export to CSV
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer capitalize ${
              statusFilter === filter
                ? 'bg-navy border-navy text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-0 overflow-hidden" hoverable={false}>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                  <th className="p-4 font-semibold">Full Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Program</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.length > 0 ? (
                  apps.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="p-4 font-semibold text-navy">{app.fullName}</td>
                      <td className="p-4 text-gray-600">{app.email}</td>
                      <td className="p-4 text-gray-600">{app.phone}</td>
                      <td className="p-4 font-medium">{app.program}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-navy hover:text-gold font-bold cursor-pointer">
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
      >
        {selectedApp && (
          <div className="flex flex-col gap-5 text-left text-xs text-gray-700">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="font-semibold text-gray-400 block mb-0.5">STUDENT NAME</span>
                <span className="font-bold text-navy text-sm">{selectedApp.fullName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block mb-0.5">TARGET PROGRAM</span>
                <span className="font-bold text-navy text-sm">{selectedApp.program}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="font-semibold text-gray-400 block mb-0.5">EMAIL</span>
                <span className="font-medium text-navy">{selectedApp.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 block mb-0.5">PHONE</span>
                <span className="font-medium text-navy">{selectedApp.phone}</span>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <span className="font-semibold text-gray-400 block mb-1">APPLICANT MESSAGE</span>
              <p className="bg-gray-50 border border-gray-100 rounded-lg p-3 leading-relaxed max-h-36 overflow-y-auto italic">
                {selectedApp.message || 'No additional details provided.'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-navy block">Update Admission Status</label>
              <select
                disabled={updating}
                value={selectedApp.status}
                onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs focus:border-gold cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
