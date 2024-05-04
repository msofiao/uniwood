var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { capitalize } from "../utils/index";
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifDocument = yield req.prisma.notification.findMany({
        where: {
            notifTo_id: req.userId,
        },
        select: {
            id: true,
            type: true,
            createdAt: true,
            notifTo_id: true,
            notifFrom_id: true,
            post_id: true,
            comment_id: true,
            NotifFrom: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    user_image: true,
                    username: true,
                    follower_ids: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!notifDocument)
        return res
            .code(404)
            .send({ status: "fail", message: "Notification not Found" });
    let parsedNotifDoc = notifDocument.map((notif) => {
        var _a, _b;
        return {
            id: notif.id,
            type: notif.type,
            createdAt: notif.createdAt,
            notifTo_id: notif.notifTo_id,
            post_id: (_a = notif.post_id) !== null && _a !== void 0 ? _a : undefined,
            comment_id: (_b = notif.comment_id) !== null && _b !== void 0 ? _b : undefined,
            notifFrom_id: notif.notifFrom_id,
            notifBy: {
                id: notif.NotifFrom.id,
                fullname: capitalize(`${notif.NotifFrom.firstname} ${notif.NotifFrom.lastname}`),
                username: notif.NotifFrom.username,
                pfp: notif.NotifFrom.user_image.pfp_name,
            },
            NotifFrom: {
                followers_ids: notif.NotifFrom.follower_ids,
            },
        };
    });
    if (req.query.fromFollowedUsers === "true") {
        console.log("fromFollowedUsers=================");
        parsedNotifDoc = parsedNotifDoc.filter((pNotif) => pNotif.NotifFrom.followers_ids.includes(req.userId));
    }
    return res.send({
        status: "success",
        message: "Successfully fetched notification",
        data: parsedNotifDoc,
    });
});
export const notificationController = { getNotifications };
