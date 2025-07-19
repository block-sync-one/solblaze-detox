import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords as unknown as string[],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: siteConfig.robots,
  openGraph: {
    type: siteConfig.openGraph.type,
    locale: siteConfig.openGraph.locale,
    url: siteConfig.url,
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    siteName: siteConfig.openGraph.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.openGraph.title,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.creator,
    site: siteConfig.twitter.site,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon-16x16.png",
  },
  manifest: siteConfig.manifest,
  category: siteConfig.category,
  classification: siteConfig.classification,
  other: {
    "google-site-verification": siteConfig.verification.google,
    "yandex-verification": siteConfig.verification.yandex,
    "msvalidate.01": siteConfig.verification.bing,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Organization",
      name: siteConfig.creator,
      url: siteConfig.authors[0].url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.publisher,
      url: siteConfig.authors[0].url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html suppressHydrationWarning lang={siteConfig.language}>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      </head>
      <body className={clsx("min-h-screen bg-background", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class" }}>
          <main className="">{children}</main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
