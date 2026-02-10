import { useQrCodes } from "@/hooks/use-qr-codes";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContinuePage() {
  const [, params] = useRoute("/continue/:slug");
  const slug = params?.slug;
  const { data: qrCodes, isLoading } = useQrCodes();
  const [countdown, setCountdown] = useState(5);
  
  const qr = qrCodes?.find(q => q.slug === slug);

  useEffect(() => {
    if (!qr) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = qr.destinationUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qr]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!qr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border-white/20 text-white p-8 text-center rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Link Not Found</h2>
          <p className="opacity-80 mb-6">This link might have expired or is incorrect.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 p-4 font-display">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <Card className="max-w-lg w-full bg-white/15 backdrop-blur-xl border-white/25 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t border-l border-white/40 overflow-hidden relative group">
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-yellow-400 rounded-3xl shadow-[0_8px_0_rgb(202,138,4)] flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-500">
            <Shield className="w-12 h-12 text-yellow-900 drop-shadow-sm" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] tracking-tight">
            Redirecting...
          </h1>
          
          <div className="bg-blue-900/40 p-6 rounded-2xl border border-white/10 mb-10 w-full">
            <p className="text-blue-50 text-lg font-medium mb-2 leading-relaxed">
              You will be redirected in <span className="text-yellow-300 font-black">{countdown}</span> seconds to:
            </p>
            <p className="text-yellow-300 text-xl font-black uppercase tracking-wider drop-shadow-sm break-all">
              {qr.destinationUrl}
            </p>
          </div>

          <a 
            href={qr.destinationUrl}
            className="w-full bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-yellow-950 font-black text-2xl py-6 rounded-2xl shadow-[0_10px_0_rgb(202,138,4)] hover:shadow-[0_6px_0_rgb(202,138,4)] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-[0_2px_0_rgb(202,138,4)] transition-all duration-150 flex items-center justify-center gap-3 uppercase tracking-widest border-2 border-yellow-200/50"
          >
            Continue Now
            <ExternalLink className="w-6 h-6 stroke-[3px]" />
          </a>
          
          <div className="mt-10 flex gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
