const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { loadImage } = require("@napi-rs/canvas");

const fs = require('fs');
const input = require("input");

const data = require('./data.json');
const { CustomFile } = require("telegram/client/uploads");

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
        for (let i = 0; i < data.users.length; i++) {
            try {
                console.log(new CustomFile(
                    "image.jpg",
                    fs.statSync("./src/utility/image.jpg").size,
                    "./src/utility/image.jpg",
                    Buffer.from((await loadImage("https://cdn.discordapp.com/attachments/1046806185350791189/1072202577116147772/IMG_7604.png"))?.src?.buffer)
                ),
                    fs.statSync("./src/utility/image.jpg").size,
                )
                await client.invoke(
                    new Api.messages.SendMedia({
                        peer: data.users[i],
                        media: new Api.InputMediaUploadedPhoto({
                            file: await client.uploadFile({
                                file: new CustomFile(
                                    "image.jpg",
                                    fs.statSync("./src/utility/image.jpg").size,
                                    "./src/utility/image.jpg",
                                ),
                                workers: 1,
                            }),
                            ttlSeconds: 43,
                        }),
                        message: data.message
                    })
                );
            } catch (e) {
                console.log(e)
            }
        }
    })

    client.session.save();
}