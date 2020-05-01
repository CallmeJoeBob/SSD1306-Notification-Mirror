const WebSocketClient = require('websocket').client;
const i2c = require('i2c-bus');
const font = require('oled-font-3x5');
const font2 = require('oled-font-5x7');

const token = '<api token>'
const url = 'wss://stream.pushbullet.com/websocket/' + token
const client = new WebSocketClient();
const i2cBus = i2c.openSync(1);
const Oled = require('oled-i2c-bus');
const oled = new Oled(i2cBus, {
    width: 128,
    height: 64,
    address: 0x3c
});

var isIdle = true;

clearScreen();

client.on('connectFailed', function(error) {
    console.log('Error connecting: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('Connected!');

    connection.on('error', function(error) {
        console.log('Connection error: ' + error.toString());
    });

    connection.on('close', function() {
        console.log('Connection closed');
    });

    connection.on('message', function(raw) {
        var message = JSON.parse(raw.utf8Data)
        if (message.type === 'push') {
            console.log('Update:');
            var push = message.push;
            if (push.type === 'mirror') {
                console.log('Title: ' + push.title);
                console.log('Body: ' + push.body);
                isIdle = false;
                oled.clearDisplay();
                var toDisplay = '';
                if (!(push.title === undefined)) {
                    toDisplay = toDisplay + push.title;
                    oled.setCursor(1, 40);
                    oled.writeString(font, 2, push.title, 1, true);
                }
                if (!(push.body === undefined)) {
                    toDisplay = toDisplay + push.body;
                    oled.writeString(font, 2, '\n', 1, true);
                    oled.writeString(font, 1, push.body, 1, true);
                }
                oled.startScroll('left', 0, 15);
                var readtime = ((toDisplay.length) / 17) * 1000
                setTimeout(clearScreen, readtime);
            } else if (push.type == 'dismissal') {
                console.log('Notification ' + push.notification_id + ' dismissed.');
            } else {
                console.log('Unhandled type: ' + push.type);
            }
        } else if (message.type === 'nop') {
            console.log('listening...');
        }
    });
});

function clearScreen() {
    isIdle = true;
    oled.stopScroll();
    oled.clearDisplay();
}

client.connect(url);

function showTime() {
    if (isIdle) {
        var now = new Date();
        oled.setCursor(1, 50);
        var hours = now.getHours(),
            minutes = now.getMinutes(),
            ind = 'AM';
        if (hours > 12) {
            hours = hours - 12;
            ind = 'PM';
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        oled.writeString(font2, 1, hours + ':' + minutes + ' ' + ind, 1, false);
    }
    setTimeout(showTime, 500);
}

showTime();
