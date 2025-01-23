import React from "react";
import { Button } from "@/components/ui/button";
import {
  Activity,
  History,
  HelpCircle,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface NavItem {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { icon: Activity, label: "Analysis", isActive: true },
  { icon: History, label: "History" },
  { icon: HelpCircle, label: "Help" },
];

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-health text-transparent bg-clip-text">
              HealthAnalyzer
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.isActive ? "default" : "ghost"}
                className={`gap-2 transition-all duration-300 ${item.isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${item.isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
