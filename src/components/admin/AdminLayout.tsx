import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  MessageSquare,
  MessageCircle,
  LogOut,
  Home,
  LayoutDashboard,
  Images,
  ImagePlus,
  Replace,
  Settings,
  Gift,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Chat Inquiries", href: "/admin/chat-inquiries", icon: MessageCircle },
  { label: "Pop-up Responses", href: "/admin/popup-responses", icon: Gift },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Site Images", href: "/admin/site-images", icon: ImagePlus },
  { label: "Image Assets", href: "/admin/image-assets", icon: Replace },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-serif italic text-xl text-primary">Dashboard</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <div className="px-4 py-2">
            <p className="text-xs text-foreground/40 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-foreground/60 hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="w-full px-6 py-8 lg:px-10 lg:py-10">
          {/* Keep a readable max-width, but align to the left (not centered) */}
          <div className="w-full max-w-6xl mr-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
