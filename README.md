# Nepal Air Quality Mobile App

A React Native mobile application that displays real-time air quality data for cities in Nepal.

## Features

- Real-time air quality data for major cities in Nepal
- Interactive map with color-coded markers
- Detailed air quality information for each city
- Weather information
- Search functionality
- Health recommendations based on air quality

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nepal-air-quality-mobile.git
cd nepal-air-quality-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

## Running the App

### Development

1. Start the development server:
```bash
npm start
```

2. Run on iOS:
```bash
npm run ios
```

3. Run on Android:
```bash
npm run android
```

### Production

To create a production build:

1. For iOS:
```bash
expo build:ios
```

2. For Android:
```bash
expo build:android
```

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Maps
- React Native Paper
- OpenWeather API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenWeather API for providing air quality and weather data
- React Native community for the amazing ecosystem
