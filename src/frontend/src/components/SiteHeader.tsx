import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from './LoginButton';
import { businessInfo } from '../content/businessInfo';
import { useAdminGuard } from '../hooks/useAdminGuard';

export default function SiteHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, isLoading } = useAdminGuard();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Fleet', path: '/fleet' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  // Show admin link only when authenticated, confirmed admin, and not loading
  const showAdminLink = isAuthenticated && isAdmin && !isLoading;
  // Show profile link when authenticated
  const showProfileLink = isAuthenticated;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/aasra-logo.dim_512x512.png"
              alt="Aasra tour's and travels logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-bold text-foreground">
              Aasra tour's and travels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.label}
              </Link>
            ))}
            {showProfileLink && (
              <Link
                to="/profile"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                Profile
              </Link>
            )}
            {showAdminLink && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop CTA & Contact */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex flex-col text-right text-xs text-muted-foreground">
              <span>Contact: {businessInfo.phone}</span>
              <span>Helpline: {businessInfo.helpline}</span>
              <span>{businessInfo.email}</span>
            </div>
            <Button
              onClick={() => navigate({ to: '/book' })}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Book a Cab
            </Button>
            <LoginButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Menu</span>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                      activeProps={{ className: 'text-foreground' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {showProfileLink && (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                      activeProps={{ className: 'text-foreground' }}
                    >
                      Profile
                    </Link>
                  )}
                  {showAdminLink && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                      activeProps={{ className: 'text-foreground' }}
                    >
                      Admin
                    </Link>
                  )}
                </nav>
                <div className="flex flex-col gap-3 border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    <div>Contact: {businessInfo.phone}</div>
                    <div>Helpline: {businessInfo.helpline}</div>
                    <div>{businessInfo.email}</div>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate({ to: '/book' });
                    }}
                    className="w-full"
                  >
                    Book a Cab
                  </Button>
                  <LoginButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
