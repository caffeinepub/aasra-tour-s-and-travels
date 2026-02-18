import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DomainSetupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Globe className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Domain Setup Guide</h1>
          <p className="text-lg text-muted-foreground">
            Connect your custom domain to your Internet Computer application
          </p>
        </div>

        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            This application cannot directly purchase domains. Domain registration and billing must be handled through an external domain registrar of your choice.
          </AlertDescription>
        </Alert>

        {/* Step 1: Purchase Domain */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>
              Purchase a Domain
            </CardTitle>
            <CardDescription>
              Choose and register your custom domain through a domain registrar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Popular Domain Registrars</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Namecheap - Affordable pricing and user-friendly interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>GoDaddy - Large selection and 24/7 support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Google Domains - Simple management and integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Cloudflare - Competitive pricing with built-in security</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-sm">Tips for Choosing a Domain</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Keep it short, memorable, and easy to spell</li>
                <li>• Choose a .com extension when possible for broader recognition</li>
                <li>• Avoid hyphens and numbers that can cause confusion</li>
                <li>• Consider your brand identity and target audience</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Configure DNS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</span>
              Configure DNS Records
            </CardTitle>
            <CardDescription>
              Point your domain to your Internet Computer application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                DNS changes can take 24-48 hours to propagate globally. Be patient after making changes.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="mb-3 font-semibold">Required DNS Configuration</h3>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-sm">CNAME Record</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="col-span-2 font-mono text-xs">CNAME</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Name:</span>
                      <span className="col-span-2 font-mono text-xs">www</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Value:</span>
                      <span className="col-span-2 font-mono text-xs break-all">
                        [your-canister-id].icp0.io
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-sm">A Record (Root Domain)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="col-span-2 font-mono text-xs">A</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Name:</span>
                      <span className="col-span-2 font-mono text-xs">@ (or leave blank)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Value:</span>
                      <span className="col-span-2 font-mono text-xs">
                        [IC boundary node IP]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-sm">How to Add DNS Records</h4>
              <ol className="space-y-1 text-sm text-muted-foreground">
                <li>1. Log in to your domain registrar's control panel</li>
                <li>2. Navigate to DNS settings or DNS management</li>
                <li>3. Add the CNAME and A records as specified above</li>
                <li>4. Save your changes and wait for propagation</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</span>
              Verify Configuration
            </CardTitle>
            <CardDescription>
              Test your domain setup and troubleshoot issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">Verification Steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Wait 24-48 hours for DNS propagation to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Visit your domain in a web browser to test connectivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Use online DNS lookup tools to verify record propagation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Test from multiple devices and networks</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-sm">Useful DNS Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://dnschecker.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    DNS Checker - Check DNS propagation globally
                  </a>
                </li>
                <li>
                  <a
                    href="https://mxtoolbox.com/SuperTool.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    MX Toolbox - Comprehensive DNS lookup tool
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long does DNS propagation take?</AccordionTrigger>
                <AccordionContent>
                  DNS propagation typically takes 24-48 hours to complete globally. However, you may see changes sooner in some locations. During this time, some users may see the old configuration while others see the new one.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I use a subdomain instead of the root domain?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can use a subdomain (e.g., app.yourdomain.com) by creating a CNAME record for that subdomain pointing to your Internet Computer canister. This is often easier than configuring the root domain.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What if my domain isn't working after 48 hours?</AccordionTrigger>
                <AccordionContent>
                  If your domain still isn't working after 48 hours, verify that: (1) DNS records are correctly configured in your registrar's control panel, (2) there are no typos in the canister ID or IP address, (3) your domain registrar's nameservers are properly set, and (4) there are no conflicting DNS records. Use DNS lookup tools to diagnose the issue.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Do I need to configure SSL/HTTPS?</AccordionTrigger>
                <AccordionContent>
                  The Internet Computer automatically provides SSL/HTTPS certificates for custom domains through its boundary nodes. Once your DNS is properly configured and propagated, HTTPS should work automatically without additional configuration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I transfer my existing domain?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can transfer an existing domain from one registrar to another. The process varies by registrar but typically involves unlocking the domain, obtaining an authorization code, and initiating the transfer with your new registrar. DNS configuration can be updated at any time regardless of where the domain is registered.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://internetcomputer.org/docs/current/developer-docs/production/custom-domain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Internet Computer Custom Domain Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://forum.dfinity.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  DFINITY Developer Forum - Get help from the community
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
