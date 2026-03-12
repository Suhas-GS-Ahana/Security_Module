'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Package, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function EditModule() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    module_name: '',
    description: '',
    edition: '',
    feature: ''
  });

  useEffect(() => {
    if (moduleId) {
      loadModuleData(moduleId);
    }
  }, [moduleId]);

  const loadModuleData = async (id) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/get-module/${id}`);
      // Based on API signature: res.data.module holds the module info
      if (res && res.status === 'success' && res.data && res.data.module) {
        const data = res.data.module;
        setFormData({
          module_name: data.module_name || '',
          description: data.description || '',
          edition: data.edition || '',
          feature: data.feature || ''
        });
      } else {
        alert('Failed to load module data. It might not exist.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching module details.');
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
    
    // Construct the payload as per API requirements
    const payload = {
      module_id: parseInt(moduleId, 10), // Send the actual module ID to update it
      module_name: formData.module_name,
      description: formData.description,
      edition: formData.edition,
      feature: formData.feature,
      inserted_by: 0,
      modified_by: 0,
      is_deleted: false,
      is_active: true,
      is_debug: 0
    };

    try {
      const resp = await api.post('/upsert-module', payload);
      // Wait for the backend POST to complete successfully
      if (resp && resp.status === 'success') {
        router.push('/modules');
        router.refresh();
      } else {
        alert('Failed to update module. Please check your inputs or backend logs.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the module updates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Module</h1>
          <p className="text-muted-foreground mt-2 font-medium">Update the properties of this module.</p>
        </div>
        <Link href="/modules">
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 bg-card shadow-sm hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </Button>
        </Link>
      </div>

      <Card 
        title="Module Configuration" 
        description="Modify the details of the selected module."
        icon={Package}
        headerVariant="gradient"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600 font-medium">Loading Module Data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Module Name</label>
                <Input 
                  name="module_name" 
                  value={formData.module_name} 
                  onChange={handleChange} 
                  placeholder="e.g. Finance Hub" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <Input 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="e.g. Base financial tracking module" 
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Feature</label>
                <Input 
                  name="feature" 
                  value={formData.feature} 
                  onChange={handleChange} 
                  placeholder="e.g. Core" 
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
                {isSubmitting ? 'Updating...' : 'Update Module'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  );
}
