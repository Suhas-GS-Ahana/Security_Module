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

export default function AddUser() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [rolesList, setRolesList] = useState([]);

  // Section 1: Basic Info (master)
  const [master, setMaster] = useState({
    p_user_name: '',
    p_first_name: '',
    p_last_name: '',
    p_email: '',
    p_password: '',
  });

  // Section 2: Contact Details (details)
  const [details, setDetails] = useState({
    p_contact_number: '',
    p_user_recovery_contact_number: '',
    p_address: '',
    p_user_recovery_email: '',
  });

  // Section 3: Roles — a user can have multiple roles
  const [selectedRoleIds, setSelectedRoleIds] = useState(new Set());

  const toggleRole = (roleId, isChecked) => {
    setSelectedRoleIds(prev => {
      const next = new Set(prev);
      if (isChecked) next.add(roleId);
      else next.delete(roleId);
      return next;
    });
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const res = await api.get('/get-roles');
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        setRolesList(res.data);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoadingRoles(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        p_single_sign_on: true,
        p_is_locked: false,
        p_login_attempt_count: 0,
        p_last_login: now,
        p_is_user_defined: false,
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
      permissions: Array.from(selectedRoleIds).map(roleId => ({
        p_user_permission_id: 0,
        p_inserted_by: 0,
        p_modified_by: 0,
        p_page_master_id: 0,
        p_user_master_id: 0,
        p_role_master_id: parseInt(roleId, 10),
        p_is_user_level_permission: true,
        p_page_permission: '',
        p_is_active: true,
        p_is_deleted: false,
      })),
    };

    try {
      const resp = await api.post('/upsert-user', payload);
      if (resp && resp.status === 'success') {
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

        {/* Section 3 — Role Assignment */}
        <Card title="Role & Permissions" description="Assign one or more system roles to this user." icon={ShieldCheck} headerVariant="gradient">
          <div className="pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Assign Roles
              {isLoadingRoles && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
            </h3>
            {isLoadingRoles ? (
              <div className="flex items-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600 text-sm">Loading roles...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rolesList.map((role) => {
                  const isChecked = selectedRoleIds.has(role.role_master_id);
                  return (
                    <div
                      key={role.role_master_id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-500/10'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                      }`}
                      onClick={() => toggleRole(role.role_master_id, !isChecked)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                          checked={isChecked}
                          onChange={(e) => toggleRole(role.role_master_id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm font-bold text-slate-800">{role.role_name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting || isLoadingRoles} className="gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Creating User...' : 'Create User'}
          </Button>
        </div>

      </form>
    </AdminLayout>
  );
}
