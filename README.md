This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

This app provides a starting point for developers to build a React Native app using Predix services. The app manages state using Redux and is set up with action creators to fetch a token from the UAA and store it in the device's local storage.

## Getting Started
### Clone the repository

Clone the repository or download and extract
```
git clone https://github.com/abhishekdhaduvai/reactnative-predix.git
cd reactnative-predix
```

### Install tools

1. Install [node](https://nodejs.org/en/). This includes npm - the node package manager.
2. (Optional) Install Expo for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) or for the [iphone](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8).
3. Install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) for iphone simulators or [Genymotion](https://www.genymotion.com/) for Android emulators.

### Install dependencies

Run the following command to install the app's dependencies.
```
npm install
```

### Update config

Update the ```config.js``` file with your UAA url, clientID, and base64 client credentials.

### Running the app

Run ```npm start``` to start the packager. 

You will be presented with a QR code and a couple of options. Scan the QR code with the Expo app on your phone to start it on your phone or enter ```i``` to start an iphone simulator.
