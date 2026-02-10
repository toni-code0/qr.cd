import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { QrCode, Shield, Zap, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const login = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b bg-background/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl">QR Master</span>
          </div>
          <Button onClick={login} variant="secondary">Login</Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden pt-16 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary))_0%,transparent_30%)] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
            >
              Smart QR Codes <br/> for <span className="text-primary">Modern Brands</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Generate, track, and manage your QR codes with detailed analytics and enterprise-grade reliability.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button size="lg" onClick={login} className="text-lg px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                Get Started for Free
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <Feature 
                icon={Zap} 
                title="Instant Generation" 
                desc="Create high-resolution QR codes in milliseconds. Customizable and ready for print." 
              />
              <Feature 
                icon={BarChart} 
                title="Real-time Analytics" 
                desc="Track every scan. Know where, when, and what device your users are scanning from." 
              />
              <Feature 
                icon={Shield} 
                title="Secure & Reliable" 
                desc="Enterprise-grade security ensures your links are safe and always online." 
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 text-center text-muted-foreground text-sm">
        © 2024 QR Master. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-background border shadow-lg shadow-black/5 hover:shadow-xl transition-all">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
