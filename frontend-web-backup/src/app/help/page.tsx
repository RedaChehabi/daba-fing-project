import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Help Center</h1>
          <p className="text-muted-foreground md:text-xl">
            Find answers to common questions about using DabaFing for fingerprint analysis.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Quick Start Guide</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                  1
                </span>
                <span>Create an account or log in</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                  2
                </span>
                <span>Upload a fingerprint image</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                  3
                </span>
                <span>Review the analysis results</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                  4
                </span>
                <span>Provide feedback to improve accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                  5
                </span>
                <span>Export or save your results</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Need more help?
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Video Tutorials</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-xl">▶️</span>
                </div>
                <span>Getting Started with DabaFing</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-xl">▶️</span>
                </div>
                <span>How to Upload Fingerprints</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-xl">▶️</span>
                </div>
                <span>Understanding Analysis Results</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-xl">▶️</span>
                </div>
                <span>Providing Effective Feedback</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="#">
                <Button variant="outline" size="sm">
                  View All Tutorials
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What image formats are supported?</AccordionTrigger>
              <AccordionContent>
                DabaFing supports multiple image formats including JPEG, JPG, PNG, BMP, TIFF, TIF, WebP, and PDF. You
                can upload images from a biometric sensor, smartphone camera, or scanned paper with inked fingerprint
                images.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How accurate is the fingerprint analysis?</AccordionTrigger>
              <AccordionContent>
                Our Interactive Reinforcement Learning model achieves at least 93% accuracy in fingerprint
                classification and ridge counting. The accuracy improves over time as users provide feedback to refine
                the model.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use DabaFing offline?</AccordionTrigger>
              <AccordionContent>
                Yes, the desktop application offers offline functionality for image processing. The web and mobile
                applications require an internet connection for full functionality.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does the feedback mechanism work?</AccordionTrigger>
              <AccordionContent>
                After analyzing a fingerprint, you can provide feedback on the accuracy of the results. You can correct
                ridge counts, adjust classifications, or annotate the image. This feedback is used to improve the
                model's performance over time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my fingerprint data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we implement robust encryption for data transmission and storage. We comply with data protection
                regulations such as GDPR and CCPA to ensure your fingerprint data remains secure and private.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>What are the different user roles?</AccordionTrigger>
              <AccordionContent>
                DabaFing has three user roles: Normal User, Expert, and Admin. Normal Users can upload and analyze
                fingerprints. Experts have additional capabilities to validate and correct analyses. Admins have full
                system access and can manage users and settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="rounded-lg border p-6 bg-muted">
          <h2 className="text-xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-4">If you couldn't find the answer to your question, please contact our support team.</p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

