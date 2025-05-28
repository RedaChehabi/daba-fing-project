import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, Scale, AlertTriangle, Clock, Shield } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p>
            Welcome to DabaFing. These Terms of Service ("Terms") govern your access to and use of the DabaFing website,
            mobile applications, and services (collectively, the "Service"). Please read these Terms carefully before
            using the Service.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
            the Terms, then you may not access the Service.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <Link href="#accounts" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Accounts
              </Link>
            </li>
            <li>
              <Link href="#content" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Content and Licenses
              </Link>
            </li>
            <li>
              <Link href="#payment" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Payment Terms
              </Link>
            </li>
            <li>
              <Link href="#prohibited" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Prohibited Uses
              </Link>
            </li>
            <li>
              <Link href="#disclaimer" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Disclaimer
              </Link>
            </li>
            <li>
              <Link href="#limitation" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Limitation of Liability
              </Link>
            </li>
            <li>
              <Link href="#termination" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Termination
              </Link>
            </li>
            <li>
              <Link href="#governing" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Governing Law
              </Link>
            </li>
            <li>
              <Link href="#changes" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Changes to Terms
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

        {/* Accounts */}
        <div id="accounts" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Accounts</h2>
          </div>

          <p>
            When you create an account with us, you must provide accurate, complete, and current information at all
            times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your
            account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities
            or actions under your password. You agree not to disclose your password to any third party. You must notify
            us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
          <p>
            You may not use as a username the name of another person or entity that is not lawfully available for use, a
            name or trademark that is subject to any rights of another person or entity without appropriate
            authorization, or a name that is offensive, vulgar, or obscene.
          </p>
        </div>

        {/* Content and Licenses */}
        <div id="content" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Content and Licenses</h2>
          </div>

          <h3 className="text-lg font-bold">Your Content</h3>
          <p>
            Our Service allows you to upload, store, and analyze fingerprint images and related data ("Your Content").
            You retain all rights to Your Content. By uploading or sharing Your Content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display Your Content
            solely for the purpose of providing and improving the Service.
          </p>
          <p>You represent and warrant that:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              You own or have the necessary rights to Your Content and have the right to grant us the license described
              above.
            </li>
            <li>
              Your Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any
              other rights of any person or entity.
            </li>
            <li>You have obtained proper consent from individuals whose fingerprint data you upload to the Service.</li>
          </ul>

          <h3 className="text-lg font-bold">Our Content</h3>
          <p>
            The Service and its original content (excluding Your Content), features, and functionality are and will
            remain the exclusive property of DabaFing and its licensors. The Service is protected by copyright,
            trademark, and other laws of both Morocco and foreign countries. Our trademarks and trade dress may not be
            used in connection with any product or service without the prior written consent of DabaFing.
          </p>
        </div>

        {/* Payment Terms */}
        <div id="payment" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Payment Terms</h2>
          </div>

          <p>
            Some features of the Service are offered on a subscription basis. You will be billed in advance on a
            recurring and periodic basis (monthly or yearly), depending on the subscription plan you select. At the end
            of each period, your subscription will automatically renew under the same conditions unless you cancel it or
            DabaFing cancels it.
          </p>
          <p>
            You may cancel your subscription either through your online account management page or by contacting our
            customer support team. You will receive a confirmation email upon cancellation, and your subscription will
            continue until the end of the current billing period.
          </p>
          <p>
            All payments are processed securely through our payment processors. By providing your payment information,
            you authorize us to charge your payment method for the subscription plan you have selected. If your payment
            cannot be processed for any reason, we reserve the right to suspend or terminate your access to the Service.
          </p>
          <p>
            We reserve the right to change our subscription fees at any time. If we do change fees, we will provide
            notice of the change on the website or by email, at our discretion, at least 30 days before the change is to
            take effect. Your continued use of the Service after the fee change becomes effective constitutes your
            agreement to pay the modified fee amount.
          </p>
        </div>

        {/* Prohibited Uses */}
        <div id="prohibited" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Prohibited Uses</h2>
          </div>

          <p>You agree not to use the Service:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>
              To upload, transmit, or distribute any content that is illegal, harmful, threatening, abusive, harassing,
              tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially,
              ethnically, or otherwise objectionable.
            </li>
            <li>
              To impersonate or attempt to impersonate DabaFing, a DabaFing employee, another user, or any other person
              or entity.
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or
              which, as determined by us, may harm DabaFing or users of the Service or expose them to liability.
            </li>
            <li>
              To use the Service for any unauthorized or illegal purpose, including but not limited to unauthorized
              surveillance, identity theft, or fraud.
            </li>
            <li>To attempt to circumvent any security measures or access restrictions of the Service.</li>
            <li>
              To use the Service to process fingerprint data without proper consent from the individuals to whom the
              fingerprints belong.
            </li>
          </ul>
          <p>Additionally, you agree not to:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              Use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere
              with any other party's use of the Service.
            </li>
            <li>
              Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose,
              including monitoring or copying any of the material on the Service.
            </li>
            <li>
              Use any manual process to monitor or copy any of the material on the Service or for any other unauthorized
              purpose without our prior written consent.
            </li>
            <li>Use any device, software, or routine that interferes with the proper working of the Service.</li>
            <li>
              Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or
              technologically harmful.
            </li>
            <li>
              Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the
              server on which the Service is stored, or any server, computer, or database connected to the Service.
            </li>
            <li>Attack the Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
            <li>Otherwise attempt to interfere with the proper working of the Service.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div id="disclaimer" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Disclaimer</h2>
          </div>

          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
            basis. The Service is provided without warranties of any kind, whether express or implied, including, but
            not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement,
            or course of performance.
          </p>
          <p>DabaFing, its subsidiaries, affiliates, and its licensors do not warrant that:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>The Service will function uninterrupted, secure, or available at any particular time or location.</li>
            <li>Any errors or defects will be corrected.</li>
            <li>The Service is free of viruses or other harmful components.</li>
            <li>The results of using the Service will meet your requirements.</li>
          </ul>
          <p>
            While we strive for high accuracy in our fingerprint classification and ridge counting, we do not guarantee
            100% accuracy. The Service should be used as a tool to assist in fingerprint analysis, not as the sole
            determinant for critical decisions.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div id="limitation" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
          </div>

          <p>
            In no event shall DabaFing, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Your access to or use of or inability to access or use the Service.</li>
            <li>Any conduct or content of any third party on the Service.</li>
            <li>Any content obtained from the Service.</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
            <li>Inaccuracies in fingerprint classification or ridge counting.</li>
          </ul>
          <p>
            The limitations of liability set forth above shall apply to the fullest extent permitted by law in the
            applicable jurisdiction.
          </p>
        </div>

        {/* Termination */}
        <div id="termination" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Termination</h2>
          </div>

          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
            account, you may simply discontinue using the Service or contact us to request account deletion.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination,
            including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </p>
        </div>

        {/* Governing Law */}
        <div id="governing" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Governing Law</h2>
          </div>

          <p>
            These Terms shall be governed and construed in accordance with the laws of Morocco, without regard to its
            conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>
        </div>

        {/* Changes to Terms */}
        <div id="changes" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Changes to Terms</h2>
          </div>

          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
        </div>

        {/* Contact Us */}
        <div id="contact" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>

          <p>If you have any questions about these Terms, please contact us:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>By email: legal@dabafing.com</li>
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

