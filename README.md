# ✨ CovaliBag ✨

## Introduction

In today's fast-paced world, efficiency and convenience are key in product design, especially for everyday items. Covali addresses the common issue of forgotten personal belongings with Project "Smart Bag". This stylish and functional bag seamlessly combines fashion with functionality, ensuring users can carry their essentials in style. This innovative bag employs advanced sensor technology to detect and track its contents, ensuring you never leave home or the workplace without your essential items. The Smart Bag proactively assists with personal organization by alerting users if any necessary item is missing before they leave.

## Table of Contents

1. [Info](#info)
2. [Installation and Running](#installation-and-running)
   1. [The App](#the-app)
   2. [The raspberry pi](#the-raspberry-pi)
   3. [Problems](#problems)

## Info

This project transfers NFC data throughout the raspberry Pi to the react native app with web server.

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
