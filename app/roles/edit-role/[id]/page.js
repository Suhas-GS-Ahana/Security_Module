'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function EditRole() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id;
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [roleName, setRoleName] = useState('');
  const [pagesList, setPagesList] = useState([]);
  const [selectedPages, setSelectedPages] = useState({});

  const permissionsOptions = [
    { value: 1, label: 'Add, Edit, View' },
    { value: 2, label: 'Add, View' },
    { value: 3, label: 'Edit, View' },
    { value: 4, label: 'View Only' },
  ];

  useEffect(() => {
    // We load the main lookup dictionary of pages first
    loadPagesDictAndData();
  }, [roleId]);

  const loadPagesDictAndData = async () => {
    try {
      setIsPageLoading(true);
      
      // 1. Fetch available pages for checking
      let pagesArr = [];
      const resPages = await api.get('/get-pages');
      if (resPages && resPages.status === 'success' && Array.isArray(resPages.data)) {
        pagesArr = resPages.data;
        setPagesList(pagesArr);
      }

      // 2. Hydrate the specific Role
      if (roleId) {
        const resRole = await api.get(`/get-role/${roleId}`);
        if (resRole && resRole.status === 'success' && Array.isArray(resRole.data)) {
          const rows = resRole.data;
          
          if (rows.length > 0) {
            setRoleName(rows[0].role_name || '');
          }
          
          // Map the detailed mappings into the local state dictionary: { pageId: permVal }
          const hydratedPerms = {};
          rows.forEach(row => {
            if (row.page_name) {
              // Backend returns page_name, so we lookup the master_id from pagesArr
              const matchedPage = pagesArr.find(p => p.page_name === row.page_name);
              if (matchedPage) {
                const pid = matchedPage.page_master_id;
                
                let permVal = 4; // default
                // Permissions returned like "1- Add,Edit,View"
                if (typeof row.page_permission === 'string') {
                   const match = row.page_permission.match(/^(\d+)/);
                   if (match) permVal = parseInt(match[1], 10);
                } else if (typeof row.page_permission === 'number') {
                   permVal = row.page_permission;
                }
                
                hydratedPerms[pid] = permVal;
              }
            }
          });
          setSelectedPages(hydratedPerms);
        } else {
           alert('Failed to load role payload. It might not exist.');
        }
      }
      
    } catch (err) {
      console.error(err);
      alert('Error fetching role configuration.');
    } finally {
      setIsPageLoading(false);
    }
  };

  const handlePageSelectOption = (pageId, permValue) => {
    setSelectedPages(prev => {
      const nextState = { ...prev };
      if (!permValue) {
        delete nextState[pageId];
      } else {
        nextState[pageId] = parseInt(permValue, 10);
      }
      return nextState;
    });
  };

  const togglePageSelection = (pageId, isChecked) => {
    setSelectedPages(prev => {
      const nextState = { ...prev };
      if (isChecked) {
        nextState[pageId] = 4; // default view only
      } else {
        delete nextState[pageId];
      }
      return nextState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the payload mapping accurately 
    const details = Object.keys(selectedPages).map(pageIdStr => ({
      p_role_details_id: 0,
      p_inserted_by: 0,
      p_modified_by: 0,
      p_page_master_id: parseInt(pageIdStr, 10),
      p_role_master_id: parseInt(roleId, 10), 
      p_page_permission: String(selectedPages[pageIdStr]),
      p_is_active: true,
      p_is_deleted: false,
      p_is_debug: 0
    }));

    const payload = {
      master: {
        p_role_master_id: parseInt(roleId, 10),
        p_role_name: roleName,
        p_is_user_defined: "N",
        p_inserted_by: 0,
        p_modified_by: 0,
        p_is_deleted: false,
        p_is_active: true,
        p_is_debug: 0
      },
      details: details
    };

    try {
      const resp = await api.post('/upsert-role', payload);
      if (resp && resp.status === 'success') {
        router.push('/roles');
        router.refresh();
      } else {
        alert('Failed to update role. Please check your inputs or backend logs.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Role</h1>
          <p className="text-muted-foreground mt-2 font-medium">Modify this role definition and mapped permissions.</p>
        </div>
        <Link href="/roles">
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 bg-card shadow-sm hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
        </Link>
      </div>

      <Card 
        title="Role Details & Permissions" 
        description="Update the role name and manipulate active application permissions."
        icon={ShieldCheck}
        headerVariant="gradient"
      >
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <div className="max-w-md space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role Name</label>
            <Input 
              value={roleName} 
              onChange={(e) => setRoleName(e.target.value)} 
              placeholder="e.g. Finance Admin" 
              required 
              disabled={isPageLoading}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight border-b border-slate-200 pb-2">Assign Page Permissions</h3>
            
            {isPageLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600 font-medium">Loading valid pages & role matrix...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {pagesList.map((page) => {
                  const isChecked = selectedPages[page.page_master_id] !== undefined;
                  const currentPermission = isChecked ? selectedPages[page.page_master_id] : '';

                  return (
                    <div 
                      key={page.page_master_id} 
                      className={`p-4 rounded-xl border transition-all ${isChecked ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-500/10' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-colors cursor-pointer"
                          checked={isChecked}
                          onChange={(e) => togglePageSelection(page.page_master_id, e.target.checked)}
                        />
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-bold text-slate-800 break-words cursor-pointer" onClick={() => togglePageSelection(page.page_master_id, !isChecked)}>
                            {page.page_name}
                          </label>
                          <select
                            disabled={!isChecked}
                            value={currentPermission}
                            onChange={(e) => handlePageSelectOption(page.page_master_id, e.target.value)}
                            className={`w-full h-9 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isChecked ? 'bg-white border-blue-200 text-slate-900 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'}`}
                          >
                            <option value="" disabled>Select permission...</option>
                            {permissionsOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
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

          <div className="flex justify-end pt-6 mt-6 border-t border-border">
            <Button 
              type="submit" 
              disabled={isSubmitting || isPageLoading || !roleName}
              className="gap-2 shadow-sm"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}
