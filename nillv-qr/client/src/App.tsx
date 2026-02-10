import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import QrDetails from "@/pages/QrDetails";
import Continue from "@/pages/Continue";
import StaticPage from "@/pages/StaticPage";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/continue/:slug" component={Continue} />
      <Route path="/about">
        <StaticPage 
          title="About QR Master" 
          content="QR Master is a modern tool for creating and tracking QR codes. We focus on security and transparency for our users."
        />
      </Route>
      <Route path="/privacy">
        <StaticPage 
          title="Privacy Policy" 
          content="We do not collect personal data from visitors who scan our QR codes. Your privacy and security are our top priorities."
        />
      </Route>
      <Route path="/contact">
        <StaticPage 
          title="Contact Us" 
          content="Have questions? Reach out to us at support@qrmaster.app"
        />
      </Route>
      {!user ? (
        <Switch>
          <Route path="/" component={Landing} />
          <Route><Landing /></Route>
        </Switch>
      ) : (
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/qr/:id" component={QrDetails} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
