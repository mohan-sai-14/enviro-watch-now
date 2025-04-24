
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Info } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-gradient-to-br from-env-water to-env-air w-10 h-10 flex items-center justify-center">
              <div className="text-primary-foreground font-bold">E</div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-env-water to-env-air bg-clip-text text-transparent">EnviroWatch Now</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2 px-3 rounded-md",
                  location.pathname === item.path
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground bg-white/50 dark:bg-slate-800/50 py-1 px-3 rounded-full border">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="border-t py-8 mt-12 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">EnviroWatch Now</h3>
            <p className="text-sm text-muted-foreground">
              Real-time Environmental Monitoring Dashboard for air and water quality analysis.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Documentation</a></li>
              <li><a href="#" className="hover:text-primary">API Reference</a></li>
              <li><a href="#" className="hover:text-primary">Sensor Network</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <p className="text-sm text-muted-foreground">
              Created for demonstration purposes.<br/>
              All data is simulated and does not represent actual environmental conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
