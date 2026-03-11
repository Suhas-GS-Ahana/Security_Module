'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FileText, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    page_name: '',
    page_link: '',
    page_path: '',
    module_id: '',
    feature: '',
    edition: ''
  });

  useEffect(() => {
    if (pageId) {
      loadPageData(pageId);
    }
  }, [pageId]);

  const loadPageData = async (id) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/get-page/${id}`);
      if (res && res.status === 'success' && res.data) {
        const data = res.data;
        setFormData({
          page_name: data.page_name || '',
          page_link: data.page_link || '',
          page_path: data.page_path || '',
          module_id: data.module_id !== null ? String(data.module_id) : '',
          feature: data.feature || '',
          edition: data.edition || ''
        });
      } else {
        alert('Failed to load page data. It might not exist.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching page details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the payload as per API requirements for up-serting existing record
    const payload = {
      page_master_id: parseInt(pageId, 10),
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
        alert('Failed to update page. Please check your inputs or backend logs.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the page updates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Page</h1>
          <p className="text-muted-foreground mt-2 font-medium">Update the routing and configuration of this page.</p>
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
        description="Modify the routing details below."
        icon={FileText}
        headerVariant="gradient"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600 font-medium">Loading Page Data...</span>
          </div>
        ) : (
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
                <label className="text-sm font-semibold text-slate-700">Module ID</label>
                <Input 
                  name="module_id" 
                  type="number"
                  value={formData.module_id} 
                  onChange={handleChange} 
                  placeholder="e.g. 10" 
                />
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
                disabled={isSubmitting}
                className="gap-2 shadow-sm"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Updating...' : 'Update Page'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  );
}
