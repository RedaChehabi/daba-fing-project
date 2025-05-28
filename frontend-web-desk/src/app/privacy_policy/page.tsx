import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Lock, Eye, FileText, Clock } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p>
            At DabaFing, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our fingerprint classification and ridge counting service
            ("Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy
            policy, please do not access the Service.
          </p>
          <p>
            We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert
            you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to
            periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made
            aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy
            by your continued use of the Service after the date such revised Privacy Policy is posted.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <Link href="#collection" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Information We Collect
              </Link>
            </li>
            <li>
              <Link href="#use" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                How We Use Your Information
              </Link>
            </li>
            <li>
              <Link href="#disclosure" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Disclosure of Your Information
              </Link>
            </li>
            <li>
              <Link href="#security" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Security of Your Information
              </Link>
            </li>
            <li>
              <Link href="#rights" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Your Privacy Rights
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Information We Collect */}
        <div id="collection" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Information We Collect</h2>
          </div>

          <h3 className="text-lg font-bold">Personal Data</h3>
          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable information that
            can be used to contact or identify you ("Personal Data"). Personally identifiable information may include,
            but is not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h3 className="text-lg font-bold">Fingerprint Data</h3>
          <p>
            As a fingerprint analysis service, we collect and process fingerprint images that you upload to our Service.
            This data is considered sensitive biometric information and is treated with the highest level of security
            and privacy protection. We collect:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Fingerprint images uploaded by you</li>
            <li>Metadata associated with these images</li>
            <li>Analysis results including classification and ridge counts</li>
            <li>Feedback you provide on analysis results</li>
          </ul>

          <h3 className="text-lg font-bold">Usage Data</h3>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may
            include information such as your computer's Internet Protocol address (e.g., IP address), browser type,
            browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on
            those pages, unique device identifiers, and other diagnostic data.
          </p>

          <h3 className="text-lg font-bold">Tracking & Cookies Data</h3>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain
            information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
          <p>Examples of Cookies we use:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Session Cookies:</strong> We use Session Cookies to operate our Service.
            </li>
            <li>
              <strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences and various
              settings.
            </li>
            <li>
              <strong>Security Cookies:</strong> We use Security Cookies for security purposes.
            </li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div id="use" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          </div>

          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To perform fingerprint classification and ridge counting as requested by you</li>
            <li>To improve our algorithms through machine learning based on your feedback</li>
          </ul>

          <h3 className="text-lg font-bold">Fingerprint Data Usage</h3>
          <p>Your fingerprint data is used specifically for:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Performing the classification and ridge counting services you request</li>
            <li>Improving our algorithms through machine learning (only with your explicit consent)</li>
            <li>Storing your analysis history for your future reference</li>
          </ul>
          <p>
            We do not use fingerprint data for identification purposes beyond the scope of the Service, and we do not
            share this data with third parties except as described in this Privacy Policy.
          </p>
        </div>

        {/* Disclosure of Your Information */}
        <div id="disclosure" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Disclosure of Your Information</h2>
          </div>

          <p>We may disclose your Personal Data in the following situations:</p>

          <h3 className="text-lg font-bold">Business Transactions</h3>
          <p>
            If we are involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will
            provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
          </p>

          <h3 className="text-lg font-bold">Disclosure for Law Enforcement</h3>
          <p>
            Under certain circumstances, we may be required to disclose your Personal Data if required to do so by law
            or in response to valid requests by public authorities (e.g., a court or a government agency).
          </p>

          <h3 className="text-lg font-bold">Legal Requirements</h3>
          <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of DabaFing</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>

          <h3 className="text-lg font-bold">Service Providers</h3>
          <p>
            We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to
            provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our
            Service is used. These third parties have access to your Personal Data only to perform these tasks on our
            behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </div>

        {/* Security of Your Information */}
        <div id="security" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Security of Your Information</h2>
          </div>

          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet,
            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
            protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h3 className="text-lg font-bold">Our Security Measures</h3>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information and
            fingerprint data:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>All sensitive data is encrypted during transmission using TLS</li>
            <li>Fingerprint data is stored with strong encryption at rest</li>
            <li>Access to data is strictly controlled and logged</li>
            <li>Regular security audits and penetration testing</li>
            <li>Employee training on security and privacy best practices</li>
            <li>Physical security measures for our servers and facilities</li>
          </ul>
        </div>

        {/* Your Privacy Rights */}
        <div id="rights" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Your Privacy Rights</h2>
          </div>

          <p>Depending on your location, you may have certain rights regarding your personal information:</p>

          <h3 className="text-lg font-bold">For European Economic Area (EEA) Residents</h3>
          <p>Under GDPR, you have the following rights:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Right to Access:</strong> You have the right to request copies of your personal data.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You have the right to request that we correct any information you
              believe is inaccurate or complete information you believe is incomplete.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under
              certain conditions.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the
              processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>Right to Object to Processing:</strong> You have the right to object to our processing of your
              personal data, under certain conditions.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You have the right to request that we transfer the data we
              have collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>

          <h3 className="text-lg font-bold">For California Residents</h3>
          <p>Under the California Consumer Privacy Act (CCPA), you have the following rights:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Right to Know:</strong> You have the right to request that we disclose certain information to you
              about our collection and use of your personal information over the past 12 months.
            </li>
            <li>
              <strong>Right to Delete:</strong> You have the right to request that we delete any of your personal
              information that we collected from you and retained, subject to certain exceptions.
            </li>
            <li>
              <strong>Right to Opt-Out of Sales:</strong> You have the right to opt-out of the sale of your personal
              information. Note that we do not sell personal information.
            </li>
            <li>
              <strong>Right to Non-Discrimination:</strong> You have the right not to be discriminated against for
              exercising any of your CCPA rights.
            </li>
          </ul>

          <h3 className="text-lg font-bold">Exercising Your Rights</h3>
          <p>
            To exercise any of these rights, please contact us using the contact information provided below. We may need
            to verify your identity before responding to your request.
          </p>
        </div>

        {/* Contact Us */}
        <div id="contact" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>

          <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
            <Link href="/terms-of-service">
              <Button variant="outline" className="w-full sm:w-auto">
                Terms of Service
              </Button>
            </Link>
            <Link href="/cookies">
              <Button variant="outline" className="w-full sm:w-auto">
                Cookie Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

