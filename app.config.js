export default {
  name: "LexiReport",
  slug: "lexireport",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router"
  ],
  scheme: "lexireport",
  extra: {
    apiUrl: process.env.API_URL,
    apiBaseUrl: process.env.API_BASE_URL
  }
}; 