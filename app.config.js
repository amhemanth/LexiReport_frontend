export default {
  expo: {
    name: 'DocuInsight',
    slug: 'docuinsight',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.docuinsight.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.docuinsight.app'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      apiUrl: process.env.API_URL?.trim() || 'http://192.168.123.82:8000/api/v1',
      apiBaseUrl: process.env.API_BASE_URL?.trim() || 'http://192.168.123.82:8000',
      eas: {
        projectId: "your-project-id"
      }
    },
    scheme: process.env.APP_SCHEME || 'docuinsight',
    plugins: [
      'expo-router'
    ]
  }
}; 