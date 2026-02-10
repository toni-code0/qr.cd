import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { QrCode, LogOut, Settings, ShieldCheck } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: QrCode },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col fixed md:sticky top-0 h-16 md:h-screen z-30">
        <div className="p-6 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">QR Master</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto hidden md:block">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={location === item.href ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 transition-all duration-200 ${
                  location === item.href 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className={`w-4 h-4 ${location === item.href ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t bg-muted/10 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
              {user?.firstName?.substring(0, 2) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user?.firstName || "User"}</span>
              <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{user?.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()} className="hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Mobile Header / Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <div className="flex-1 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
