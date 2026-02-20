# WCA Certificates

A modern web application for designing, customizing, and printing participation and podium certificates for WCA (World Cube Association) competitions.

## ✨ Features

- 🎨 **Rich Text Editor** - Built with Tiptap for customizing certificate content
- 🖼️ **Canvas Designer** - Interactive canvas for designing certificate layouts
- 📊 **Badge Management** - Create and manage competition badges
- 📄 **Certificate Templates** - Pre-designed templates for various competition types
- 📦 **Bulk Export** - Export multiple certificates and badges as PDF or images
- 🎯 **WCA Integration** - Automatically fetch competition data from WCA
- 🌗 **Dark Mode** - Full theme support
- 🔐 **Authentication** - Secure sign-in with Better Auth

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1 or higher

### Installation

From the monorepo root:

```bash
pnpm install
```

### Development

Run the development server:

```bash
# From the monorepo root
pnpm --filter wca-certificates dev

# Or from this directory
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Build for production:

```bash
# From the monorepo root
pnpm --filter wca-certificates build

# Or from this directory
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Components:** Radix UI, shadcn/ui, @workspace/ui
- **Styling:** Tailwind CSS
- **Rich Text Editor:** Tiptap
- **PDF Generation:** @react-pdf/renderer, jspdf, pdfmake
- **Data Fetching:** SWR
- **Tables:** TanStack Table
- **Authentication:** Better Auth
- **Icons:** Lucide React, @cubing/icons
- **Canvas:** HTML2Canvas
- **QR Codes:** qrcode
- **Analytics:** Vercel Analytics

## 📁 Project Structure

```
apps/wca-certificates/
├── app/                    # Next.js App Router
│   ├── (root)/            # Main application routes
│   ├── api/               # API routes
│   ├── sign-in/           # Authentication pages
│   ├── actions.ts         # Server actions
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── canvas/           # Canvas-related components
│   ├── editor/           # Editor components
│   └── [other components]
├── data/                  # Static data
│   ├── badges.ts
│   └── certificates.ts
├── db/                    # Database
│   └── queries.ts
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Authentication config
│   ├── auth-client.ts    # Auth client
│   ├── canvas-store.ts   # Canvas state management
│   ├── fonts.ts          # Font configurations
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── events/          # Event-related assets
│   └── fonts/           # Custom fonts
└── types/               # TypeScript type definitions
    ├── canvas.ts
    ├── wca.ts
    └── wcif.ts
```

## 🎨 Key Features Explained

### Certificate Designer

The certificate designer allows organizers to:

- Customize certificate content using a rich text editor
- Position elements on a canvas
- Add images, logos, and QR codes
- Preview certificates in real-time
- Export to PDF or image formats

### Badge Manager

Create and manage competition badges with:

- Participant information
- Custom designs
- Bulk operations
- Multiple export formats

### WCA Integration

Automatically fetch and use:

- Competition details
- Participant information
- Results data
- Official WCA formatting

## 🔧 Configuration

Configuration files:

- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - shadcn/ui configuration

## 📦 Dependencies

Key dependencies include:

- Next.js and React 19
- Tiptap for rich text editing
- Radix UI components
- TanStack Table for data tables
- Multiple PDF generation libraries
- Better Auth for authentication

See [package.json](./package.json) for the complete list.

## 🤝 Contributing

This is part of a private monorepo. Please coordinate with the team before making changes.
