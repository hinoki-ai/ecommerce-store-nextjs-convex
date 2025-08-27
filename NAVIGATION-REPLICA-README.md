# ΛRΛMΛC Store Navigation Replica

This directory contains an exact HTML replica of the ΛRΛMΛC Store website's navigation header, created for demonstration and development purposes.

## Files

- `navigation-replica.html` - Complete HTML file with embedded Tailwind CSS and JavaScript
- `navigation-replica.css` - Standalone CSS file with custom styles and CSS custom properties
- `NAVIGATION-REPLICA-README.md` - This documentation file

## Features Replicated

### Navigation Structure
- **Logo**: ΛRΛMΛC Store branding with custom logo design
- **Main Navigation**: Products, Categories, Collections, Blog
- **Search Bar**: Desktop and mobile search functionality
- **User Actions**:
  - Wishlist with item count badge
  - Shopping cart with item count badge
  - User account button
  - Currency selector (USD)
  - Language switcher (EN)

### Responsive Design
- **Desktop**: Full horizontal navigation with all features
- **Mobile**: Collapsible menu with hamburger toggle
- **Tablet**: Adaptive layout for medium screens

### Interactive Elements
- Mobile menu toggle with icon animation
- Hover effects on navigation links
- Focus states on form elements
- Smooth transitions and animations

## Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Mobile menu functionality
- **CSS Custom Properties**: Theme system support

## Usage

### Option 1: Standalone HTML (Recommended)
```bash
open navigation-replica.html
```
This file includes everything needed and works offline.

### Option 2: With External CSS
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ΛRΛMΛC Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="navigation-replica.css">
</head>
<body>
    <!-- Navigation HTML content from navigation-replica.html -->
</body>
</html>
```

## Customization

### Changing the Logo
```html
<div class="flex items-center space-x-3">
    <img src="your-logo.png" alt="Your Logo" class="h-8 w-8">
    <div class="flex flex-col">
        <span class="logo-text">Your Brand</span>
        <span class="logo-subtitle">Your Tagline</span>
    </div>
</div>
```

### Adding New Navigation Links
```html
<a href="/new-page" class="nav-link text-sm font-medium hover:text-primary transition-colors">
    New Page
</a>
```

### Customizing Colors
Modify the CSS custom properties in `navigation-replica.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change to your brand color */
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- This replica focuses solely on the navigation header
- All links are placeholder and point to relative paths
- JavaScript is minimal and only handles mobile menu functionality
- Dark mode is supported via CSS custom properties
- The design matches the original Next.js + Tailwind CSS implementation

## Original Implementation

This replica is based on the following original components:
- `src/components/Header.tsx` - Main navigation component
- `src/lib/chunks/en.chunk.ts` - English translations
- Tailwind CSS configuration for styling

For the full ΛRΛMΛC Store implementation, see the main application files in the `src/` directory.