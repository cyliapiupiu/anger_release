# Soft Vilius

## About

This is a small Chrome extension used to demo the conversation with a bot and the ability to interact with it by punching it.

## Setup

To set this project up, follow these instructions:
 
 1. Connect Arduino to your Mac via USB.
 2. Upload the sketch inside dotStarPunchWorking/dotStarPunchWorking.ino to your Arduino.
   2.1. If you have erorrs regarding `Adafruit_DotStar.h` not being found, you can install it by going to `Sketch > Include Library > Manage Libraries...`. Then enter `Adafruit_Dotstar` in the window and install the first and only package you see.
 3. In your Arduino IDE, go to Tools > Port. Take note of which port is selected. If none are selected, copy the `/dev/cu.usbmodem14xx` part.
 4. Put the `/dev/usb.modem14xx` as the value of `DEVICE_PATH` in `main.js`. For example, if the path is `/dev/cu.usbmodem1421`, then the line in `main.js` should be `const DEVICE_PATH = "/dev/cu.usbmodem1421";`. Make the change and save the file.
 5. On Chrome browser: go to chrome://extensions , select Developer mode
 6. Press "Load unpacked extension" and go to this folder.
 7. Press Launch.
 8. Use right click (two-finger click on a Mac trackpad) and choose "Inspect" to open Console window for debugging.
 9. Follow the conversation.
 10. If the bot finds out you are sad and tells you to punch him, punch the pillow and watch it respond.
