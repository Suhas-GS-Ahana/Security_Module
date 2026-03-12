'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FileText, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function AddPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [modulesList, setModulesList] = useState([]);
  
  const [formData, setFormData] = useState({
    page_name: '',
    page_link: '',
    page_path: '',
    module_id: '',
    feature: '',
    edition: ''
  });

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setIsLoadingModules(true);
      const res = await api.get('/get-modules');
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        setModulesList(res.data);
      } else {
        console.warn('Failed to load modules list properly. Using fallback empty list.');
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the payload as per API requirements
    const payload = {
      page_master_id: 0,
      page_link: formData.page_link,
      page_name: formData.page_name,
      page_path: formData.page_path,
      module_id: parseInt(formData.module_id, 10) || 0,
      feature: formData.feature,
      edition: formData.edition,
      inserted_by: 0,
      modified_by: 0,
      is_deleted: false,
      is_active: true,
      is_debug: 0
    };

    try {
      const resp = await api.post('/upsert-page', payload);
      // Wait for the backend POST to complete successfully
      if (resp && resp.status === 'success') {
        router.push('/pages');
        router.refresh();
      } else {
        alert('Failed to register page. Please check your inputs or backend logs.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Register New Page</h1>
          <p className="text-muted-foreground mt-2 font-medium">Add a new route to the application navigation system.</p>
        </div>
        <Link href="/pages">
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 bg-card shadow-sm hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Button>
        </Link>
      </div>

      <Card 
        title="Page Configuration" 
        description="Enter the routing and module details below."
        icon={FileText}
        headerVariant="gradient"
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Page Name</label>
              <Input 
                name="page_name" 
                value={formData.page_name} 
                onChange={handleChange} 
                placeholder="e.g. Dashboard" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Page Link</label>
              <Input 
                name="page_link" 
                type="url"
                value={formData.page_link} 
                onChange={handleChange} 
                placeholder="e.g. http://example.com/dashboard" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Page Path</label>
              <Input 
                name="page_path" 
                value={formData.page_path} 
                onChange={handleChange} 
                placeholder="e.g. /dashboard" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Module
                {isLoadingModules && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
              </label>
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors shadow-sm disabled:bg-slate-50 disabled:text-slate-500"
                disabled={isLoadingModules}
                required
              >
                <option value="" disabled>Select a module...</option>
                {modulesList.map((mod) => {
                  const id = mod.module_id || mod.id;
                  const name = mod.module_name || mod.name || `Module #${id}`;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Feature</label>
              <Input 
                name="feature" 
                value={formData.feature} 
                onChange={handleChange} 
                placeholder="e.g. Core" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Edition</label>
              <Input 
                name="edition" 
                value={formData.edition} 
                onChange={handleChange} 
                placeholder="e.g. Enterprise" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-border">
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoadingModules}
              className="gap-2 shadow-sm"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Page'}
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}
