# `@workspace/icons`

Centralized icon component library for the monorepo workspace, featuring custom SVG icons for WCA and CubingMexico, plus social media icons.

## ✨ Features

- 🎨 **Custom Brand Icons** - CubingMexico and WCA logos
- 📱 **Social Media Icons** - GitHub, Discord, WhatsApp, Facebook, Instagram, Twitter/X, TikTok
- ⚛️ **React Components** - All icons as React components
- 🎯 **Type-Safe** - Full TypeScript support
- 🎨 **Customizable** - Accepts all SVG/HTML attributes
- 📦 **Tree-Shakeable** - Import only what you need
- 🌈 **Theme-Aware** - Uses `currentColor` for easy theming

## 📦 Available Icons

### Brand Icons

- `CubingMexico` - CubingMexico logo
- `WcaMonochrome` - World Cube Association monogram

### Social Media Icons

- `GitHub` - GitHub logo
- `Discord` - Discord logo
- `WhatsApp` - WhatsApp logo
- `Facebook` - Facebook logo
- `Instagram` - Instagram logo
- `Twitter` - Twitter/X logo
- `TikTok` - TikTok logo

## 🚀 Usage

### Installation

This package is automatically available in the monorepo workspace:

```json
{
  "dependencies": {
    "@workspace/icons": "workspace:*"
  }
}
```

### Importing Icons

All icons are exported from the main entry point:

```tsx
import {
  CubingMexico,
  WcaMonochrome,
  GitHub,
  Discord,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  TikTok,
} from "@workspace/icons";
```

### Basic Usage

```tsx
import { CubingMexico, GitHub } from "@workspace/icons";

export function Header() {
  return (
    <div>
      <CubingMexico className="h-12 w-12" />
      <GitHub className="h-6 w-6" />
    </div>
  );
}
```

### With Custom Styling

All icons accept standard HTML/SVG attributes:

```tsx
import { WcaMonochrome } from "@workspace/icons";

export function Logo() {
  return (
    <WcaMonochrome
      className="h-20 w-20 text-blue-600 hover:text-blue-800"
      aria-label="World Cube Association"
    />
  );
}
```

### Controlling Size

```tsx
import { Instagram } from "@workspace/icons"

// Using className (Tailwind)
<Instagram className="h-8 w-8" />

// Using inline styles
<Instagram style={{ width: 32, height: 32 }} />

// Using width/height props
<Instagram width={32} height={32} />
```

### Controlling Color

Icons use `currentColor` for the fill, making them easy to theme:

```tsx
import { Discord } from "@workspace/icons"

// Via Tailwind classes
<Discord className="h-6 w-6 text-indigo-500" />

// Via inline styles
<Discord style={{ color: '#5865F2' }} />

// Via parent element
<div className="text-purple-600">
  <Discord className="h-6 w-6" />
</div>
```

## 📚 Examples

### Social Media Links

```tsx
import { GitHub, Discord, WhatsApp, Instagram } from "@workspace/icons";

export function SocialLinks() {
  const socials = [
    { Icon: GitHub, href: "https://github.com/...", label: "GitHub" },
    { Icon: Discord, href: "https://discord.gg/...", label: "Discord" },
    { Icon: WhatsApp, href: "https://wa.me/...", label: "WhatsApp" },
    { Icon: Instagram, href: "https://instagram.com/...", label: "Instagram" },
  ];

  return (
    <div className="flex gap-4">
      {socials.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={label}
        >
          <Icon className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
```

### Navigation Logo

```tsx
import { CubingMexico } from "@workspace/icons";
import Link from "next/link";

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <CubingMexico className="h-10 w-10 text-blue-600" />
      <span className="text-xl font-bold">CubingMexico</span>
    </Link>
  );
}
```

### Icon Button

```tsx
import { Twitter } from "@workspace/icons";
import { Button } from "@workspace/ui/components/button";

export function ShareButton() {
  return (
    <Button variant="outline" size="icon">
      <Twitter className="h-4 w-4" />
      <span className="sr-only">Share on Twitter</span>
    </Button>
  );
}
```

### Footer Social Icons

```tsx
import { Facebook, Instagram, TikTok, Twitter } from "@workspace/icons";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container">
        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <TikTok className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

## 🎨 Styling Guidelines

### Recommended Sizes

- **Navigation logos**: 32px - 48px (h-8 to h-12)
- **Social media icons**: 20px - 24px (h-5 to h-6)
- **Large brand logos**: 64px - 128px (h-16 to h-32)
- **Icon buttons**: 16px - 20px (h-4 to h-5)

### Accessibility

Always include accessible labels for icons:

```tsx
// With aria-label
<GitHub className="h-6 w-6" aria-label="View on GitHub" />

// With screen reader text
<a href="...">
  <GitHub className="h-6 w-6" />
  <span className="sr-only">Follow us on GitHub</span>
</a>
```

### Animation

Add transitions for interactive icons:

```tsx
<button className="group">
  <Instagram className="h-6 w-6 transition-transform group-hover:scale-110" />
</button>
```

## 🛠️ Adding New Icons

### Adding a Custom Icon

1. Create a new function in `src/icons.tsx`:

```tsx
export function MyIcon(props: React.HTMLAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>My Icon</title>
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

2. Export it from the package
3. Use it in your app

### Best Practices

- ✅ Use `currentColor` for fills to enable theming
- ✅ Include a `<title>` element for accessibility
- ✅ Spread `{...props}` to allow customization
- ✅ Set appropriate `viewBox` for the SVG
- ✅ Use consistent naming (PascalCase)
- ✅ Keep SVGs optimized (remove unnecessary attributes)

## 🎯 TypeScript Support

All icon components accept `React.HTMLAttributes<SVGElement>`:

```tsx
import { CubingMexico } from "@workspace/icons"

// All these work with full type safety
<CubingMexico className="..." />
<CubingMexico style={{ ... }} />
<CubingMexico onClick={handleClick} />
<CubingMexico aria-label="..." />
<CubingMexico data-testid="..." />
```

## 📁 Package Structure

```
packages/icons/
├── src/
│   └── icons.tsx         # All icon components
├── package.json
├── tsconfig.json
└── eslint.config.js
```

## 🔧 Tech Stack

- **React** 19
- **TypeScript** 5.9+
- **Lucide React** - Additional icon library available

## 📚 Resources

- [SVG on MDN](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [Accessibility for SVG](https://www.w3.org/WAI/tutorials/images/decorative/)
- [Simple Icons](https://simpleicons.org/) - Source for social media icons
- [Lucide Icons](https://lucide.dev/) - Additional icon library

---

**Note:** Social media icons are sourced from [Simple Icons](https://simpleicons.org/) under the CC0 1.0 Universal license.
