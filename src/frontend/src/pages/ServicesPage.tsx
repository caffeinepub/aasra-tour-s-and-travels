import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Building2, Calendar, Users, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Plane,
      title: 'Airport Transfers',
      description: 'Reliable pickup and drop services to all major airports. Never miss a flight with our punctual service.',
      features: ['Flight tracking', 'Meet & greet service', 'Luggage assistance', '24/7 availability'],
    },
    {
      icon: MapPin,
      title: 'Outstation Trips',
      description: 'Comfortable long-distance travel to your favorite destinations with experienced drivers.',
      features: ['One-way & round trips', 'Flexible packages', 'Multiple stops allowed', 'Transparent pricing'],
    },
    {
      icon: Building2,
      title: 'Local City Rides',
      description: 'Quick and convenient transportation within the city for all your daily needs.',
      features: ['Hourly packages', 'Point-to-point service', 'Multiple destinations', 'Affordable rates'],
    },
    {
      icon: Calendar,
      title: 'Corporate Services',
      description: 'Professional transportation solutions for businesses and corporate events.',
      features: ['Monthly packages', 'Dedicated vehicles', 'Priority booking', 'Invoice billing'],
    },
    {
      icon: Users,
      title: 'Group Travel',
      description: 'Spacious vehicles for family trips, group outings, and special occasions.',
      features: ['Large capacity vehicles', 'Customized itineraries', 'Tour packages', 'Group discounts'],
    },
    {
      icon: Briefcase,
      title: 'Special Events',
      description: 'Premium cab services for weddings, parties, and other special occasions.',
      features: ['Luxury vehicles', 'Decorated cars available', 'Professional chauffeurs', 'Flexible timing'],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive cab services tailored to meet all your transportation needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Need a Custom Service?</h2>
          <p className="mb-6 text-lg opacity-90">
            Contact us to discuss your specific requirements and get a personalized quote
          </p>
        </div>
      </section>
    </div>
  );
}
