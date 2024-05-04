var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongodbInstane } from "../dbConnect";
import { updateUnreadMessagesCount } from "../../models";
import { PrismaClient } from "@prisma/client";
import { capitalize } from "../../utils";
const db = await new MongodbInstane().getDbInstance();
// ** Message Change Handler
// *  Socket Events:
// *       [messgage/converse_id] - Emit message to the respective conversation
// *       [converseList/recipient_id & author_id] - Emit message to the respective conversation
export const messageChangeHandler = (io, socket) => {
    const collection = db.collection("Message");
    const changeStream = collection.watch();
    const sendMessage = (change) => {
        let socketEvent;
        let payload;
        if (change.operationType === "insert") {
            console.log(change.fullDocument);
            socketEvent = change.fullDocument.converse_id.toString();
            payload = {
                id: change.fullDocument._id,
                author_id: change.fullDocument.author_id,
                converse_id: change.fullDocument.converse_id,
                type: change.fullDocument.type,
                chat: change.fullDocument.chat,
                media: change.fullDocument.media,
                createdAt: change.fullDocument.createdAt,
                status: change.fullDocument.status,
                recipient_id: change.fullDocument.recipient_id,
            };
        }
        if (socketEvent && payload) {
            socket.emit(`message/${socketEvent}`, payload);
        }
    };
    const updateConverseList = (change) => __awaiter(void 0, void 0, void 0, function* () {
        let socketEventForAuthor;
        let socketEventForRecipient;
        let payload;
        if (change.operationType === "insert") {
            socketEventForAuthor = change.fullDocument.author_id;
            socketEventForRecipient = change.fullDocument.recipient_id;
            const prisma = new PrismaClient();
            const recipientInfo = yield prisma.user.findUnique({
                where: {
                    id: change.fullDocument.recipient_id,
                },
                select: {
                    firstname: true,
                    lastname: true,
                    user_image: true,
                },
            });
            if (!recipientInfo)
                return;
            payload = {
                id: change.fullDocument._id,
                author_id: change.fullDocument.author_id,
                converse_id: change.fullDocument.converse_id,
                type: change.fullDocument.type,
                chat: change.fullDocument.chat,
                media: change.fullDocument.media,
                createdAt: change.fullDocument.createdAt,
                status: change.fullDocument.status,
                recipient_id: change.fullDocument.recipient_id,
                pfp: recipientInfo.user_image.pfp_name,
                fullname: capitalize(`${recipientInfo.firstname} ${recipientInfo.lastname}`),
            };
        }
        if (!payload)
            return;
        if (socketEventForAuthor)
            socket.emit(`converseList/${socketEventForAuthor}`, payload);
        if (socketEventForRecipient)
            socket.emit(`converseList/${socketEventForRecipient}`, payload);
    });
    const readMessage = (payload, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (payload.user_id !== undefined && payload.converse_id !== undefined) {
                yield updateUnreadMessagesCount(payload.user_id, payload.converse_id);
                res({ status: "success" });
            }
            else
                res({ status: "fail", message: "Invalid Payload" });
        }
        catch (error) {
            console.log(error);
            res({ status: "fail", message: error.message });
        }
    });
    changeStream.on("change", updateConverseList);
    changeStream.on("change", sendMessage);
    socket.on("read_message", readMessage);
};
