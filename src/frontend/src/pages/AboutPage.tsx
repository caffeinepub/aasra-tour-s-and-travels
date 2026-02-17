import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Heart, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your comfort and satisfaction are our top priorities',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality service',
    },
    {
      icon: Heart,
      title: 'Care',
      description: 'We treat every passenger like family',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Continuously improving to serve you better',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              About Aasra tour's and travels
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner for comfortable, safe, and reliable transportation services
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed">
            <p>
              Welcome to <strong>Aasra tour's and travels</strong>, where your journey matters as much as your destination. 
              Founded with a vision to revolutionize cab services, we've been serving travelers with dedication and care.
            </p>
            <p>
              Our name "Aasra" means support and shelter, reflecting our commitment to being your reliable companion 
              on every journey. Whether you're heading to the airport, planning an outstation trip, or need local 
              transportation, we're here to make your travel experience smooth and comfortable.
            </p>
            <p>
              With a fleet of well-maintained vehicles and a team of professional, courteous drivers, we ensure 
              that every ride with us is safe, comfortable, and memorable. We understand that travel is not just 
              about reaching a destination—it's about the experience along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              To provide safe, reliable, and comfortable transportation services that exceed customer expectations. 
              We strive to make every journey a pleasant experience through professional service, modern vehicles, 
              and a commitment to punctuality and safety.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
