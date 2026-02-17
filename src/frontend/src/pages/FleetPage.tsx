import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Luggage, Zap } from 'lucide-react';

export default function FleetPage() {
  const vehicles = [
    {
      name: 'Sedan',
      description: 'Perfect for individuals and small families',
      capacity: '4 passengers',
      luggage: '2-3 bags',
      features: ['AC', 'Comfortable seating', 'Music system', 'GPS navigation'],
      ideal: 'Airport transfers, City rides, Business trips',
    },
    {
      name: 'SUV',
      description: 'Spacious and comfortable for longer journeys',
      capacity: '6-7 passengers',
      luggage: '4-5 bags',
      features: ['Premium AC', 'Extra legroom', 'Entertainment system', 'USB charging'],
      ideal: 'Family trips, Outstation travel, Group outings',
    },
    {
      name: 'Luxury Sedan',
      description: 'Premium experience for special occasions',
      capacity: '4 passengers',
      luggage: '2-3 bags',
      features: ['Luxury interiors', 'Premium sound', 'Leather seats', 'Professional chauffeur'],
      ideal: 'Corporate events, VIP transfers, Special occasions',
    },
    {
      name: 'Mini Van',
      description: 'Ideal for large groups and families',
      capacity: '8-10 passengers',
      luggage: '6-8 bags',
      features: ['Spacious cabin', 'Multiple AC vents', 'Ample storage', 'Comfortable seating'],
      ideal: 'Group travel, Family vacations, Event transportation',
    },
    {
      name: 'Tempo Traveller',
      description: 'Best for large group tours and events',
      capacity: '12-17 passengers',
      luggage: '10+ bags',
      features: ['Push-back seats', 'Music system', 'First aid kit', 'Experienced driver'],
      ideal: 'Corporate outings, Wedding parties, Tour groups',
    },
    {
      name: 'Hatchback',
      description: 'Economical choice for short trips',
      capacity: '4 passengers',
      luggage: '1-2 bags',
      features: ['Fuel efficient', 'Easy parking', 'AC', 'Clean & maintained'],
      ideal: 'Quick errands, Short distances, Budget travel',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Our Fleet</h1>
            <p className="text-lg text-muted-foreground">
              Well-maintained vehicles to suit every need and budget
            </p>
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
                  <CardDescription className="text-base">{vehicle.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {vehicle.capacity}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Luggage className="h-3 w-3" />
                      {vehicle.luggage}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Features:</h4>
                    <ul className="space-y-1">
                      {vehicle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Ideal For:</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.ideal}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold">All Vehicles Include</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-background p-4">
                <p className="font-semibold">Regular Maintenance</p>
                <p className="text-sm text-muted-foreground">Serviced & inspected</p>
              </div>
              <div className="rounded-lg bg-background p-4">
                <p className="font-semibold">Verified Drivers</p>
                <p className="text-sm text-muted-foreground">Licensed & trained</p>
              </div>
              <div className="rounded-lg bg-background p-4">
                <p className="font-semibold">Insurance Coverage</p>
                <p className="text-sm text-muted-foreground">Fully insured rides</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
