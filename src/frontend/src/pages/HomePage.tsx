import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Shield, Star } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock service for all your travel needs',
    },
    {
      icon: Shield,
      title: 'Safe & Reliable',
      description: 'Verified drivers and well-maintained vehicles',
    },
    {
      icon: MapPin,
      title: 'Wide Coverage',
      description: 'Serving major cities and routes across India',
    },
    {
      icon: Star,
      title: 'Best Rates',
      description: 'Competitive pricing with no hidden charges',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Journey,
                <br />
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience comfortable and reliable cab services with Aasra tour's and travels. 
                Book your ride today and travel with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/book' })}
                  className="text-lg"
                >
                  Book a Cab Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/services' })}
                >
                  Our Services
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/aasra-hero.dim_1600x900.png"
                alt="Aasra Tours & Travels - Professional cab service"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Aasra Tours?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're committed to providing the best travel experience
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Book your cab in just a few clicks and enjoy a comfortable ride
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate({ to: '/book' })}
            className="text-lg"
          >
            Book Your Ride
          </Button>
        </div>
      </section>
    </div>
  );
}
