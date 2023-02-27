const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { CustomFile } = require("telegram/client/uploads");
const { default: ms } = require("ms-prettify");

const fs = require('fs');
const input = require("input");

const data = require('./data.json');

const apiId = 19380580;
const apiHash = "e9ee227a78b14ee2b3d53259f8ee45a1";
const stringSession = new StringSession("");

module.exports = async () => {
    console.log("Telegram Bot Loading!");

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 2,
        timeout: 10000,
        retryDelay: 5000,
    });

    await client.start({
        phoneNumber: async () => "+918126578660",
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    }).then(async () => {
        const wait = ms(data.wait || "");

        async function fn() {
            for (let i = 0; i < data.users.length; i++) {
                try {
                    await client.invoke(
                        new Api.messages.SendMessage({
                            peer: data.users[i],
                            message: data.message,
                        })
                    );
                } catch (e) {
                    console.log(e)
                }
                try {
                    await client.invoke(
                        new Api.messages.SendMedia({
                            peer: data.users[i],
                            media: new Api.InputMediaUploadedPhoto({
                                file: await client.uploadFile({
                                    file: new CustomFile(
                                        "image.jpg",
                                        fs.statSync("./src/utility/image.jpg").size,
                                        "./src/utility/image.jpg"
                                    ),
                                    workers: 1,
                                }),
                                ttlSeconds: 43,
                            }),
                            message: "image"
                        })
                    );
                } catch (e) {
                }
            }
        }

        fn();

        if (wait) {
            setInterval(fn, wait);
        }
    })

    client.session.save();
}