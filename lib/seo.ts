import { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  keywords?: readonly string[] | string[];
}

export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  noIndex = false,
  keywords = siteConfig.keywords,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} - ${siteConfig.name}` : siteConfig.name;

  return {
    title: pageTitle,
    description,
    keywords: [...keywords],
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      creator: siteConfig.twitter.creator,
    },
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: url,
    },
  };
}

export function generateStructuredData(
  type: "WebSite" | "Organization" | "WebPage" | "Article",
  data: any,
) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "WebSite":
      return {
        ...baseData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        ...data,
      };

    case "Organization":
      return {
        ...baseData,
        name: siteConfig.creator,
        url: siteConfig.authors[0].url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: [
          // Add social media URLs here
          "https://twitter.com/solblaze_org",
          "https://github.com/solblaze_org",
        ],
        ...data,
      };

    case "WebPage":
      return {
        ...baseData,
        name: data.title || siteConfig.name,
        description: data.description || siteConfig.description,
        url: data.url || siteConfig.url,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        ...data,
      };

    case "Article":
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        image: data.image || siteConfig.ogImage,
        author: {
          "@type": "Organization",
          name: siteConfig.creator,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.publisher,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`,
          },
        },
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt || data.publishedAt,
        ...data,
      };

    default:
      return baseData;
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
