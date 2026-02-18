import { Link } from '@tanstack/react-router';
import { businessInfo } from '../content/businessInfo';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/aasra-logo.dim_512x512.png"
                alt="Aasra tour's and travels logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-bold">
                Aasra tour's and travels
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for comfortable and reliable cab services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/fleet"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Book a Cab
                </Link>
              </li>
              <li>
                <Link
                  to="/domain-setup"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Domain Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Contact: {businessInfo.phone}</li>
              <li>Helpline: {businessInfo.helpline}</li>
              <li>{businessInfo.email}</li>
              <li>{businessInfo.serviceArea}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Aasra tour's and travels. All rights reserved.
          </p>
          <p className="mt-2">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
