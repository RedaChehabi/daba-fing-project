# DabaFing Web Application (Backup)

This is a backup copy of the DabaFing web application - a Next.js-based browser version of the fingerprint analysis system. The primary desktop application is located in `frontend-desktop/`.

## Purpose

This directory serves as a backup of the web application code and may be used for:
- Web-only deployments
- Browser-based access to the system
- Development reference
- Fallback option

## Features

- **Browser-Based**: Runs in any modern web browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Cross-Platform**: No installation required
- **Real-Time Analysis**: Live fingerprint processing
- **Modern UI**: Built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the web backup directory**
   ```bash
   cd frontend-web-backup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files

## Project Structure

```
frontend-web-backup/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   └── ...               # Other components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility libraries
│   ├── services/             # API services
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── package.json             # Dependencies
└── README.md               # This file
```

## API Integration

The web application connects to the Django backend API running on `http://localhost:8000`. API calls are automatically proxied through Next.js rewrites.

## Differences from Desktop Version

This web version differs from the desktop Electron app:
- **No Electron Features**: Pure web application
- **No Native OS Integration**: Browser-based only
- **No Offline Functionality**: Requires internet connection
- **No File System Access**: Limited to browser capabilities
- **All Routes Available**: No route restrictions like the desktop app

## Development

The application uses modern React patterns with:
- Server-side rendering (SSR)
- Client-side navigation
- Responsive design
- Accessibility features

## Deployment

This web application can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

## Note

⚠️ **This is a backup copy.** The primary development should focus on the desktop application in `frontend-desktop/`. This backup may not always be up-to-date with the latest features.

## License

This project is private and proprietary to the DabaFing team.
