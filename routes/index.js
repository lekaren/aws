var express = require('express');
var router = express.Router();
var {Expo} = require('expo-server-sdk');
const expo = new Expo();
const Redis = require('ioredis');
const { json } = require('body-parser');
const redis = new Redis({
  host: 'redis-12814.c246.us-east-1-4.ec2.cloud.redislabs.com',
  port: '12814',
  password: 't02uuDhJe4ecqprgLdnueKCxhDjaaLt5',
  db: 0
});

const savedPushTokens = [];

const saveToken = async(token) => {
    if (savedPushTokens.indexOf(token === -1)) {
        savedPushTokens.push(token);
    }
    await redis.set("savedPushTokens", JSON.stringify(savedPushTokens));
};

const handlePushTokens = (message) => {
    let notifications = [];

    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log('에러!');
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: '급식',
            body: message,
            data: {message}
        });
    } 
    console.log(notifications)
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let reseipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(reseipts);
            } catch (error) {
                console.error(error);
              }
        }
    })();
}

router.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log('토큰 저장됨');
    console.log(`토큰이 저장되었습니다. ${req.body.token.value}`);
});

router.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log('메시지 보냄');
    res.send(`메시지를 전송합니다. ${req.body.message}`);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('점심메뉴 조회');
});

module.exports = router;
