var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const createPost = (_a, prisma_1) => __awaiter(void 0, [_a, prisma_1], void 0, function* ({ title, context, tags, media, userId }, prisma) {
    yield prisma.user.update({
        where: { id: userId },
        data: {
            posts: {
                create: {
                    title: title !== null && title !== void 0 ? title : null,
                    context,
                    tags: tags !== null && tags !== void 0 ? tags : [],
                    media: media !== null && media !== void 0 ? media : [],
                },
            },
        },
    });
});
export const likePostTogggle = (_b, prisma_2) => __awaiter(void 0, [_b, prisma_2], void 0, function* ({ postId, userId }, prisma) {
    const [user, post] = yield prisma.$transaction([
        prisma.user.findUnique({
            where: { id: userId },
            select: { liked_posts_id: true },
        }),
        prisma.post.findUnique({
            where: { id: postId },
            select: { liked_by_users_id: true, author_id: true },
        }),
    ]);
    if (post === null || user === null)
        throw new Error("User or post not found");
    if (post.liked_by_users_id.includes(userId)) {
        yield prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: {
                    liked_posts_id: {
                        set: user.liked_posts_id.filter((e) => e !== postId),
                    },
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: {
                    liked_by_users_id: {
                        set: post.liked_by_users_id.filter((e) => e !== userId),
                    },
                },
            }),
        ]);
    }
    else {
        yield prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { liked_posts_id: { push: postId } },
            }),
            prisma.post.update({
                where: { id: postId },
                data: { liked_by_users_id: { push: userId } },
            }),
        ]);
        // Add notification
        const notificationExist = yield prisma.notification.findFirst({
            where: {
                type: "POST_REACT",
                notifFrom_id: userId,
                post_id: postId,
            },
            select: {
                id: true,
            },
        });
        console.log({
            notificationExist,
            userId,
            author_id: post.author_id,
            postId,
        });
        if (!notificationExist && post.author_id !== userId) {
            yield prisma.notification.create({
                data: {
                    type: "POST_REACT",
                    NotifTo: { connect: { id: post.author_id } },
                    Post: {
                        connect: { id: postId },
                    },
                    NotifFrom: {
                        connect: { id: userId },
                    },
                },
            });
        }
    }
});
