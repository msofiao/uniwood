var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from "mongodb";
export function commentExist(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ commentId, }, prisma) {
        const comment = yield prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            return false;
        return true;
    });
}
// export async function upVoteTogglex(
//   {
//     commentId,
//     userId,
//   }: {
//     commentId: string;
//     userId: string;
//   },
//   prisma: PrismaClient
// ) {
//   const likeExist = await prisma.comment.findUnique({
//     where: {
//       id: commentId,
//       OR: [
//         { up_voted_by_users_id: { has: userId } },
//         { down_voted_by_users_id: { has: userId } },
//       ],
//     },
//     select: { up_voted_by_users_id: true, down_voted_by_users_id: true },
//   });
//   console.log("upvotes: " + likeExist?.up_voted_by_users_id);
//   // Reomve downVote if exist
//   if (!likeExist?.up_voted_by_users_id.length) {
//     console.log("Upvote Toggle: vote does not exist");
//     await prisma.comment.update({
//       where: { id: commentId },
//       data: {
//         up_voted_by_users_id: { push: userId },
//         down_voted_by_users_id: {
//           set:
//             likeExist?.down_voted_by_users_id.filter((e) => userId !== e) || [],
//         },
//       },
//     });
//   } else {
//     await prisma.comment.update({
//       where: { id: commentId },
//       data: {
//         up_voted_by_users_id: {
//           set:
//             likeExist?.up_voted_by_users_id.filter((e) => userId !== e) || [],
//         },
//         down_voted_by_users_id: {
//           set:
//             likeExist?.down_voted_by_users_id.filter((e) => userId !== e) || [],
//         },
//       },
//     });
//   }
// }
export function testCommentQuery(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, commentId }, prisma) {
        yield prisma.user.update({
            where: { id: userId },
            data: {
                comments: {
                    connect: { id: commentId },
                },
            },
        });
    });
}
// export async function downVoteTogglex(
//   { userId, commentId }: { userId: string; commentId: string },
//   prisma: PrismaClient
// ) {
//   const likeExist = await prisma.comment.findUnique({
//     where: {
//       id: commentId,
//       OR: [
//         { down_voted_by_users_id: { has: userId } },
//         { up_voted_by_users_id: { has: userId } },
//       ],
//     },
//     select: { down_voted_by_users_id: true, up_voted_by_users_id: true },
//   });
//   if (likeExist?.down_voted_by_users_id.length)
//     await prisma.comment.update({
//       where: { id: commentId },
//       data: {
//         down_voted_by_users_id: {
//           set:
//             likeExist?.down_voted_by_users_id.filter((e) => e !== userId) || [],
//         },
//         up_voted_by_users_id: {
//           set:
//             likeExist?.up_voted_by_users_id.filter((e) => userId !== e) || [],
//         },
//       },
//     });
//   else
//     await prisma.comment.update({
//       where: { id: commentId },
//       data: {
//         down_voted_by_users_id: { push: userId },
//         up_voted_by_users_id: {
//           set:
//             likeExist?.up_voted_by_users_id.filter((e) => e !== userId) || [],
//         },
//       },
//     });
// }
export function downVoteToggle(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, commentId }, prisma) {
        const [commentReactions, userCommentReactions] = yield prisma.$transaction([
            prisma.comment.findUnique({
                where: { id: commentId },
                select: { down_voted_by_users_id: true, up_voted_by_users_id: true },
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { up_voted_comments_id: true, down_voted_comments_id: true },
            }),
        ]);
        if (commentReactions === null || commentReactions === void 0 ? void 0 : commentReactions.down_voted_by_users_id.includes(userId)) {
            const updateComment = prisma.comment.update({
                where: { id: commentId },
                data: {
                    down_voted_by_users_id: {
                        set: commentReactions.down_voted_by_users_id.filter((e) => e !== userId),
                    },
                    up_voted_by_users_id: {
                        set: commentReactions.up_voted_by_users_id.filter((e) => e !== userId),
                    },
                },
            });
            const updateUser = prisma.user.update({
                where: { id: userId },
                data: {
                    up_voted_comments_id: {
                        set: userCommentReactions === null || userCommentReactions === void 0 ? void 0 : userCommentReactions.up_voted_comments_id.filter((e) => e !== commentId),
                    },
                    down_voted_comments_id: {
                        set: userCommentReactions === null || userCommentReactions === void 0 ? void 0 : userCommentReactions.down_voted_comments_id.filter((e) => e !== commentId),
                    },
                },
            });
            yield prisma.$transaction([updateComment, updateUser]);
        }
        else {
            const updateComment = prisma.comment.update({
                where: { id: commentId },
                data: {
                    down_voted_by_users_id: { push: userId },
                    up_voted_by_users_id: {
                        set: commentReactions === null || commentReactions === void 0 ? void 0 : commentReactions.up_voted_by_users_id.filter((e) => e !== userId),
                    },
                },
            });
            const updateUser = prisma.user.update({
                where: { id: userId },
                data: {
                    down_voted_comments_id: { push: commentId },
                    up_voted_comments_id: {
                        set: userCommentReactions === null || userCommentReactions === void 0 ? void 0 : userCommentReactions.down_voted_comments_id.filter((e) => e !== commentId),
                    },
                },
            });
            yield prisma.$transaction([updateComment, updateUser]);
        }
    });
}
export function upVoteToggle(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, commentId }, prisma) {
        const [commentReactions, userCommentReactions] = yield prisma.$transaction([
            prisma.comment.findUnique({
                where: { id: commentId },
                select: { down_voted_by_users_id: true, up_voted_by_users_id: true },
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { up_voted_comments_id: true, down_voted_comments_id: true },
            }),
        ]);
        if (commentReactions === null || commentReactions === void 0 ? void 0 : commentReactions.up_voted_by_users_id.includes(userId)) {
            const updateComment = prisma.comment.update({
                where: { id: commentId },
                data: {
                    down_voted_by_users_id: {
                        set: commentReactions.down_voted_by_users_id.filter((e) => e !== userId),
                    },
                    up_voted_by_users_id: {
                        set: commentReactions.up_voted_by_users_id.filter((e) => e !== userId),
                    },
                },
            });
            const updateUser = prisma.user.update({
                where: { id: userId },
                data: {
                    up_voted_comments_id: {
                        set: userCommentReactions === null || userCommentReactions === void 0 ? void 0 : userCommentReactions.up_voted_comments_id.filter((e) => e !== commentId),
                    },
                    down_voted_comments_id: {
                        set: userCommentReactions === null || userCommentReactions === void 0 ? void 0 : userCommentReactions.up_voted_comments_id.filter((e) => e !== commentId),
                    },
                },
            });
            yield prisma.$transaction([updateComment, updateUser]);
        }
        else {
            const updateComment = prisma.comment.update({
                where: { id: commentId },
                data: {
                    up_voted_by_users_id: { push: userId },
                    down_voted_by_users_id: {
                        set: commentReactions === null || commentReactions === void 0 ? void 0 : commentReactions.up_voted_by_users_id.filter((e) => e !== userId),
                    },
                },
            });
            const updateUser = prisma.user.update({
                where: { id: userId },
                data: {
                    up_voted_comments_id: { push: commentId },
                    down_voted_comments_id: {
                        set: commentReactions === null || commentReactions === void 0 ? void 0 : commentReactions.up_voted_by_users_id.filter((e) => e !== commentId),
                    },
                },
            });
            yield prisma.$transaction([updateComment, updateUser]);
        }
    });
}
export function getCommment(commentId, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.comment.findUnique({
            where: { id: commentId },
        });
    });
}
export function createComment(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, postId, content, type, }, prisma) {
        yield prisma.post.update({
            where: { id: postId },
            data: {
                comments: {
                    create: {
                        content: content,
                        author_id: userId,
                        type: type,
                    },
                },
            },
        });
    });
}
export function replyComment(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ commentId, targetId, author_id, content, type, }, prisma) {
        const replyId = new ObjectId().toHexString();
        if (type === "POST")
            yield prisma.comment.update({
                where: { id: commentId },
                data: {
                    replies_id: {
                        push: replyId,
                    },
                    replies: {
                        create: {
                            id: replyId,
                            content: content,
                            author_id: author_id,
                            type: type,
                            post_id: targetId,
                        },
                    },
                },
            });
        else if (type === "PROJECT")
            yield prisma.comment.update({
                where: { id: commentId },
                data: {
                    replies_id: {
                        push: replyId,
                    },
                    replies: {
                        create: {
                            id: replyId,
                            content: content,
                            author_id: author_id,
                            type: type,
                            project_id: targetId,
                        },
                    },
                },
            });
    });
}
