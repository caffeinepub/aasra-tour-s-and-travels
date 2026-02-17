import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Mumbai',
      rating: 5,
      text: 'Excellent service! The driver was punctual, professional, and the car was spotlessly clean. Used their airport transfer service and it was hassle-free. Highly recommended!',
      date: 'January 2026',
    },
    {
      name: 'Priya Sharma',
      location: 'Delhi',
      rating: 5,
      text: 'Booked an outstation trip to Jaipur. The journey was comfortable, and the driver was very courteous. Fair pricing with no hidden charges. Will definitely use again!',
      date: 'December 2025',
    },
    {
      name: 'Amit Patel',
      location: 'Bangalore',
      rating: 5,
      text: 'I use Aasra Tours for my daily office commute. Their monthly package is very economical and the service is consistent. Never had any issues in 6 months!',
      date: 'February 2026',
    },
    {
      name: 'Sneha Reddy',
      location: 'Hyderabad',
      rating: 5,
      text: 'Hired their SUV for a family trip. Spacious, comfortable, and the driver knew all the best routes. Made our vacation stress-free. Thank you, Aasra Tours!',
      date: 'January 2026',
    },
    {
      name: 'Vikram Singh',
      location: 'Pune',
      rating: 5,
      text: 'Professional service for our corporate event. They provided multiple vehicles and all drivers were on time. Great coordination and communication throughout.',
      date: 'November 2025',
    },
    {
      name: 'Anita Desai',
      location: 'Chennai',
      rating: 5,
      text: 'Used their service for my wedding. The luxury sedan was beautifully decorated and the chauffeur was very professional. Made our special day even more memorable!',
      date: 'December 2025',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              What Our Customers Say
            </h1>
            <p className="text-lg text-muted-foreground">
              Real experiences from real travelers who chose Aasra Tours
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Quote className="h-8 w-8 text-primary/20" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="mb-4 text-muted-foreground">{testimonial.text}</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Experience the Difference</h2>
          <p className="text-lg opacity-90">
            Join thousands of satisfied customers who trust Aasra Tours for their travel needs
          </p>
        </div>
      </section>
    </div>
  );
}
