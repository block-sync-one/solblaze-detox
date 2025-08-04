# OG Image Setup

This project includes a dynamic OG image generation system for better social media sharing.

## Features

- **Dynamic OG Image**: Automatically generates OG images at `/api/og`
- **Branded Design**: Uses SolBlaze colors and logo
- **Responsive**: Optimized for social media platforms (1200x630)
- **Fallback Support**: Static image option available

## How it Works

### Dynamic OG Image
The OG image is generated dynamically using Next.js's `ImageResponse` API at `/api/og`. This route:

- Uses the SolBlaze logo and brand colors
- Displays the app title "SolBlaze Flux"
- Shows the tagline "Clean The Network"
- Includes a description of the app's purpose
- Features a gradient background matching the brand

### Configuration
The OG image is configured in `config/site.ts`:

```typescript
ogImage: "/api/og", // Dynamic OG image generation
```

### Metadata
The OG image is referenced in the layout metadata:

```typescript
openGraph: {
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.openGraph.title,
    },
  ],
},
```

## Generating Static OG Image

If you prefer a static OG image, you can generate one from the dynamic version:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Generate the static image:
   ```bash
   npm run generate-og
   ```

This will create `public/og-image.png` which you can then use by updating the config:

```typescript
ogImage: "/og-image.png", // Static OG image
```

## Customization

To customize the OG image:

1. Edit `app/api/og/route.tsx`
2. Modify the JSX structure and styling
3. Update colors, fonts, or layout as needed
4. Test by visiting `/api/og` in your browser

## Testing

You can test the OG image by:

1. Visiting `/api/og` directly in your browser
2. Using social media debugging tools:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## Best Practices

- Keep the design simple and readable at small sizes
- Use high contrast colors for better visibility
- Include your logo and brand name prominently
- Test on different social media platforms
- Ensure the image loads quickly (under 1MB)

## Troubleshooting

If the OG image doesn't appear:

1. Check that the `/api/og` route is working
2. Verify the metadata configuration in `layout.tsx`
3. Clear social media cache using their debugging tools
4. Ensure your domain is properly configured in the site config 