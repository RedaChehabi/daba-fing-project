import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, X, HelpCircle, ArrowRight, Fingerprint } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Choose the Right <span className="gradient-text">Plan</span> for You
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Flexible pricing options designed to meet your fingerprint analysis needs, from individual researchers to
            large organizations.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center">
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2">
              <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly Billing
                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 text-[10px]">Save 20%</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Pricing Cards */}
            <TabsContent value="monthly" className="mt-4">
              <div className="grid gap-8 md:grid-cols-3 stagger-animation">
                {/* Free Plan */}
                <Card className="hover-card-effect relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>For individuals getting started</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $0
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>10 fingerprint analyses per month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Basic classification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Web application access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Advanced ridge counting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">API access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="hover-card-effect relative overflow-hidden border-primary">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For professionals and researchers</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $29
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>100 fingerprint analyses per month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced classification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Web and desktop application access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced ridge counting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Basic API access (1,000 calls/month)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2 button-hover-effect">
                      Subscribe Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="hover-card-effect relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For organizations and institutions</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $99
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Unlimited fingerprint analyses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Premium classification with highest accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>All platform access (web, desktop, mobile)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced ridge counting with annotations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Full API access (unlimited calls)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>24/7 priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      Contact Sales
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="mt-4">
              <div className="grid gap-8 md:grid-cols-3 stagger-animation">
                {/* Free Plan - Yearly */}
                <Card className="hover-card-effect relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>For individuals getting started</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $0
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/year</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>10 fingerprint analyses per month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Basic classification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Web application access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Advanced ridge counting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">API access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Pro Plan - Yearly */}
                <Card className="hover-card-effect relative overflow-hidden border-primary">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For professionals and researchers</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $279
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Save $69 compared to monthly billing</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>100 fingerprint analyses per month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced classification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Web and desktop application access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced ridge counting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Basic API access (1,000 calls/month)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2 button-hover-effect">
                      Subscribe Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan - Yearly */}
                <Card className="hover-card-effect relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For organizations and institutions</CardDescription>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      $949
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Save $239 compared to monthly billing</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Unlimited fingerprint analyses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Premium classification with highest accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>All platform access (web, desktop, mobile)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Advanced ridge counting with annotations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>Full API access (unlimited calls)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>24/7 priority support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      Contact Sales
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature Comparison */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Compare Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Detailed comparison of features available in each plan to help you make the right choice.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-center">Free</th>
                  <th className="py-4 px-6 text-center">Pro</th>
                  <th className="py-4 px-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Monthly Analyses</td>
                  <td className="py-4 px-6 text-center">10</td>
                  <td className="py-4 px-6 text-center">100</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Classification Accuracy</td>
                  <td className="py-4 px-6 text-center">90%</td>
                  <td className="py-4 px-6 text-center">93%</td>
                  <td className="py-4 px-6 text-center">95%+</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Ridge Counting</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Premium</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Platform Access</td>
                  <td className="py-4 px-6 text-center">Web</td>
                  <td className="py-4 px-6 text-center">Web, Desktop</td>
                  <td className="py-4 px-6 text-center">Web, Desktop, Mobile</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">API Access</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">1,000 calls/month</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Data Export</td>
                  <td className="py-4 px-6 text-center">CSV</td>
                  <td className="py-4 px-6 text-center">CSV, JSON, PDF</td>
                  <td className="py-4 px-6 text-center">All formats</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Support</td>
                  <td className="py-4 px-6 text-center">Email</td>
                  <td className="py-4 px-6 text-center">Email, Chat</td>
                  <td className="py-4 px-6 text-center">24/7 Priority</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Team Members</td>
                  <td className="py-4 px-6 text-center">1</td>
                  <td className="py-4 px-6 text-center">5</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pricing plans and features.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I upgrade or downgrade my plan at any time?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade your plan at any time and the new features will be immediately available. When
                downgrading, the changes will take effect at the start of your next billing cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do you count fingerprint analyses?</AccordionTrigger>
              <AccordionContent>
                Each uploaded fingerprint image that undergoes classification and/or ridge counting counts as one
                analysis. Multiple operations on the same fingerprint image within a 24-hour period count as a single
                analysis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you offer academic or non-profit discounts?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer special pricing for academic institutions, researchers, and non-profit organizations.
                Please contact our sales team for more information about our academic and non-profit programs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for
                annual plans. Enterprise customers can also request invoicing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a refund policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service
                within the first 14 days, you can request a full refund, no questions asked.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Can I try the Pro or Enterprise features before purchasing?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a 7-day free trial of our Pro plan. For Enterprise features, we can arrange a personalized
                demo and a trial period tailored to your organization's needs. Contact our sales team to set this up.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Get Started Today
            </Badge>
            <h2 className="text-2xl font-bold">Ready to Transform Your Fingerprint Analysis?</h2>
            <p className="text-muted-foreground max-w-xl">
              Join thousands of researchers, law enforcement agencies, and organizations who trust DabaFing for accurate
              fingerprint classification and ridge counting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 button-hover-effect">
                <Fingerprint className="h-5 w-5" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <HelpCircle className="h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

