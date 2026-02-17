import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqPage() {
  const faqs = [
    {
      question: 'How do I book a cab with Aasra Tours?',
      answer: 'You can book a cab through our website by filling out the booking form on the "Book a Cab" page. Provide your pickup location, destination, date, time, and vehicle preference. You will receive a confirmation reference number once your booking is submitted.',
    },
    {
      question: 'What types of vehicles do you offer?',
      answer: 'We offer a wide range of vehicles including Hatchbacks, Sedans, SUVs, Luxury Sedans, Mini Vans, and Tempo Travellers. Each vehicle type is suited for different needs - from solo travelers to large groups. Visit our Fleet page for detailed information.',
    },
    {
      question: 'Are your drivers verified and trained?',
      answer: 'Yes, all our drivers are thoroughly verified, licensed, and trained. They undergo background checks and regular training sessions to ensure professional service and safe driving practices.',
    },
    {
      question: 'How is the fare calculated?',
      answer: 'Fares are calculated based on distance traveled, vehicle type, trip duration, and time of day. Additional charges may apply for tolls, parking, and night travel (11 PM - 6 AM). We provide transparent pricing with no hidden charges.',
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes, you can cancel or modify your booking by contacting us. Cancellation policies vary based on the notice period. Please contact our customer service team for assistance with changes to your booking.',
    },
    {
      question: 'Do you provide service 24/7?',
      answer: 'Yes, we operate 24 hours a day, 7 days a week. Whether you need an early morning airport transfer or a late-night pickup, we are available to serve you at any time.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve major cities across India and provide both local and outstation services. Our coverage includes airport transfers, inter-city travel, and local city rides. Contact us to confirm service availability in your area.',
    },
    {
      question: 'Are tolls and parking charges included in the fare?',
      answer: 'No, toll charges and parking fees are additional and will be charged as per actual expenses incurred during the trip. These are not included in the base fare.',
    },
    {
      question: 'Can I book a cab for multiple days?',
      answer: 'Yes, we offer multi-day packages for outstation trips and extended travel needs. These packages are customizable based on your itinerary and requirements. Contact us for a personalized quote.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including cash, UPI, credit/debit cards, and digital wallets. For corporate bookings, we also offer invoice billing options.',
    },
    {
      question: 'Do you provide child seats?',
      answer: 'Yes, child seats can be arranged upon request at the time of booking. Please mention this requirement in the comments section of the booking form or contact us directly.',
    },
    {
      question: 'What if my flight is delayed?',
      answer: 'For airport pickups, we track flight timings and adjust pickup times accordingly. There is no extra charge for reasonable delays. Our drivers will wait for you at the designated pickup point.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Still Have Questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Our customer service team is here to help you
          </p>
          <p className="text-lg font-semibold">
            Call us at +91 98765 43210 or email info@aasratours.com
          </p>
        </div>
      </section>
    </div>
  );
}
