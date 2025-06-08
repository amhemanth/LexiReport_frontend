# LexiReport Frontend

The mobile and web frontend for LexiReport, built with React Native and Expo.

## Overview
- 📱 Cross-platform (iOS, Android, Web)
- 🌓 Dark/Light mode
- 🔐 Secure authentication (JWT, RBAC)
- 📊 AI-powered report management, insights, and Q&A
- 📤 File upload, download, and sharing
- 🔔 Notifications, offline mode, user preferences
- 🤝 Collaboration (sharing, comments, tags)

## Project Structure
```
frontend/
├── app/           # Expo Router app directory
│   ├── (auth)/    # Authentication screens
│   ├── (tabs)/    # Main app tabs
│   └── _layout.tsx
├── components/    # Reusable components
├── hooks/         # Custom React hooks
├── services/      # API and business logic
├── store/         # Zustand state management
├── models/        # TypeScript models/types
├── utils/         # Helper functions
├── config/        # App configuration
├── constants/     # Static values (permissions, colors)
└── assets/        # Images and static assets
```

## Documentation
- [Architecture](../docs/ARCHITECTURE.md)
- [API Reference](../docs/API_REFERENCE.md)
- [AI Implementation](../docs/AI_IMPLEMENTATION_PLAN.md)
- [Deployment](../docs/DEPLOYMENT.md)
- [Testing](../docs/testing.md)

## Quickstart
```bash
npm install
npx expo start
```

- iOS: `npx expo run:ios`
- Android: `npx expo run:android`
- Web: `npx expo start:web`

## Environment Variables
Create a `.env` file in the root of the frontend directory:
```
API_URL=http://localhost:8000/api/v1
APP_ENV=development
```

## Achievements (2025)
- ✅ Modern, cross-platform frontend (Expo/React Native)
- ✅ Secure authentication (JWT, RBAC)
- ✅ Report upload, management, and AI-powered insights
- ✅ Voice-over, Q&A, and BI integration (MVP)
- ✅ Offline mode, notifications, and user preferences
- ✅ Collaboration (sharing, comments, tags)

## License
MIT License.
