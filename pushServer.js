const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys');
const pushClientSubscription = require('./pushClientSubscription');

webPush.setVapidDetails("mailto:laulaunidas@gmail.com",pushServerKeys.publicKey,pushServerKeys.privateKey);

const subscription ={
    endpoint : pushClientSubscription.endpoint,
    keys : {
        auth:pushClientSubscription.keys.auth,
        p256dh:pushClientSubscription.keys.p256dh
    }
}
console.log("avant send");
webPush.sendNotification(subscription,"notification envoyé depuis le serveur push node")
        .then(res => console.log("ma notification a bien ete poussée",res))
        .catch(err => console.error);
