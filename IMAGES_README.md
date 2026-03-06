# Image Assets Setup

The design uses images from Figma that are currently referenced via localhost URLs. To use the images in production, you need to:

1. Download all images from the Figma design
2. Place them in the `/public/images/` directory
3. Update the image paths in `app/page.tsx` to use `/images/` instead of localhost URLs

## Image List

The following images are needed:
- Logo: `logo.png`
- Background: `background.png`
- WhatsApp icon: `whatsapp.svg`
- Product images: `product1.png`, `product2.png`, `product3.png`
- About section images: `about1.png`, `about2.png`, `about3.png`, `about4.png`
- Process image: `process-image.png`
- Icons: `wheat.svg`, `commitment.svg`, `innovation.svg`, `check-icon.svg`, `arrow-icon.svg`
- CTA background: `cta-bg.svg`
- Contact icons: `phone.svg`, `email.svg`

## Quick Setup

1. Open the Figma design
2. Export all images as PNG/JPG (or SVG for icons)
3. Save them to `/public/images/` with the names above
4. Update the `images` object in `app/page.tsx` to use local paths like `/images/logo.png`
