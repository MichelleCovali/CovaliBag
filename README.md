# ✨ CovaliBag ✨

## Introduction

In today's fast-paced world, efficiency and convenience are key in product design, especially for everyday items. Covali addresses the common issue of forgotten personal belongings with Project "Smart Bag". This stylish and functional bag seamlessly combines fashion with functionality, ensuring users can carry their essentials in style. This innovative bag employs advanced sensor technology to detect and track its contents, ensuring you never leave home or the workplace without your essential items. The Smart Bag proactively assists with personal organization by alerting users if any necessary item is missing before they leave.

## Table of Contents

1. [Info](#info)
2. [Installation and Running](#installation-and-running)

   1. [The App](#the-app)
   2. [The raspberry pi](#the-raspberry-pi)
   3. [Problems](#problems)

3. [Contribution](#contribution)

## Info

This project transfers NFC data throughout the raspberry Pi to the react native app with web server.

The folder "CovaliBagApp" contains the build files for the app for this project. This code is written with the help of JavaScrip library(Framwork) react-native.

The folder "server" contains raspberry pi server which runs is a hos for a web connection and at the same time stores the NFC information in the database.

## Installation and Running

This part will talk about how to install the several parts of the project

### The app

Write this command to start expo project on your PC

```bash
cd ./CovaliBagApp
npx expo start
```

Now scan the QR code.

If for some reason this command does not work write

```bash
cd ./CovaliBagApp
npx expo start --tunnel
```

### The raspberry pi

Take you Raspberry Pi and write this in any directory
Before installation install python and those packages

```bash
pip install websockets sqlite
```

Install all necessities

```bash
git clone https://github.com/MichelleCovali/CovaliBag.git
git clone https://github.com/HubCityLabs/py532lib.git
cp -r py532lib/py532lib ./CovaliBag/server
cp -r py532lib/quick2wire ./CovaliBag/server
```

Run server

```bash
cd ./CovaliBag/server
sudo python server.py
```

Now you raspberry pi is working and if you want the app to work please reload the app

### Problems

Ensure that raspberry pi is connected to the network

Ensure that both raspberry Pi, your phone, and PC are connected to the same network.

## Contribution

Student:

Mihael Druzeta (5367131) - Work on the Raspberry Pi and the app

- Work on Flip cards
- Controlled quality
- Add custom icons
- Help with setting app Raspberry Pi
- Wrote documentation
- Developed 3d model logo

Mihaela Covali (5292891) - Work on the Raspberry Pi and the app

- Develop app design
- Develop NFC scanner
- Attempts to connect speakers
- Swiping logic
- Wrote documentation

Timofei Arefev (5300428) - Work on the Raspberry Pi and a bit on the app

- Setting up Raspberry Pi
- Develop NFC scanner
- Develop a web server to establish connection between the app and Raspberry Pi
- Help with documentation

Daryl Genove (5264652) - Work on the app

- Implement the app design
- Develop a loading screen
- Add light and dark mode
- Add buttons
- Library management
- Help with documentation

Peter Zlamala (5340012) - Work on Raspberry Pi

- Setting up Raspberry Pi
- Develop NFC scanner
- Helped with documentation

Erika Nicolau (5326745) - Work on Raspberry Pi and the app

- Develop NFC scanner
- Attempts to connect speakers
- Implement the main page in the app
- Wrote documentation

Jia Men Lam (5290201) - Work on the app

- Work on the app functionality
- Implement the design
- Add bag settings
- Wrote documentation
