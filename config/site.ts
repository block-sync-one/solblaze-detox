export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SolBlaze Detox",
  description:
    "Clean The Network - Advanced Solana validator monitoring and network health optimization tools",
  url: "https://solblaze-detox.solanahub.app", // Update with your actual domain
  ogImage: "/og-image.jpg", // We'll need to add this image
  keywords: [
    "Solana",
    "blockchain",
    "validator",
    "network monitoring",
    "DeFi",
    "staking",
    "cryptocurrency",
    "Web3",
    "decentralized",
  ],
  authors: [
    {
      name: "SolBlaze",
      url: "https://solblaze.com",
    },
  ],
  creator: "SolBlaze",
  publisher: "SolBlaze",
  robots: "index, follow",
  language: "en",
  category: "Technology",
  classification: "Blockchain Infrastructure",
  openGraph: {
    type: "website" as const,
    locale: "en_US",
    title: "SolBlaze Detox - Clean The Network",
    description:
      "A tool to clean the network by re-delegating your stake to good validators",
    siteName: "SolBlaze Detox",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "SolBlaze Detox - Clean The Network",
    description:
      "A tool to clean the network by re-delegating your stake to good validators",
    creator: "@SolBlaze", // Update with actual Twitter handle
    site: "@SolBlaze", // Update with actual Twitter handle
  },
  verification: {
    google: "", // Add Google Search Console verification code
    yandex: "", // Add Yandex verification code if needed
    bing: "", // Add Bing verification code if needed
  },
  manifest: "/site.webmanifest",
} as const;
