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
import { ObjectId } from "mongodb";
import { capitalize } from "../../utils";
const db = await new MongodbInstane().getDbInstance();
// **
// * Notification Change Handler
// *  Socket Events:
// *       [notification/user_id] - Emit notification to the respective user
export const NotificationChangeHandler = (io, socket) => {
    const collection = db.collection("Notification");
    const changeStream = collection.watch();
    const sendNotification = (change) => __awaiter(void 0, void 0, void 0, function* () {
        let socketEvent = null;
        let payload = null;
        if (change.operationType === "insert") {
            socketEvent = change.fullDocument.notifTo_id.toString();
            const notifBy = yield db.collection("User").findOne({ _id: new ObjectId(change.fullDocument.notifFrom_id) }, {
                projection: {
                    id: 1,
                    firstname: 1,
                    lastname: 1,
                    username: 1,
                    "user_image.pfp_name": 1,
                },
            });
            if (!notifBy)
                throw new Error("User not found");
            switch (change.fullDocument.type) {
                case "POST_REACT":
                    payload = {
                        id: change.fullDocument._id,
                        type: change.fullDocument.type,
                        createdAt: change.fullDocument.createdAt,
                        notifFrom_id: change.fullDocument.notifFrom_id,
                        notifTo_id: change.fullDocument.notifTo_id,
                        post_id: change.fullDocument.post_id,
                        notifBy: {
                            id: notifBy._id.toString(),
                            fullname: capitalize(`${notifBy.firstname} ${notifBy.lastname}`),
                            username: notifBy.username,
                            pfp: notifBy.user_image.pfp_name,
                        },
                    };
                    break;
                case "POST_COMMENT":
                    payload = {
                        id: change.fullDocument._id,
                        type: change.fullDocument.type,
                        createdAt: change.fullDocument.createdAt,
                        notifFrom_id: change.fullDocument.notifFrom_id,
                        notifTo_id: change.fullDocument.notifTo_id,
                        post_id: change.fullDocument.post_id,
                        comment_id: change.fullDocument.comment_id,
                        notifBy: {
                            id: notifBy._id.toString(),
                            fullname: capitalize(`${notifBy.firstname} ${notifBy.lastname}`),
                            username: notifBy.username,
                            pfp: notifBy.user_image.pfp_name,
                        },
                    };
                case "FOLLOW":
                    payload = {
                        id: change.fullDocument._id,
                        type: change.fullDocument.type,
                        createdAt: change.fullDocument.createdAt,
                        notifFrom_id: change.fullDocument.notifFrom_id,
                        notifTo_id: change.fullDocument.notifTo_id,
                        notifBy: {
                            id: notifBy._id.toString(),
                            fullname: capitalize(`${notifBy.firstname} ${notifBy.lastname}`),
                            username: notifBy.username,
                            pfp: notifBy.user_image.pfp_name,
                        },
                    };
                default:
                    break;
            }
            if (socketEvent && payload) {
                console.log(`Emitting notification to ${socketEvent}`);
                socket.emit(`notification/${socketEvent}`, payload);
            }
        }
    });
    changeStream.on("change", sendNotification);
};
