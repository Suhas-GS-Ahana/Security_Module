'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { UserPlus, ArrowLeft, Save, Loader2, User, Phone, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';

const now = new Date().toISOString();

const PERMISSION_OPTIONS = [
  { value: 1, label: 'Add, Edit, View' },
  { value: 2, label: 'Add, View' },
  { value: 3, label: 'Edit, View' },
  { value: 4, label: 'View Only' },
];

export default function AddUser() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lookup data
  const [rolesList, setRolesList] = useState([]);
  const [pagesList, setPagesList] = useState([]);

  // Section 1: Basic Info
  const [master, setMaster] = useState({
    p_user_name: '',
    p_first_name: '',
    p_last_name: '',
    p_email: '',
    p_password: '',
  });

  // Section 2: Contact Details
  const [details, setDetails] = useState({
    p_contact_number: '',
    p_user_recovery_contact_number: '',
    p_address: '',
    p_user_recovery_email: '',
  });

  // Section 3: Single role
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Section 3b: Optional user-level permissions
  const [enableUserPermissions, setEnableUserPermissions] = useState(false);
  // { [page_master_id]: permissionNumber }
  const [selectedPages, setSelectedPages] = useState({});

  useEffect(() => {
    loadLookups();
  }, []);

  const loadLookups = async () => {
    try {
      setIsLoading(true);
      const [rolesRes, pagesRes] = await Promise.all([
        api.get('/get-roles'),
        api.get('/get-pages'),
      ]);
      if (rolesRes?.status === 'success' && Array.isArray(rolesRes.data)) setRolesList(rolesRes.data);
      if (pagesRes?.status === 'success' && Array.isArray(pagesRes.data)) setPagesList(pagesRes.data);
    } catch (err) {
      console.error('Error fetching lookups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMasterChange = (e) => {
    const { name, value } = e.target;
    setMaster(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const togglePage = (pageId, isChecked) => {
    setSelectedPages(prev => {
      const next = { ...prev };
      if (isChecked) next[pageId] = 4; // default: View Only
      else delete next[pageId];
      return next;
    });
  };

  const setPagePermission = (pageId, permValue) => {
    setSelectedPages(prev => ({ ...prev, [pageId]: parseInt(permValue, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build permissions array
    const permissions = [];

    // Role permission entry (p_is_user_level_permission: false)
    if (selectedRoleId) {
      permissions.push({
        p_user_permission_id: 0,
        p_inserted_by: 0,
        p_modified_by: 0,
        p_page_master_id: 0,
        p_user_master_id: 0,
        p_role_master_id: parseInt(selectedRoleId, 10),
        p_is_user_level_permission: false,
        p_page_permission: '',
        p_is_active: true,
        p_is_deleted: false,
      });
    }

    // User-level page permissions (p_is_user_level_permission: true)
    if (enableUserPermissions) {
      Object.entries(selectedPages).forEach(([pageId, perm]) => {
        permissions.push({
          p_user_permission_id: 0,
          p_inserted_by: 0,
          p_modified_by: 0,
          p_page_master_id: parseInt(pageId, 10),
          p_user_master_id: 0,
          p_role_master_id: 0,
          p_is_user_level_permission: true,
          p_page_permission: String(perm),
          p_is_active: true,
          p_is_deleted: false,
        });
      });
    }

    const payload = {
      master: {
        p_user_master_id: 0,
        p_user_name: master.p_user_name,
        p_first_name: master.p_first_name,
        p_last_name: master.p_last_name,
        p_email: master.p_email,
        p_password: master.p_password,
        p_inserted_by: 0,
        p_modified_by: 0,
        p_is_active: true,
        p_is_deleted: false,
        p_single_sign_on: false,
        p_is_locked: false,
        p_login_attempt_count: 0,
        p_last_login: now,
        p_is_user_defined: true,
      },
      details: {
        p_user_details_id: 0,
        p_inserted_by: 0,
        p_modified_by: 0,
        p_contact_number: details.p_contact_number,
        p_address: details.p_address,
        p_user_recovery_email: details.p_user_recovery_email,
        p_user_recovery_contact_number: details.p_user_recovery_contact_number,
        p_user_master_id: 0,
        p_is_active: true,
        p_is_deleted: false,
      },
      permissions,
    };

    try {
      const resp = await api.post('/upsert-user', payload);
      if (resp?.status === 'success') {
        router.push('/users');
        router.refresh();
      } else {
        alert('Failed to create user. Please check your inputs or backend logs.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New User</h1>
          <p className="text-muted-foreground mt-2 font-medium">Create a new user account and assign a role.</p>
        </div>
        <Link href="/users">
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 bg-card shadow-sm hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1 — Basic Info */}
        <Card title="Basic Information" description="Core account credentials and identity." icon={User} headerVariant="gradient">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <Input name="p_first_name" value={master.p_first_name} onChange={handleMasterChange} placeholder="e.g. John" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Last Name</label>
              <Input name="p_last_name" value={master.p_last_name} onChange={handleMasterChange} placeholder="e.g. Smith" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <Input name="p_user_name" value={master.p_user_name} onChange={handleMasterChange} placeholder="e.g. jsmith" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <Input name="p_email" type="email" value={master.p_email} onChange={handleMasterChange} placeholder="e.g. john@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Input name="p_password" type="password" value={master.p_password} onChange={handleMasterChange} placeholder="••••••••" required />
            </div>
          </div>
        </Card>

        {/* Section 2 — Contact Details */}
        <Card title="Contact Details" description="Optional contact and recovery information." icon={Phone} headerVariant="gradient">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Contact Number</label>
              <Input name="p_contact_number" value={details.p_contact_number} onChange={handleDetailsChange} placeholder="e.g. 9876543210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Recovery Contact Number</label>
              <Input name="p_user_recovery_contact_number" value={details.p_user_recovery_contact_number} onChange={handleDetailsChange} placeholder="e.g. 9876543210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Recovery Email</label>
              <Input name="p_user_recovery_email" type="email" value={details.p_user_recovery_email} onChange={handleDetailsChange} placeholder="e.g. recovery@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <Input name="p_address" value={details.p_address} onChange={handleDetailsChange} placeholder="e.g. #18 Birmingham UK" />
            </div>
          </div>
        </Card>

        {/* Section 3 — Role & Permissions */}
        <Card title="Role & Permissions" description="Assign a role and optionally define user-level page permissions." icon={ShieldCheck} headerVariant="gradient">
          <div className="pt-4 space-y-6">

            {/* Single role dropdown */}
            <div className="space-y-2 max-w-sm">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Assign Role
                {isLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
              </label>
              <select
                value={selectedRoleId}
                onChange={e => setSelectedRoleId(e.target.value)}
                disabled={isLoading}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">No role assigned</option>
                {rolesList.map(role => (
                  <option key={role.role_master_id} value={role.role_master_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* User-level permissions toggle */}
            <div className="border-t border-slate-100 pt-5">
              <div
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  enableUserPermissions
                    ? 'border-indigo-400 bg-indigo-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
                onClick={() => {
                  setEnableUserPermissions(v => !v);
                  if (enableUserPermissions) setSelectedPages({});
                }}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">Enable User-Level Permissions</p>
                  <p className="text-xs text-slate-500 mt-0.5">Override role permissions with custom page-level access for this user.</p>
                </div>
                {/* Toggle switch */}
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${enableUserPermissions ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${enableUserPermissions ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>

              {/* Page-permission grid — shown only when toggled on */}
              {enableUserPermissions && (
                <div className="mt-4">
                  {isLoading ? (
                    <div className="flex items-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="ml-3 text-slate-600 text-sm">Loading pages...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pagesList.map(page => {
                        const isChecked = selectedPages[page.page_master_id] !== undefined;
                        const currentPerm = isChecked ? selectedPages[page.page_master_id] : '';
                        return (
                          <div
                            key={page.page_master_id}
                            className={`p-4 rounded-xl border transition-all ${
                              isChecked
                                ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-500/10'
                                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                checked={isChecked}
                                onChange={e => togglePage(page.page_master_id, e.target.checked)}
                              />
                              <div className="flex-1 space-y-2">
                                <label
                                  className="text-sm font-bold text-slate-800 break-words cursor-pointer"
                                  onClick={() => togglePage(page.page_master_id, !isChecked)}
                                >
                                  {page.page_name}
                                </label>
                                <select
                                  disabled={!isChecked}
                                  value={currentPerm}
                                  onChange={e => setPagePermission(page.page_master_id, e.target.value)}
                                  className={`w-full h-9 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                                    isChecked
                                      ? 'bg-white border-blue-200 text-slate-900 shadow-sm'
                                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  <option value="" disabled>Select permission...</option>
                                  {PERMISSION_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting || isLoading} className="gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Creating User...' : 'Create User'}
          </Button>
        </div>

      </form>
    </AdminLayout>
  );
}
