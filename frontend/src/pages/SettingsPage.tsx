import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { restaurant, updateRestaurant } = useStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const syncedOnceRef = useRef(false);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        location: restaurant.location || ''
      });
    }
  }, [restaurant]);

  // Prefill from Clerk and auto-sync to backend on first load
  useEffect(() => {
    if (!clerkLoaded || !user || !restaurant || syncedOnceRef.current) return;

    const clerkEmail = user.primaryEmailAddress?.emailAddress || '';
    const clerkName = user.fullName || user.firstName || user.username || '';

    // Only prefill if restaurant fields are empty and Clerk has data
    const needsSync = 
      (!restaurant.email && clerkEmail) || 
      (!restaurant.name && clerkName);

    if (needsSync) {
      const merged = {
        name: restaurant.name || clerkName || 'My Restaurant',
        email: restaurant.email || clerkEmail,
        phone: restaurant.phone || '',
        location: restaurant.location || ''
      };

      setForm(merged);

      // Auto-save to backend once
      syncedOnceRef.current = true;
      updateRestaurant(merged).catch(() => {
        // Silent fail on auto-sync; user can manually save
      });
    }
  }, [clerkLoaded, user, restaurant, updateRestaurant]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateRestaurant(form);
      toast({ title: 'Settings saved!' });
    } catch (err) {
      toast({ title: 'Update failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return <DashboardLayout><div className="p-8">Loading settings...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in max-w-2xl">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-base mt-2">Manage your restaurant details</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h3 className="font-display font-semibold text-lg">Restaurant Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Restaurant Name</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="mt-1.5" 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="mt-1.5" 
              />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                className="mt-1.5" 
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                className="mt-1.5" 
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
