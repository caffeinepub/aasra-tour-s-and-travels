import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Headset } from 'lucide-react';
import { businessInfo } from '../content/businessInfo';

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Get in touch with us for bookings, inquiries, or support
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{businessInfo.phone}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Call us for bookings and inquiries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                  <Headset className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Helpline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{businessInfo.helpline}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  24/7 support for immediate assistance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{businessInfo.email}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us your queries and we'll respond promptly
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Service Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{businessInfo.serviceArea}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Wide coverage across multiple cities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{businessInfo.businessHours}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Round-the-clock service for your needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">How Can We Help You?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">For Bookings</h3>
                  <p className="text-muted-foreground">
                    Use our online booking form or call us directly. We'll confirm your booking 
                    and provide you with a reference number.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">For Inquiries</h3>
                  <p className="text-muted-foreground">
                    Have questions about our services, pricing, or availability? Reach out via 
                    phone or email and our team will assist you.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">For Support</h3>
                  <p className="text-muted-foreground">
                    Need help with an existing booking or have feedback? Contact us and we'll 
                    resolve your concerns promptly.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">For Corporate Partnerships</h3>
                  <p className="text-muted-foreground">
                    Interested in corporate packages or bulk bookings? Email us with your 
                    requirements for a customized solution.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Book Your Ride?</h2>
          <p className="text-lg opacity-90">
            Contact us now or use our online booking form to get started
          </p>
        </div>
      </section>
    </div>
  );
}
