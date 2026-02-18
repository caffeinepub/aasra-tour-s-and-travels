import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { businessInfo } from '../content/businessInfo';
import { buildWhatsAppEnquiryUrl, getWhatsAppDisplayNumber } from '../utils/whatsapp';
import { useNavigate } from '@tanstack/react-router';

export default function ContactPage() {
  const navigate = useNavigate();
  const whatsappURL = buildWhatsAppEnquiryUrl();
  const displayWhatsApp = getWhatsAppDisplayNumber();

  const contactCards = [
    {
      icon: Phone,
      title: 'Contact Phone',
      content: businessInfo.phone,
      description: 'Call us for immediate assistance',
      href: `tel:${businessInfo.phone}`,
    },
    {
      icon: Phone,
      title: 'Helpline',
      content: businessInfo.helpline,
      description: '24/7 customer support',
      href: `tel:${businessInfo.helpline}`,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: displayWhatsApp,
      description: 'Quick enquiries via WhatsApp',
      href: whatsappURL,
      external: true,
    },
    {
      icon: Mail,
      title: 'Email',
      content: businessInfo.email,
      description: 'Send us your queries',
      href: `mailto:${businessInfo.email}`,
    },
    {
      icon: MapPin,
      title: 'Service Area',
      content: businessInfo.serviceArea,
      description: 'We operate in these regions',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: businessInfo.businessHours,
      description: 'Available for bookings',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 dark:from-amber-950/20 dark:to-orange-950/20 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:mb-4 sm:text-4xl lg:text-5xl">Contact Us</h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Get in touch with us for bookings, inquiries, or support
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {contactCards.map((card, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5">
                      <card.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{card.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.external ? '_blank' : undefined}
                      rel={card.external ? 'noopener noreferrer' : undefined}
                      className="break-words text-base font-semibold text-primary hover:underline sm:text-lg"
                    >
                      {card.content}
                    </a>
                  ) : (
                    <p className="break-words text-base font-semibold sm:text-lg">{card.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Need to Book a Cab?</h2>
            <p className="mb-6 text-base text-muted-foreground sm:mb-8 sm:text-lg">
              Our booking process is quick and easy. Fill out the form and we'll get back to you shortly.
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/book' })} className="text-base sm:text-lg">
              Book a Cab Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
