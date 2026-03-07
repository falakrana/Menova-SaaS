import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function QRCodePage() {
  const restaurant = useStore((s) => s.restaurant);
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!restaurant) return <div>Loading QR...</div>;

  const menuUrl = `${window.location.origin}/menu/${restaurant.id}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement('a');
      a.download = `${restaurant.name}-qr-code.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      toast({ title: 'QR code downloaded!' });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h2>${restaurant.name}</h2><p>Scan to view our menu</p>${svg.outerHTML}</div></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    toast({ title: 'Link copied!' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold">QR Code</h1>
          <p className="text-muted-foreground text-sm mt-1">Share your digital menu with customers</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center">
            <div ref={qrRef} className="p-6 bg-background rounded-xl border border-border mb-6">
              <QRCodeSVG value={menuUrl} size={220} level="H" fgColor="hsl(222, 47%, 11%)" bgColor="transparent" />
            </div>
            <h3 className="font-display font-semibold mb-1">{restaurant.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">Scan to view menu</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download</Button>
              <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-3">Menu Link</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground truncate font-mono">{menuUrl}</div>
                <Button variant="outline" size="sm" onClick={handleCopy} aria-label="Copy menu link"><Copy className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-2">Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">•</span> Print and place QR codes on each table</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Add to takeaway bags and receipts</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Share the link on social media</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Include in your Google Business listing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
