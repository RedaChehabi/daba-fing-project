/**
 * SEO optimization utilities for DabaFing web app
 */

import type { Metadata } from "next"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    url?: string
    siteName?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    locale?: string
    type?: string
  }
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player"
    site?: string
    creator?: string
    title?: string
    description?: string
    image?: string
  }
  additionalMetaTags?: Array<{
    name?: string
    property?: string
    content: string
  }>
  noIndex?: boolean
  noFollow?: boolean
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  twitter,
  additionalMetaTags,
  noIndex,
  noFollow,
}: SEOProps): Metadata {
  // Base metadata
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(", "),
  }

  // Robots
  if (noIndex || noFollow) {
    metadata.robots = {
      index: !noIndex,
      follow: !noFollow,
    }
  }

  // Canonical URL
  if (canonical) {
    metadata.alternates = {
      canonical,
    }
  }

  // OpenGraph
  if (openGraph) {
    metadata.openGraph = {
      title: openGraph.title || title,
      description: openGraph.description || description,
      url: openGraph.url || canonical,
      siteName: openGraph.siteName || "DabaFing",
      images: openGraph.images,
      locale: openGraph.locale || "en_US",
      type: (openGraph.type || "website") as any,
    }
  }

  // Twitter
  if (twitter) {
    metadata.twitter = {
      card: twitter.card || "summary_large_image",
      site: twitter.site || "@dabafing",
      creator: twitter.creator,
      title: twitter.title || title,
      description: twitter.description || description,
      images: twitter.image ? [twitter.image] : undefined,
    }
  }

  // Additional meta tags
  if (additionalMetaTags) {
    metadata.other = additionalMetaTags.reduce(
      (acc, tag) => {
        if (tag.name) {
          acc[tag.name] = tag.content
        } else if (tag.property) {
          acc[tag.property] = tag.content
        }
        return acc
      },
      {} as Record<string, string>,
    )
  }

  return metadata
}

/**
 * Generate structured data for rich results
 */
export function generateStructuredData(type: string, data: Record<string, any>): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return JSON.stringify(structuredData)
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbData(items: Array<{ name: string; url: string }>): string {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }))

  return generateStructuredData("BreadcrumbList", { itemListElement })
}

/**
 * Generate FAQ structured data
 */
export function generateFAQData(questions: Array<{ question: string; answer: string }>): string {
  const mainEntity = questions.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }))

  return generateStructuredData("FAQPage", { mainEntity })
}

/**
 * Generate organization structured data
 */
export function generateOrganizationData(data: {
  name: string
  url: string
  logo: string
  contactPoint?: Array<{
    telephone: string
    contactType: string
    areaServed?: string
    availableLanguage?: string[]
  }>
}): string {
  return generateStructuredData("Organization", data)
}

/**
 * Generate product structured data
 */
export function generateProductData(data: {
  name: string
  description: string
  image: string[]
  brand: string
  offers?: {
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}): string {
  return generateStructuredData("Product", data)
}
