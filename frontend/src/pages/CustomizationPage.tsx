import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomizationTabs from '@/components/CustomizationTabs';
import BrandingCard from '@/components/BrandingCard';
import PaletteCard from '@/components/PaletteCard';
import TypographyCard from '@/components/TypographyCard';
import LayoutCard from '@/components/LayoutCard';
import LivePreview from '@/components/LivePreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Loader2, Check, RefreshCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';

import TemplateCard from '@/components/TemplateCard';

export default function CustomizationPage() {
  const { toast } = useToast();
  const restaurant = useStore(state => state.restaurant);
  const updateRestaurant = useStore(state => state.updateRestaurant);

  // States initialized from store
  const [selectedTemplate, setSelectedTemplate] = useState(restaurant?.templateId || 'standard');
  const [selectedColor, setSelectedColor] = useState(restaurant?.themeColor || '#0f172a');
  const [accentColor, setAccentColor] = useState(restaurant?.accentColor || '#f97316');
  const [headingFont, setHeadingFont] = useState(restaurant?.fontStyle?.split(',')[0] || 'Inter');
  const [bodyFont, setBodyFont] = useState(restaurant?.bodyFont || 'Roboto');
  
  // New typography states
  const [tagline, setTagline] = useState(restaurant?.tagline || '');
  const [menuTextSize, setMenuTextSize] = useState(restaurant?.menuTextSize || 'md');
  const [currency, setCurrency] = useState(restaurant?.currency || 'INR');
  const [priceFormat, setPriceFormat] = useState(restaurant?.priceFormat || 'PREFIX_SPACE');
  const [menuAlignment, setMenuAlignment] = useState(restaurant?.menuAlignment || 'left');
  const [showDescriptions, setShowDescriptions] = useState(restaurant?.showDescriptions ?? true);

  const [selectedLayout, setSelectedLayout] = useState(restaurant?.layout || 'classic');
  const [activeTab, setActiveTab] = useState('Templates');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // File states for uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>((restaurant as any)?.logoUrl);

  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
    triggerAutoSave();
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoUrl(undefined);
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  // Synchronize state when restaurant data loads/changes
  React.useEffect(() => {
    if (restaurant) {
      setSelectedTemplate(restaurant.templateId || 'standard');
      setSelectedColor(restaurant.themeColor || '#0f172a');
      setAccentColor(restaurant.accentColor || '#f97316');
      setHeadingFont(restaurant.fontStyle?.split(',')[0] || 'Inter');
      setBodyFont(restaurant.bodyFont || 'Roboto');
      setTagline(restaurant.tagline || '');
      setMenuTextSize(restaurant.menuTextSize || 'md');
      setCurrency(restaurant.currency || 'INR');
      setPriceFormat(restaurant.priceFormat || 'PREFIX_SPACE');
      setMenuAlignment(restaurant.menuAlignment || 'left');
      setShowDescriptions(restaurant.showDescriptions ?? true);
      setSelectedLayout(restaurant.layout || 'classic');
      setLogoUrl(restaurant.logoUrl);
    }
  }, [restaurant]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', selectedColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [selectedColor, accentColor]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalLogoUrl = logoUrl;

      if (logoFile) {
        const res = await api.uploadImage(logoFile, 'customization');
        finalLogoUrl = res.url || finalLogoUrl;
      }

      await updateRestaurant({
        ...restaurant,
        templateId: selectedTemplate,
        themeColor: selectedColor,
        fontStyle: `${headingFont}, sans-serif`,
        bodyFont,
        accentColor,
        logoUrl: finalLogoUrl,
        tagline,
        menuTextSize,
        currency,
        priceFormat,
        menuAlignment,
        showDescriptions,
        layout: selectedLayout
      });

      toast({
        title: "Settings Saved",
        description: "Your brand customization settings have been successfully updated.",
      });
    } catch (e: any) {
      toast({
        title: "Failed to Save",
        description: e.response?.data?.detail || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedTemplate('standard');
    setSelectedColor('#0f172a');
    setAccentColor('#f97316');
    setHeadingFont('Inter');
    setBodyFont('Roboto');
    setSelectedLayout('classic');
    setLogoFile(null);
    setLogoUrl(undefined);
    setTagline('');
    setMenuTextSize('md');
    setCurrency('INR');
    setPriceFormat('PREFIX_SPACE');
    setMenuAlignment('left');
    setShowDescriptions(true);
    setSaveStatus('idle');
  };

  const restaurantName = restaurant?.name || "The Golden Fork";

  const headerActions = (
    <div className="flex items-center gap-3">
      {saveStatus !== 'idle' && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
          saveStatus === 'saving' ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {saveStatus === 'saving' ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
              Saving...
            </>
          ) : (
            <>
              <Check size={14} />
              Saved ✓
            </>
          )}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-2"
        onClick={handleReset}
      >
        <RefreshCcw size={16} />
        Reset
      </Button>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        size="sm"
        className="gradient-primary text-primary-foreground font-semibold shadow-md min-w-[120px]"
      >
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
      </Button>
    </div>
  );

  return (
    <DashboardLayout headerActions={headerActions}>
      <div className="space-y-10 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Customization</h1>
          <p className="text-muted-foreground text-base mt-2">Design your menu's visual identity</p>
        </div>

        <div>
          {/* TABS */}
          <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_480px] gap-12 mt-8">
            {/* LEFT PANEL - Settings Form */}
            <div className="space-y-8">

              {activeTab === 'Templates' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <TemplateCard 
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={(t) => {
                      setSelectedTemplate(t);
                      triggerAutoSave();
                    }}
                    primaryColor={selectedColor}
                  />
                </div>
              )}

              {activeTab === 'Visuals' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <BrandingCard
                    logoUrl={logoUrl}
                    onLogoUpload={handleLogoUpload}
                    onRemoveLogo={handleRemoveLogo}
                  />
                  <PaletteCard
                    selectedColor={selectedColor}
                    onSelectColor={(c) => {
                      setSelectedColor(c);
                      triggerAutoSave();
                    }}
                    accentColor={accentColor}
                    onSelectAccentColor={(c) => {
                      setAccentColor(c);
                      triggerAutoSave();
                    }}
                  />
                </div>
              )}

              {activeTab === 'Typography' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <TypographyCard 
                    headingFont={headingFont} 
                    onHeadingFontChange={setHeadingFont} 
                    bodyFont={bodyFont} 
                    onBodyFontChange={setBodyFont} 
                    tagline={tagline}
                    onTaglineChange={setTagline}
                    menuTextSize={menuTextSize}
                    onMenuTextSizeChange={setMenuTextSize}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    priceFormat={priceFormat}
                    onPriceFormatChange={setPriceFormat}
                    menuAlignment={menuAlignment}
                    onMenuAlignmentChange={setMenuAlignment}
                    showDescriptions={showDescriptions}
                    onShowDescriptionsChange={setShowDescriptions}
                  />
                </div>
              )}

              {activeTab === 'Layout' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <LayoutCard 
                    selectedLayout={selectedLayout} 
                    onLayoutChange={setSelectedLayout} 
                    primaryColor={selectedColor}
                  />
                </div>
              )}
              
            </div>

            {/* RIGHT PANEL - Preview */}
            <div className="relative">
              <div className="sticky top-4">
                <LivePreview 
                  restaurantName={restaurantName} 
                  primaryColor={selectedColor} 
                  accentColor={accentColor}
                  logoUrl={logoUrl}
                  headingFont={headingFont}
                  bodyFont={bodyFont}
                  templateId={selectedTemplate}
                  layout={selectedLayout}
                  tagline={tagline}
                  menuTextSize={menuTextSize}
                  currency={currency}
                  priceFormat={priceFormat}
                  menuAlignment={menuAlignment}
                  showDescriptions={showDescriptions}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
