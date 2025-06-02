# LexiReport Frontend

The mobile frontend for LexiReport, built with React Native and Expo.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🌓 Dark mode support
- 🔐 Secure authentication
- 📊 Report management
- 📤 File upload
- 🎨 Modern UI/UX

## Tech Stack

- React Native
- Expo
- TypeScript
- Zustand (State Management)
- React Navigation
- Axios

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on specific platform:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start:web
```

## Project Structure

```
frontend/
├── app/
│   ├── (app)/
│   │   ├── index.tsx
│   │   ├── reports.tsx
│   │   ├── upload.tsx
│   │   └── profile.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── ThemedView.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   └── lib/
│       ├── api.ts
│       └── types.ts
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── app.json
├── babel.config.js
├── tsconfig.json
└── README.md
```

## Development

### Code Style
- Follow TypeScript best practices
- Use functional components
- Implement proper type definitions
- Follow React Native guidelines

### State Management
- Use Zustand for global state
- Use React hooks for local state
- Implement proper error handling

### Navigation
- Use Expo Router for navigation
- Implement proper navigation types
- Handle deep linking

### Theming
- Support light/dark mode
- Use consistent colors
- Implement proper typography

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Web
```bash
eas build --platform web
```

## Environment Variables

Required environment variables:
- `API_URL`: Backend API URL
- `APP_ENV`: Environment (development/production)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License.
