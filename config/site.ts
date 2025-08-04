export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SolBlaze flux",
  description:
    "Re-delegating your stake to good validators",
  url: "https://solblaze-flux.solanahub.app", // Update with your actual domain
  ogImage: "/api/og", // Dynamic OG image generation
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
      url: "https://stake.solblaze.org/",
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
    title: "SolBlaze flux - Clean The Network",
    description:
      "A tool to clean the network by re-delegating your stake to good validators",
    siteName: "SolBlaze flux",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "SolBlaze flux - Clean The Network",
    description:
      "A tool to clean the network by re-delegating your stake to good validators",
    creator: "solblaze_org", // Update with actual Twitter handle
    site: "@solblaze_org", // Update with actual Twitter handle
  },
  verification: {
    google: "", // Add Google Search Console verification code
    yandex: "", // Add Yandex verification code if needed
    bing: "", // Add Bing verification code if needed
  },
  manifest: "/site.webmanifest",
} as const;
