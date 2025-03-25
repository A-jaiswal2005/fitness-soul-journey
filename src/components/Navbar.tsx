
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname.includes('/dashboard');
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleNavLinkClick = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (isHome) {
        return;
      } else {
        navigate('/' + path);
      }
    } else {
      navigate(path);
    }
  };

  const navLinks = isDashboard 
    ? [
        { name: 'Home', path: '/dashboard' },
        { name: 'Exercise', path: '/dashboard/exercise' },
        { name: 'Diet', path: '/dashboard/diet' },
        { name: 'Compete', path: '/dashboard/compete' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'About', path: '#about' },
      ];

  const isActiveLink = (path: string) => {
    if (path.startsWith('#')) {
      return isHome && location.hash === path;
    } else if (path === '/dashboard') {
      return location.pathname === path;
    } else if (path.includes('/dashboard/')) {
      return location.pathname.includes(path);
    }
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || !isHome || isDashboard
          ? 'bg-background/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-fitness-400 to-fitness-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">FS</span>
              </span>
              <span className="text-xl font-bold text-gradient">Fitness Soul</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavLinkClick(link.path)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActiveLink(link.path) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button className="flex items-center w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-sm font-medium"
              >
                Sign In
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>

          <div className="flex md:hidden items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobile && isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md animate-slide-in">
          <div className="px-4 pt-2 pb-4 space-y-1 border-t">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavLinkClick(link.path)}
                className="block w-full text-left py-3 text-base font-medium text-foreground hover:text-primary"
              >
                {link.name}
              </button>
            ))}
            
            {user ? (
              <>
                <Button 
                  variant="ghost"
                  className="w-full justify-start text-left py-3 text-base font-medium text-foreground hover:text-primary"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full justify-start text-left py-3 text-base font-medium text-foreground hover:text-primary"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                asChild 
                className="w-full mt-3 bg-primary hover:bg-primary/90"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
