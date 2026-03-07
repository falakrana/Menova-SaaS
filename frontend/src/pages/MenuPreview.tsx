import DashboardLayout from '@/components/layout/DashboardLayout';
import PublicMenu from './PublicMenu';

export default function MenuPreview() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold">Menu Preview</h1>
          <p className="text-muted-foreground text-sm mt-1">See how customers view your menu</p>
        </div>

        <div className="max-w-md mx-auto border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-foreground/5 px-3 py-2 flex items-center gap-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="flex-1 text-center text-xs text-muted-foreground">Menu Preview</div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <PublicMenu />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
