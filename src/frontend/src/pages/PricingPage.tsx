import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Check } from 'lucide-react';

export default function PricingPage() {
  const pricingFactors = [
    'Distance traveled',
    'Vehicle type selected',
    'Trip duration',
    'Time of day (peak/off-peak)',
    'Toll charges and parking fees',
    'Waiting time (if applicable)',
  ];

  const examples = [
    {
      title: 'Local City Rides',
      description: 'Within city limits',
      range: '₹10-15 per km',
      note: 'Minimum fare applies',
    },
    {
      title: 'Airport Transfers',
      description: 'To/from major airports',
      range: '₹500-2000',
      note: 'Based on distance',
    },
    {
      title: 'Outstation (One-way)',
      description: 'Inter-city travel',
      range: '₹12-18 per km',
      note: 'Driver allowance extra',
    },
    {
      title: 'Outstation (Round Trip)',
      description: 'Return journey included',
      range: '₹10-16 per km',
      note: 'Better value for money',
    },
    {
      title: 'Hourly Packages',
      description: '4 hours / 40 km',
      range: '₹800-1500',
      note: 'Extra charges apply beyond limit',
    },
    {
      title: 'Full Day Package',
      description: '8 hours / 80 km',
      range: '₹1500-3000',
      note: 'Ideal for city tours',
    },
  ];

  const inclusions = [
    'Base fare',
    'Fuel charges',
    'Driver allowance',
    'GST (as applicable)',
  ];

  const exclusions = [
    'Toll charges',
    'Parking fees',
    'State permit charges',
    'Night charges (11 PM - 6 AM)',
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Transparent and competitive rates for all your travel needs
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The prices shown below are indicative ranges. Final fare will be calculated based on actual distance, 
              vehicle type, and other factors. Contact us for an accurate quote for your specific journey.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Example Fare Ranges</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get an idea of our competitive pricing
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-2xl font-bold text-primary">{example.range}</div>
                  <p className="text-sm text-muted-foreground">{example.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Pricing Factors</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4 text-muted-foreground">
                  Your final fare is calculated based on the following factors:
                </p>
                <ul className="space-y-2">
                  {pricingFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Fare Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">Additional Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Get an Accurate Quote</h2>
          <p className="mb-6 text-lg opacity-90">
            Contact us with your travel details for a personalized fare estimate
          </p>
        </div>
      </section>
    </div>
  );
}
