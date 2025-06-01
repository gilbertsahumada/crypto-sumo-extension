# Crypto Sumo Extension

Crypto Sumo is a browser extension that enhances web3 interactions across various platforms, with a special focus on enabling HTML5 games directly within social media platforms like Twitter and others.

## Features

- **HTML5 Action Support**: Render and interact with HTML5 games directly within Twitter and other supported platforms
- **Multi-Wallet Integration**: Support for popular web3 wallets including MetaMask, Rabby, and Core Wallet
- **Cross-Platform Compatibility**: Works across major browsers with extension support
- **Secure Transactions**: Facilitates secure crypto transactions within supported platforms

## Installation

### From Source
1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the unpacked extension from the `dist` folder into your browser:
   - Chrome/Brave: Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked"
   - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file from the `dist` folder

## Usage

1. Click on the Crypto Sumo extension icon in your browser toolbar
2. Select your preferred wallet from the available options
3. Navigate to supported platforms (like Twitter) to experience HTML5 games integrated directly into the platform
4. Interact with HTML5 content without leaving the platform

## HTML5 Action Support

Our extension implements a custom rendering engine that allows HTML5 games and interactive content to be embedded and rendered directly within social media platforms. This feature:

- Enables seamless gaming experiences within social feeds
- Supports interactive HTML5 content without redirects
- Provides web3 connectivity to games through the selected wallet
- Maintains platform-native UI/UX while adding rich interactive elements

## Development

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Setup
```
npm install
```

### Development Build
```
npm run dev
```

### Production Build
```
npm run build
```

### Clean Build Directory
```
npm run clean
```

## Technologies

- React 19
- TypeScript
- Vite
- Chrome Extension Manifest V3
- @sherrylinks SDK for blockchain interactions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
