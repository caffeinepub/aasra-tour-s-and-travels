import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import PricingPage from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import BookCabPage from './pages/BookCabPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import ProfilePage from './pages/ProfilePage';
import TrackingPage from './pages/TrackingPage';
import DriverLocationUpdatePage from './pages/DriverLocationUpdatePage';
import DomainSetupPage from './pages/DomainSetupPage';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const fleetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fleet',
  component: FleetPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const bookCabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book',
  component: BookCabPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminBookingsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/track/$bookingId',
  component: TrackingPage,
});

const driverLocationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver/track/$bookingId',
  component: DriverLocationUpdatePage,
});

const domainSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/domain-setup',
  component: DomainSetupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  fleetRoute,
  pricingRoute,
  testimonialsRoute,
  faqRoute,
  contactRoute,
  bookCabRoute,
  adminRoute,
  profileRoute,
  trackingRoute,
  driverLocationRoute,
  domainSetupRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
