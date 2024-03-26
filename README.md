![image](https://github.com/kvn-chn/trelltech/assets/139592148/3f02c4e2-fda7-410b-b761-61f7b059d413)

<!-- ABOUT THE PROJECT -->
## About The Project

As a freshman student at Epitech the IT expertise and innovation school, it was required to carry out a project for the purpose of learning how to create a mobile application within a month.

This project is built with React Native and Expo Go for debuging. It allows users to manage boards, lists, and cards, similar to a Trello-like task management app. Users can create and update cards and lists, and search through their cards.

This project was made as a member of 3, using the Trello API to make CRUD operations. 

## Features

* create/update/delete/display workspaces
* create boards with template choice (ex : kanban), then update/delete/display
* create/update/delete/display lists
* create/update/delete/display cards on a list
* assign persons to a card
* Search through cards and members
* View card details, including associated members

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/kvn-chn/trelltech.git`
2. Navigate to the project directory: `cd trelltech`
3. Install the dependencies: `yarn install`
4. Create a power-up to generate your own API KEY and TOKEN (for more information check the [documentation](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)
5. Create a .env file at the root of the project and insert your own API KEY and TOKEN :
   ```js
   API_KEY={YOUR API KEY}
   TOKEN={YOUR TOKEN}
   ```
6. Start the project: `yarn start`
7. Launch Expo Go and scan the following QR Code

## Usage

After starting the project, you can use the app on your mobile device or emulator.

## Building the project

This document will detail how to deploy this app for android and IOS

## 1. Install the latest EAS CLI
EAS CLI is the command-line app that you will use to interact with EAS services from your terminal. To install it, run the command:
```
yarn add -g eas-cli
```

## 2. Log in to your expo account
You must run `yarn eas login` and then log into your expo account

## 3. Configure the project
You must run the command `yarn eas build:configure` if you haven't already, where you may choose which platform you want to build for (recommended to choose all)

## 4. Run a build

## `For Android`

* now you must run `yarn eas build --platform android --profile preview`

it is recommended to let the client generate the keystore

* after this you may go to your [build dashboard](https://expo.dev/accounts/%5Baccount%5D/builds) where you can install

## Android app signing credentials
If you have not yet generated a keystore for your app, you can let EAS CLI take care of that for you by selecting `Generate new keystore`, and then you are done. The keystore is stored securely on EAS servers.
If you have previously built your app with `expo build:android`, you can use the same credentials here.
If you want to manually generate your keystore, please see the [manual Android credentials guide](https://docs.expo.dev/app-signing/local-credentials#android-credentials) for more information.

## `For IOS`
`note: you will only be able to run this on an IOS emulator`

* now you must run `yarn eas build --platform ios`
* now you should insert an ios bundle id

## iOS app signing credentials
If you have not generated a provisioning profile and/or distribution certificate yet, you can let EAS CLI take care of that for you by signing into your Apple Developer Program account and following the prompts.
If you have already built your app with `expo build:ios`, you can use the same credentials here.
If you want to rather manually generate your credentials, refer to the [manual iOS credentials guide](https://docs.expo.dev/app-signing/local-credentials#ios-credentials) for more information.

## 5. Wait for the build to complete
By default, the eas build command will wait for your build to complete, but you can interrupt it if you prefer not to wait. Monitor the progress and read the logs by following the link to the build details page that EAS CLI prompts once the build process gets started. You can also find this page by visiting your build dashboard or running the following command:
```
 yarn eas build:list
```

## 6. Deploy the build 
If you have made it to this step, congratulations! Depending on which path you chose, you now either have a build that is ready to upload to an app store, or you have a build that you can install directly on an Android device/iOS Simulator.

## Distribute your app to an app store

You will only be able to submit to an app store if you built specifically for that purpose. If you created a build for a store, [learn how to submit your app to app stores with EAS Submit]([https://docs.expo.dev/submit/introduction](https://docs.expo.dev/submit/introduction)).

## Install and run the app

You will only be able to install the app directly to your Android device/iOS Simulator if you explicitly built it for that purpose. If you built for app store distribution, you will need to upload to an app store and then install it from there (for example, from Apple's TestFlight app).

To learn how to install the app directly to your Android device/iOS Simulator, navigate to your build details page from [your build dashboard](https://expo.dev/accounts/%5Baccount%5D/builds) and click the "Install" button.

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
