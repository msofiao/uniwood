import type { INotificationDocument } from "../types/index.d";
import type { FastifyRequest, FastifyReply } from "../types/fastify.d";
import { capitalize } from "../utils/index";

const getNotifications = async (
  req: FastifyRequest<{
    Querystring: { fromFollowedUsers: string | undefined };
    Body: any;
  }>,
  res: FastifyReply,
) => {
  const notifDocument = await req.prisma.notification.findMany({
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

  let parsedNotifDoc: Omit<
    INotificationDocument &
      AdditionalProps & { NotifFrom: { followers_ids: string[] } },
    "_id" | "updatedAt"
  >[] = notifDocument.map((notif) => {
    return {
      id: notif.id,
      type: notif.type,
      createdAt: notif.createdAt,
      notifTo_id: notif.notifTo_id,
      post_id: notif.post_id ?? undefined,
      comment_id: notif.comment_id ?? undefined,
      notifFrom_id: notif.notifFrom_id,
      notifBy: {
        id: notif.NotifFrom.id,
        fullname: capitalize(
          `${notif.NotifFrom.firstname} ${notif.NotifFrom.lastname}`,
        ),
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
    parsedNotifDoc = parsedNotifDoc.filter((pNotif) =>
      pNotif.NotifFrom.followers_ids.includes(req.userId),
    );
  }
  return res.send({
    status: "success",
    message: "Successfully fetched notification",
    data: parsedNotifDoc,
  });
};

export const notificationController = { getNotifications };

interface AdditionalProps {
  id: string;
  notifBy: {
    id: string;
    fullname: string;
    username: string;
    pfp: string;
  };
}
