import { useState, useEffect } from 'react';

import { Download, Printer, Copy, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';

import { useStore } from '@/store/useStore';

import DashboardLayout from '@/components/layout/DashboardLayout';

import { api } from '@/lib/api';



export default function QRCodePage() {

  const restaurant = useStore((s) => s.restaurant);

  const { toast } = useToast();

  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);



  const fetchQRCode = async (regenerate = false) => {

    if (!restaurant?.id) return;

    setLoading(true);

    try {

      const data = regenerate 
        ? await api.regenerateQRCode(restaurant.id)
        : await api.getQRCode(restaurant.id);

      setQrUrl(data.qr_code_url);

    } catch (err) {

      toast({ title: 'Failed to fetch QR code', variant: 'destructive' });

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    if (restaurant?.id) {

      fetchQRCode();

    }

  }, [restaurant?.id]);



  if (!restaurant) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;



  const menuUrl = `${window.location.origin}/menu/${restaurant.id}`;



  const handleDownload = async () => {

    if (!qrUrl) return;

    try {

      const response = await fetch(qrUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = `${restaurant.name}-qr-code.png`;

      a.click();

      window.URL.revokeObjectURL(url);

      toast({ title: 'QR code downloaded!' });

    } catch (err) {

      toast({ title: 'Download failed', variant: 'destructive' });

    }

  };



  const handlePrint = () => {

    if (!qrUrl) return;

    const printWindow = window.open('', '_blank');

    if (!printWindow) return;

    printWindow.document.write(`

      <html>

        <body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0">

          <div style="text-align:center">

            <h2>${restaurant.name}</h2>

            <p>Scan to view our menu</p>

            <img src="${qrUrl}" style="width: 300px; height: 300px;" />

          </div>

        </body>

      </html>

    `);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.print();

    }, 500);

  };



  const handleCopy = () => {

    navigator.clipboard.writeText(menuUrl);

    toast({ title: 'Link copied!' });

  };



  return (

    <DashboardLayout>

      <div className="space-y-10 animate-fade-in">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">QR Code</h1>

            <p className="text-muted-foreground text-base mt-2">Share your digital menu with customers</p>

          </div>

          <Button variant="outline" onClick={() => fetchQRCode(true)} disabled={loading}>

            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />

            Regenerate

          </Button>

        </div>



        <div className="grid lg:grid-cols-2 gap-6">

          <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center min-h-[400px]">

            {loading ? (

              <Loader2 className="w-12 h-12 text-primary animate-spin" />

            ) : qrUrl ? (

              <>

                <div className="p-6 bg-background rounded-xl border border-border mb-6">

                  <img src={qrUrl} alt="QR Code" className="w-[220px] h-[220px]" />

                </div>

                <h3 className="font-display font-semibold mb-1">{restaurant.name}</h3>

                <p className="text-sm text-muted-foreground mb-6">Scan to view menu</p>

                <div className="flex flex-wrap gap-3 justify-center">

                  <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download</Button>

                  <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>

                </div>

              </>

            ) : (

              <div className="text-center py-10">

                <p className="text-muted-foreground mb-4">No QR code generated yet.</p>

                <Button onClick={() => fetchQRCode()}>Generate QR Code</Button>

              </div>

            )}

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

                <li className="flex gap-2"><span className="text-primary">•</span> Your QR code is stored securely on Cloudflare for fast loading.</li>

                <li className="flex gap-2"><span className="text-primary">•</span> Print and place QR codes on each table</li>

                <li className="flex gap-2"><span className="text-primary">•</span> Add to takeaway bags and receipts</li>

                <li className="flex gap-2"><span className="text-primary">•</span> Share the link on social media</li>

              </ul>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}



