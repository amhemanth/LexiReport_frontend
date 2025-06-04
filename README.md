# LexiReport Frontend

The mobile frontend for LexiReport, built with React Native and Expo.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🌓 Dark/Light mode support
- 🔐 Secure authentication (JWT)
- 📊 Report management and AI-powered insights
- 📤 File upload and download
- 🎨 Modern UI/UX with theming

## Tech Stack

- React Native (Expo)
- TypeScript
- Zustand (State Management)
- Expo Router (Navigation)
- Axios (API communication)

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
│   ├── components/
│   ├── hooks/
│   └── lib/
├── assets/
├── app.json
├── babel.config.js
├── tsconfig.json
└── README.md
```

## Development

- Follow TypeScript and React Native best practices
- Use Zustand for global state
- Use Expo Router for navigation
- Support for dark/light mode

## Testing

```bash
npm test
npm test -- --coverage
```

## Building for Production

```bash
eas build --platform ios   # iOS
eas build --platform android # Android
eas build --platform web    # Web
```

## Environment Variables

Create a `.env` file in the root of the frontend directory with:
- `API_URL` — Backend API URL (e.g., http://localhost:8000/api/v1)
- `APP_ENV` — Environment (development/production)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT License.
