# Open Graph Image Setup

This guide explains how to set up a custom preview image that shows when you share your Vercel app link on iMessage, WhatsApp, Twitter, LinkedIn, etc.

## Step 1: Create Your Image

Create an image for social media previews:
- **Recommended size:** 1200 x 630 pixels (1.91:1 aspect ratio)
- **Format:** PNG or JPG
- **File size:** Keep under 1MB for faster loading
- **Content:** Should include your app name "QuantIt" and a brief tagline

You can create this image using:
- Canva (has Open Graph image templates)
- Figma
- Photoshop
- Any design tool

## Step 2: Add Image to Your Project

1. Save your image as `og-image.png` (or `og-image.jpg`)
2. Place it in the `/public` folder of your project
3. The file should be at: `/public/og-image.png`

## Step 3: Update Your Vercel URL

The `index.html` file is already configured to use:
```
https://quantit.app/og-image.png
```

**Important:** Replace `quantit.app` with your actual Vercel domain:
- If your Vercel URL is `https://my-app.vercel.app`, update it to `https://my-app.vercel.app/og-image.png`
- Or if you have a custom domain, use that instead

## Step 4: Update index.html (if needed)

If your Vercel URL is different from `quantit.app`, update these lines in `index.html`:

```html
<meta property="og:image" content="https://your-actual-domain.com/og-image.png" />
<meta name="twitter:image" content="https://your-actual-domain.com/og-image.png" />
```

## Step 5: Deploy and Test

1. Commit and push your changes (including the image file)
2. Deploy to Vercel
3. Test the preview using:
   - **Facebook Debugger:** https://developers.facebook.com/tools/debug/
   - **Twitter Card Validator:** https://cards-dev.twitter.com/validator
   - **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
   - **iMessage:** Just send the link to yourself and check the preview

## Troubleshooting

### Preview still shows old image
- Clear the cache using the Facebook Debugger (click "Scrape Again")
- Wait a few minutes for caches to refresh
- Make sure the image URL is accessible (try opening it directly in a browser)

### Image not loading
- Check that the file is in `/public` folder
- Verify the filename matches exactly (case-sensitive)
- Make sure the URL in meta tags matches your actual Vercel domain
- Check that the image is deployed (should be accessible at `https://your-domain.com/og-image.png`)

### Image looks wrong on iMessage
- iMessage uses Open Graph tags
- Make sure `og:image` meta tag is set correctly
- Image should be at least 1200x630 pixels for best quality

## Quick Test

After deploying, test your image URL directly:
```
https://your-vercel-domain.vercel.app/og-image.png
```

If this works, the preview should work too!
