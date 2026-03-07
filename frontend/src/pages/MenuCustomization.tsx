import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PublicMenu from './PublicMenu';
import { Loader2 } from 'lucide-react';

const fonts = ['Inter', 'Plus Jakarta Sans', 'Georgia', 'Courier New', 'Roboto', 'Poppins', 'Montserrat'];
const colors = [
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

export default function MenuCustomization() {
  const { restaurant, categories, menuItems, updateRestaurant } = useStore();
  const { toast } = useToast();
  
  const [draft, setDraft] = useState(restaurant || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setDraft(restaurant);
    }
  }, [restaurant]);

  if (!restaurant) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRestaurant({
        name: draft.name,
        themeColor: draft.themeColor,
        fontStyle: draft.fontStyle
      });
      toast({
        title: 'Customization saved!',
        description: 'Your menu has been updated with the new settings.'
      });
    } catch (error) {
      toast({
        title: 'Error saving customization',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight">Brand Customization</h1>
          <p className="text-muted-foreground text-sm mt-1">Personalize how your menu looks to your customers</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings panel */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 transition-all hover:shadow-md">
              <h3 className="font-display font-semibold text-lg border-b pb-2">Brand Settings</h3>
              
              <div className="space-y-3">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input 
                  id="restaurantName"
                  value={draft.name || ''} 
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })} 
                  className="transition-shadow focus-visible:ring-primary" 
                />
              </div>

              <div className="space-y-3">
                <Label>Theme Color</Label>
                <div className="grid grid-cols-3 gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setDraft({ ...draft, themeColor: c.value })}
                      className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                        draft.themeColor === c.value 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border hover:border-border/80 hover:bg-muted'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: c.value }} />
                      <span className="text-sm font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Font Style</Label>
                <Select value={draft.fontStyle || 'Inter'} onValueChange={(v) => setDraft({ ...draft, fontStyle: v })}>
                  <SelectTrigger className="w-full transition-shadow focus:ring-primary">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50 cursor-pointer">
                  <span className="text-sm">Click to upload logo (Coming Soon)</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full h-12 text-base font-semibold shadow-sm transition-all hover:shadow-md"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>

          {/* Live preview */}
          <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-card flex flex-col h-[750px]">
            <div className="bg-muted/50 px-4 py-3 flex items-center gap-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-warning/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-success/80 shadow-sm" />
              </div>
              <div className="flex-1 text-center text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Customer Live Preview
              </div>
            </div>
            <div className="flex-1 overflow-y-auto relative bg-background">
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />
              <PublicMenu previewData={{ restaurant: draft, categories, menuItems }} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
