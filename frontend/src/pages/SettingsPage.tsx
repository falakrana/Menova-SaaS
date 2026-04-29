import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BrandingCard from '@/components/BrandingCard';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { restaurant, updateRestaurant } = useStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>((restaurant as any)?.logoUrl);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null | undefined>((restaurant as any)?.coverImage);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        location: restaurant.location || ''
      });
      setLogoUrl(restaurant.logoUrl);
      setCoverImageUrl((restaurant as any).coverImage);
    }
  }, [restaurant]);

  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoUrl(null);
  };

  const handleCoverUpload = (file: File) => {
    setCoverFile(file);
    setCoverImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverImageUrl(null);
  };

  const restaurantName = form.name.trim();
  const canSave = restaurantName.length > 0 && !loading;

  const handleSave = async () => {
    if (!restaurantName) {
      toast({ title: 'Restaurant name is required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      let finalLogoUrl = logoUrl;
      let finalCoverImageUrl = coverImageUrl;

      if (logoFile) {
        const res = await api.uploadImage(logoFile, 'customization');
        finalLogoUrl = res.url || finalLogoUrl;
      }

      if (coverFile) {
        const res = await api.uploadImage(coverFile, 'customization');
        finalCoverImageUrl = res.url || finalCoverImageUrl;
      }

      await updateRestaurant({
        ...form,
        name: restaurantName,
        logoUrl: finalLogoUrl,
        coverImage: finalCoverImageUrl
      });
      toast({ title: 'Profile saved!' });
    } catch (err) {
      toast({ title: 'Update failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return <DashboardLayout><div className="p-8">Loading profile...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in max-w-2xl">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-base mt-2">Complete your profile to continue using Menova</p>
        </div>

        <BrandingCard
          logoUrl={logoUrl}
          onLogoUpload={handleLogoUpload}
          onRemoveLogo={handleRemoveLogo}
          coverImageUrl={coverImageUrl}
          onCoverUpload={handleCoverUpload}
          onRemoveCover={handleRemoveCover}
        />

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h3 className="font-display font-semibold text-lg">Restaurant Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Restaurant Name *</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="mt-1.5" 
                required
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
          <Button onClick={handleSave} disabled={!canSave}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

