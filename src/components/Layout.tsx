
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "About", path: "/about" },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b py-4 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-primary w-8 h-8 flex items-center justify-center">
              <div className="text-primary-foreground font-bold">E</div>
            </div>
            <h1 className="text-xl font-bold">EnviroWatch Now</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
      
      <footer className="border-t py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>EnviroWatch Now - Real-time Environmental Monitoring Dashboard</p>
          <p className="mt-1">Created for demonstration purposes. Data is simulated.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
