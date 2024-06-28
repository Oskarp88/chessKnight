const messageModel = require('../model/Message');

exports.messagePost = async(req, res) => {
    const {chatId, senderId, text} = req.body;
    console.log('senderId', senderId)

    try {
        const message = await messageModel({
            chatId, senderId, text
        });

        const response = await message.save();
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.getMessageChat = async(req, res) => {
    const {chatId} = req.params;

    try {
        const messages = await messageModel.find({chatId});

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}