
import mongoose, { Schema, Types, model } from 'mongoose';

const Chatschema = new Schema({
    mainUser: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subpartisipant: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    messages: [{
        message: { type: String, required: true, },
        senderId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        }


    }]


}, { timestamps: true });

const ChatModel = mongoose.models.Chat || model('Chat', Chatschema);

export default ChatModel;
