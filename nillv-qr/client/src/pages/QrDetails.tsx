import { useQrCode } from "@/hooks/use-qr-codes";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, ExternalLink, Smartphone, Globe, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import * as htmlToImage from 'html-to-image';
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function QrDetails() {
  const [, params] = useRoute("/qr/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: qr, isLoading, error } = useQrCode(id);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !qr) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-destructive">Could not load QR code</h2>
        <Link href="/">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  const trackingUrl = `${window.location.origin}/s/${qr.slug}`;

  const downloadQr = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current);
      const link = document.createElement("a");
      link.download = `qr-${qr.slug}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Downloaded", description: "QR Code saved to your device." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to download image.", variant: "destructive" });
    }
  };

  // Prepare chart data (scans per day for last 7 days - simple mock or real agg)
  // For now we map actual scans. If empty, show empty state.
  const chartData = (qr.scans || []).reduce((acc: any[], scan) => {
    if (!scan.scannedAt) return acc;
    const date = format(new Date(scan.scannedAt), "MMM d");
    const existing = acc.find(d => d.date === date);
    if (existing) existing.count++;
    else acc.push({ date, count: 1 });
    return acc;
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link href="/">
        <Button variant="ghost" className="pl-0 gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: QR Preview */}
        <div className="space-y-6">
          <Card className="overflow-hidden bg-white dark:bg-zinc-900 border-primary/20 shadow-xl shadow-primary/5">
            <CardContent className="p-8 flex flex-col items-center gap-6">
              <div ref={qrRef} className="p-4 bg-white rounded-xl">
                <QRCodeSVG value={trackingUrl} size={200} level="H" />
              </div>
              
              <div className="w-full flex gap-2">
                <Button onClick={downloadQr} className="flex-1 gap-2" variant="outline">
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button className="flex-1 gap-2" variant="secondary" onClick={() => window.open(trackingUrl, '_blank')}>
                  <ExternalLink className="w-4 h-4" /> Test Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{qr.createdAt ? format(new Date(qr.createdAt), "PPP") : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Scans</p>
                  <p className="font-medium text-primary text-lg">{qr.scansCount}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Destination</p>
                <a href={qr.destinationUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all text-sm font-medium">
                  {qr.destinationUrl}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                  <p>No scans recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Scans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead className="text-right">Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qr.scans && qr.scans.length > 0 ? (
                    qr.scans.slice(0, 5).map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {scan.scannedAt ? format(new Date(scan.scannedAt), "MMM d, HH:mm") : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-muted-foreground" />
                            {scan.country || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-3 h-3 text-muted-foreground" />
                            {scan.device || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {scan.userAgent ? (scan.userAgent.length > 20 ? scan.userAgent.substring(0, 20) + '...' : scan.userAgent) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No scan data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
