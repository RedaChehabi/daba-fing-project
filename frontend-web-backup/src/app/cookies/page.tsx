import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Cookie, Shield, Clock, FileText } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: April 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p>
            This Cookie Policy explains how DabaFing ("we", "us", or "our") uses cookies and similar technologies to
            recognize you when you visit our website and use our services. It explains what these technologies are and
            why we use them, as well as your rights to control our use of them.
          </p>
          <p>
            In some cases, we may use cookies to collect personal information, or that becomes personal information if
            we combine it with other information.
          </p>
        </div>

        {/* What are cookies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">What are cookies?</h2>
          </div>

          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
            as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, DabaFing) are called "first-party cookies". Cookies set by
            parties other than the website owner are called "third-party cookies". Third-party cookies enable
            third-party features or functionality to be provided on or through the website (e.g., advertising,
            interactive content, and analytics). The parties that set these third-party cookies can recognize your
            computer both when it visits the website in question and also when it visits certain other websites.
          </p>
        </div>

        {/* Why do we use cookies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Why do we use cookies?</h2>
          </div>

          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical
            reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary"
            cookies. Other cookies also enable us to track and target the interests of our users to enhance the
            experience on our website and services. Third parties serve cookies through our website for advertising,
            analytics, and other purposes.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Essential Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  These cookies are strictly necessary to provide you with services available through our website and to
                  use some of its features, such as access to secure areas. Because these cookies are strictly necessary
                  to deliver the website, you cannot refuse them without impacting how our website functions.
                </p>
                <p className="mt-2">Examples of essential cookies we use:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                  <li>Session cookies to keep you logged in during your visit</li>
                  <li>Security cookies for authentication and fraud prevention</li>
                  <li>Load balancing cookies to ensure the website functions properly</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Performance and Functionality Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  These cookies are used to enhance the performance and functionality of our website but are
                  non-essential to their use. However, without these cookies, certain functionality may become
                  unavailable.
                </p>
                <p className="mt-2">Examples of performance and functionality cookies we use:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                  <li>Cookies that remember your preferences (e.g., language, region)</li>
                  <li>Cookies that remember your settings (e.g., text size, accessibility features)</li>
                  <li>Cookies that remember if you've completed a survey or dismissed a notification</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Analytics and Customization Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  These cookies collect information that is used either in aggregate form to help us understand how our
                  website is being used or how effective our marketing campaigns are, or to help us customize our
                  website for you.
                </p>
                <p className="mt-2">Examples of analytics and customization cookies we use:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                  <li>Google Analytics cookies to track user behavior on our website</li>
                  <li>Hotjar cookies to analyze how users interact with our website</li>
                  <li>Cookies that help us understand which pages are most popular</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Advertising Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  These cookies are used to make advertising messages more relevant to you. They perform functions like
                  preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for
                  advertisers, and in some cases selecting advertisements that are based on your interests.
                </p>
                <p className="mt-2">Examples of advertising cookies we use:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                  <li>Google Ads cookies to show relevant advertisements</li>
                  <li>Facebook Pixel to measure the effectiveness of our advertising</li>
                  <li>LinkedIn Insight Tag to track conversions from LinkedIn ads</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Social Media Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  These cookies are used to enable you to share pages and content that you find interesting on our
                  website through third-party social networking and other websites. These cookies may also be used for
                  advertising purposes.
                </p>
                <p className="mt-2">Examples of social media cookies we use:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                  <li>Facebook cookies for sharing content and tracking conversions</li>
                  <li>Twitter cookies for integration with their platform</li>
                  <li>LinkedIn cookies for sharing professional content</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* How can you control cookies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">How can you control cookies?</h2>
          </div>

          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by
            setting your preferences in the Cookie Consent Manager that we display when you first visit our website.
          </p>
          <p>
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject
            cookies, you may still use our website though your access to some functionality and areas of our website may
            be restricted. As the means by which you can refuse cookies through your web browser controls vary from
            browser to browser, you should visit your browser's help menu for more information.
          </p>
          <p>
            In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like
            to find out more information, please visit:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>
              <a
                href="http://www.aboutads.info/choices/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital Advertising Alliance
              </a>
            </li>
            <li>
              <a
                href="https://youronlinechoices.eu/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                European Interactive Digital Advertising Alliance
              </a>
            </li>
            <li>
              <a
                href="https://youradchoices.ca/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital Advertising Alliance of Canada
              </a>
            </li>
          </ul>
        </div>

        {/* How often will we update this policy */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">How often will we update this Cookie Policy?</h2>
          </div>

          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies
            we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy
            regularly to stay informed about our use of cookies and related technologies.
          </p>
          <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
        </div>

        {/* Cookie List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Specific Cookies We Use</h2>
          </div>

          <p>Below is a detailed list of the cookies we use on our website:</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">Cookie Name</th>
                  <th className="py-4 px-6 text-left">Purpose</th>
                  <th className="py-4 px-6 text-left">Duration</th>
                  <th className="py-4 px-6 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">session_id</td>
                  <td className="py-4 px-6">Used to maintain your session</td>
                  <td className="py-4 px-6">Session</td>
                  <td className="py-4 px-6">Essential</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">auth_token</td>
                  <td className="py-4 px-6">Used for authentication</td>
                  <td className="py-4 px-6">30 days</td>
                  <td className="py-4 px-6">Essential</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">preferences</td>
                  <td className="py-4 px-6">Stores your preferences</td>
                  <td className="py-4 px-6">1 year</td>
                  <td className="py-4 px-6">Functionality</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">_ga</td>
                  <td className="py-4 px-6">Google Analytics</td>
                  <td className="py-4 px-6">2 years</td>
                  <td className="py-4 px-6">Analytics</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">_gid</td>
                  <td className="py-4 px-6">Google Analytics</td>
                  <td className="py-4 px-6">24 hours</td>
                  <td className="py-4 px-6">Analytics</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">_fbp</td>
                  <td className="py-4 px-6">Facebook Pixel</td>
                  <td className="py-4 px-6">3 months</td>
                  <td className="py-4 px-6">Advertising</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">_hjid</td>
                  <td className="py-4 px-6">Hotjar</td>
                  <td className="py-4 px-6">1 year</td>
                  <td className="py-4 px-6">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Us */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>

          <p>If you have any questions about our use of cookies or other technologies, please contact us:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>By email: privacy@dabafing.com</li>
            <li>By phone: +212 687 522 465</li>
            <li>By mail: ISICOD, Tangier, Morocco</li>
          </ul>

          <div className="pt-6">
            <Link href="/contact">
              <Button className="gap-2 button-hover-effect">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="space-y-4 pt-8 border-t">
          <h2 className="text-xl font-bold">Related Legal Documents</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/privacy-policy">
              <Button variant="outline" className="w-full sm:w-auto">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="outline" className="w-full sm:w-auto">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

