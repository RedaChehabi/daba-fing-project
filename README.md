# DabaFing - NextJS Web Version

A NextJS-only version of the DabaFing fingerprint analysis system, converted from the original Electron application.

## Features

- **Fingerprint Classification**: Advanced fingerprint pattern recognition
- **Ridge Counting**: Automated ridge counting algorithms
- **User Authentication**: Secure login and user management
- **Dashboard**: Comprehensive analytics and reporting
- **Theme Support**: Light/dark mode switching
- **Modern UI**: Built with Radix UI components and Tailwind CSS

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

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility libraries
├── services/             # API services
└── utils/                # Utility functions
```

## API Integration

The application expects a backend API running on `http://localhost:8000`. API calls are automatically proxied through Next.js rewrites.

## Differences from Electron Version

This NextJS version removes all Electron-specific functionality:
- No desktop app packaging
- No native file system access
- No Electron-specific security features
- Pure web application that runs in browsers

## Development

The application uses modern React patterns with:
- Server-side rendering (SSR)
- Client-side navigation
- Responsive design
- Accessibility features

## License

This project is private and proprietary to the DabaFing team.