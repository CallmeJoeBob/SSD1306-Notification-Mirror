# SSD1306 Notification Mirror
 Code for the notification mirroring functionality of my DIY smart glass project! The `socket.js` script uses a node websocket stream client to recieve messages from the PushBullet API.

 Check out my video to see the rest of the project:
 https://www.youtube.com/watch?v=pEyrGwpcSKo&feature=youtu.be

### Install:

1. Clone this repo. Make sure you have Node.js installed!
2. Install the following dependencies using `npm install`:
    - `websocket`
    - `i2c-bus`
    - `oled-i2c-bus`
    - `oled-font-3x5`
    - `oled-font-5x7`
3. Replace the token variable with your PushBullet API Token in line 6 of `socket.js`.
4. Copy the `oled.js` file into `./node_modules/oled-i2c-bus/`. This will replace the file in the module with the swapped x and y coordinates.
5. Run `node socket.js` to start the program. Be sure to have the SSD1306 display plugged into the correct I<sup>2</sup>C GPIO pins!
