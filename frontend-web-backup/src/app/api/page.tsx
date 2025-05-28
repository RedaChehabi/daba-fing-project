import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  FileJson,
  ArrowRight,
  Copy,
  ExternalLink,
  CheckCircle2,
  Key,
  Fingerprint,
  BarChart,
  Database,
  FileText,
} from "lucide-react"

export default function ApiPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            API
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            DabaFing <span className="gradient-text">API</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Integrate DabaFing's powerful fingerprint analysis capabilities into your own applications with our
            comprehensive API.
          </p>
        </div>

        {/* API Overview */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">API Overview</h2>
            <p className="text-muted-foreground text-lg">
              The DabaFing API provides programmatic access to our fingerprint analysis capabilities, allowing you to
              integrate them into your own applications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Key className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Authentication</h3>
                  <p className="text-muted-foreground">
                    Secure API access using API keys and OAuth 2.0 for authentication.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="#authentication">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileJson className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Endpoints</h3>
                  <p className="text-muted-foreground">
                    RESTful API endpoints for fingerprint classification, ridge counting, and more.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="#endpoints">
                      <span>View endpoints</span>
                      <ArrowRight className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">SDKs</h3>
                  <p className="text-muted-foreground">
                    Client libraries for various programming languages to simplify API integration.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="#sdks">
                      <span>Explore SDKs</span>
                      <ArrowRight className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication Section */}
        <div id="authentication" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Authentication</h2>
            <p className="text-muted-foreground text-lg">
              Secure your API requests using API keys or OAuth 2.0 authentication.
            </p>
          </div>

          <Tabs defaultValue="api-key" className="space-y-4">
            <TabsList>
              <TabsTrigger value="api-key">API Key</TabsTrigger>
              <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
            </TabsList>
            <TabsContent value="api-key" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">API Key Authentication</h3>
                <p>
                  The simplest way to authenticate with the DabaFing API is using an API key. You can generate an API
                  key in your account dashboard.
                </p>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Example Request</h4>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    <code>
                      curl -X POST https://api.dabafing.com/v1/classify \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d '&#123;"image": "base64_encoded_image"&#125;'
                    </code>
                  </pre>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Example Response</h4>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    <code>
                      &#123;
                      <br />
                      &nbsp;&nbsp;"id": "fp_123456",
                      <br />
                      &nbsp;&nbsp;"classification": "whorl",
                      <br />
                      &nbsp;&nbsp;"confidence": 0.967,
                      <br />
                      &nbsp;&nbsp;"processing_time": 1.2
                      <br />
                      &#125;
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="oauth" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">OAuth 2.0 Authentication</h3>
                <p>
                  For more secure applications, we recommend using OAuth 2.0 authentication. This allows you to request
                  specific permissions from users and access their data securely.
                </p>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Step 1: Redirect to Authorization URL</h4>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    <code>
                      https://auth.dabafing.com/oauth/authorize?
                      <br />
                      &nbsp;&nbsp;client_id=YOUR_CLIENT_ID&
                      <br />
                      &nbsp;&nbsp;redirect_uri=YOUR_REDIRECT_URI&
                      <br />
                      &nbsp;&nbsp;response_type=code&
                      <br />
                      &nbsp;&nbsp;scope=read:fingerprints write:fingerprints
                    </code>
                  </pre>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Step 2: Exchange Code for Access Token</h4>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    <code>
                      curl -X POST https://auth.dabafing.com/oauth/token \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d '&#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"client_id": "YOUR_CLIENT_ID",
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"client_secret": "YOUR_CLIENT_SECRET",
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"code": "AUTHORIZATION_CODE",
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"redirect_uri": "YOUR_REDIRECT_URI",
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"grant_type": "authorization_code"
                      <br />
                      &nbsp;&nbsp;&#125;'
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Endpoints Section */}
        <div id="endpoints" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">API Endpoints</h2>
            <p className="text-muted-foreground text-lg">
              Explore the available API endpoints for fingerprint analysis.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Classification Endpoints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-6 text-left">Endpoint</th>
                      <th className="py-4 px-6 text-left">Method</th>
                      <th className="py-4 px-6 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/classify</td>
                      <td className="py-4 px-6">POST</td>
                      <td className="py-4 px-6">Classify a fingerprint image into a pattern type</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/classifications</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">List all classifications for the authenticated user</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/classifications/{"{id}"}</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">Get details of a specific classification</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-2">
                <Link href="/documentation">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Classification API Documentation</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Ridge Counting Endpoints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-6 text-left">Endpoint</th>
                      <th className="py-4 px-6 text-left">Method</th>
                      <th className="py-4 px-6 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/ridge-count</td>
                      <td className="py-4 px-6">POST</td>
                      <td className="py-4 px-6">Count ridges in a fingerprint image</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/ridge-counts</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">List all ridge counts for the authenticated user</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/ridge-counts/{"{id}"}</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">Get details of a specific ridge count</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-2">
                <Link href="/documentation">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Ridge Counting API Documentation</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Data Management Endpoints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-6 text-left">Endpoint</th>
                      <th className="py-4 px-6 text-left">Method</th>
                      <th className="py-4 px-6 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/fingerprints</td>
                      <td className="py-4 px-6">POST</td>
                      <td className="py-4 px-6">Upload a new fingerprint image</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/fingerprints</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">List all fingerprints for the authenticated user</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/fingerprints/{"{id}"}</td>
                      <td className="py-4 px-6">GET</td>
                      <td className="py-4 px-6">Get details of a specific fingerprint</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">/v1/fingerprints/{"{id}"}</td>
                      <td className="py-4 px-6">DELETE</td>
                      <td className="py-4 px-6">Delete a specific fingerprint</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-2">
                <Link href="/documentation">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Data Management API Documentation</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SDKs Section */}
        <div id="sdks" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Client SDKs</h2>
            <p className="text-muted-foreground text-lg">
              Use our client libraries to simplify API integration in your preferred programming language.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">JavaScript/TypeScript</h3>
                  <p className="text-muted-foreground">Client library for Node.js, React, and browser applications.</p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">npm install @dabafing/sdk</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Python</h3>
                  <p className="text-muted-foreground">
                    Client library for Python applications and data science workflows.
                  </p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">pip install dabafing-sdk</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Java</h3>
                  <p className="text-muted-foreground">Client library for Java applications and Android development.</p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">implementation 'com.dabafing:sdk:1.0.0'</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">C#/.NET</h3>
                  <p className="text-muted-foreground">Client library for .NET applications and services.</p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">Install-Package DabaFing.SDK</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">PHP</h3>
                  <p className="text-muted-foreground">Client library for PHP applications and web services.</p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">composer require dabafing/sdk</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Go</h3>
                  <p className="text-muted-foreground">Client library for Go applications and services.</p>
                  <div className="bg-muted rounded-md p-3 mt-2">
                    <code className="text-sm">go get github.com/dabafing/sdk</code>
                  </div>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <Link href="/documentation">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rate Limits Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Rate Limits</h2>
            <p className="text-muted-foreground text-lg">
              Understand the rate limits for the DabaFing API to ensure smooth operation of your applications.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">Plan</th>
                  <th className="py-4 px-6 text-left">Rate Limit</th>
                  <th className="py-4 px-6 text-left">Burst Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Free</td>
                  <td className="py-4 px-6">10 requests per minute</td>
                  <td className="py-4 px-6">20 requests</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Pro</td>
                  <td className="py-4 px-6">60 requests per minute</td>
                  <td className="py-4 px-6">100 requests</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Enterprise</td>
                  <td className="py-4 px-6">Unlimited</td>
                  <td className="py-4 px-6">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-muted rounded-md p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Rate Limit Headers</h4>
            </div>
            <p className="mt-2 text-sm">
              All API responses include the following headers to help you track your rate limit usage:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <code>X-RateLimit-Limit</code>: The maximum number of requests you're permitted to make per minute.
              </li>
              <li>
                <code>X-RateLimit-Remaining</code>: The number of requests remaining in the current rate limit window.
              </li>
              <li>
                <code>X-RateLimit-Reset</code>: The time at which the current rate limit window resets in UTC epoch
                seconds.
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Get Started
            </Badge>
            <h2 className="text-2xl font-bold">Ready to Integrate DabaFing?</h2>
            <p className="text-muted-foreground max-w-xl">
              Create an account to get your API key and start integrating DabaFing's powerful fingerprint analysis
              capabilities into your applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 button-hover-effect">
                  <Key className="h-5 w-5" />
                  Get API Key
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline" size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

