var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { commentExist, upVoteToggle as upVoteToggleQuery, downVoteToggle as downVoteToggleQuery, replyComment as replyCommentFc, testCommentQuery, } from "../models/commentsQuery.js";
import { ObjectId } from "mongodb";
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.comment))
        return res.code(400).send({
            status: "fail",
            message: "Missing field",
            error: [{ field: "comment", message: "field required" }],
        });
    if (!req.body.postId)
        return res
            .send(400)
            .send({ status: "fail", message: "Post id is missing" });
    if (!req.userId)
        return res.code(401).send({
            status: "fail",
            message: "User is unauthorize",
        });
    const commentId = new ObjectId().toHexString();
    const commentSuccess = yield req.prisma.post.update({
        where: { id: req.body.postId },
        data: {
            comments: {
                create: {
                    id: commentId,
                    content: req.body.comment,
                    author_id: req.userId,
                    type: "POST",
                },
            },
        },
        select: {
            comments: {
                where: {
                    author_id: req.userId,
                    content: req.body.comment,
                    id: commentId,
                },
                select: {
                    id: true,
                },
            },
        },
    });
    const postDoc = yield req.prisma.post.findUnique({
        where: { id: req.body.postId },
        select: { author_id: true },
    });
    if (!postDoc)
        return res
            .code(404)
            .send({ status: "fail", message: "Post author not found" });
    // Create Notificatoin
    yield req.prisma.notification.create({
        data: {
            type: "POST_COMMENT",
            Comment: {
                connect: { id: commentSuccess.comments[0].id },
            },
            NotifFrom: {
                connect: { id: req.userId },
            },
            NotifTo: {
                connect: { id: postDoc.author_id },
            },
            Post: {
                connect: { id: req.body.postId },
            },
        },
    });
    if (!commentSuccess)
        return res.code(500).send({ status: "fail", message: "Internal Error" });
    return res.code(200).send({ status: "success", message: "User added" });
    // Comment on a post
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req.body) === null || _b === void 0 ? void 0 : _b.comment))
        return res.code(400).send({
            status: "fail",
            message: "Missing field",
            error: [{ field: "comment", message: "field required" }],
        });
    if (!req.body.commentId)
        return res
            .code(404)
            .send({ status: "fail", message: "commentId id is missing" });
    if (!req.userId)
        return res.code(401).send({
            status: "fail",
            message: "User is unauthorize",
        });
    // Check if the user is teh author of the comment
    const comment = yield req.prisma.comment.findUnique({
        where: { id: req.body.commentId },
    });
    if (!comment)
        return res.code(404).send({ status: "fail", message: "Comment not found" });
    if (comment.author_id !== req.userId && (req === null || req === void 0 ? void 0 : req.role) === "USER")
        return res.code(403).send({
            status: "fail",
            message: "User is not authorize to edit the comment. User is not the author of the comment",
        });
    const updateStatus = yield req.prisma.comment.update({
        where: { id: req.body.commentId },
        data: { content: req.body.comment },
    });
    if (!updateStatus)
        return res.code(500).send({ status: "fail", message: "Internal Error" });
    return res.code(200).send({ status: "success", message: "Comment updated" });
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!((_c = req.body) === null || _c === void 0 ? void 0 : _c.commentId))
        return res
            .code(400)
            .send({ status: "fail", message: "Comment id is missing" });
    if (!req.userId)
        return res.code(401).send({ status: "fail" });
    // Check if the user is the author of the comment
    const comment = yield req.prisma.comment.findUnique({
        where: { id: req.body.commentId },
    });
    if (!comment)
        return res.code(404).send({ status: "fail", message: "Comment not found" });
    if (comment.author_id !== req.userId && (req === null || req === void 0 ? void 0 : req.role) === "USER")
        return res.code(403).send({
            status: "fail",
            message: "User is not authorize to delete the comment. User is not the author of the comment",
        });
    const deleteStatus = yield req.prisma.comment.update({
        where: { id: req.body.commentId },
        data: { status: "ARCHIVED" },
    });
    if (!deleteStatus)
        return res.code(500).send({ status: "fail", message: "Internal Error" });
    return res.code(200).send({ status: "success", message: "Comment deleted" });
});
/**
 * Get All Comments or Comments of a post
 * @param req
 * @param reply
 */
const getComments = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Filter Params
    let comments = [];
    if (req.query.postId)
        comments = yield req.prisma.comment.findMany({
            where: { post_id: req.query.postId },
        });
    else
        comments = yield req.prisma.comment.findMany({
            where: {
                replies: {
                    some: {},
                },
            },
            include: { replies: true },
        });
    return reply.code(200).send({ status: "success", comments });
});
const getComment = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield req.prisma.comment.findUnique({
        where: { id: req.params.commentId },
    });
    return reply.code(200).send({ status: "success", comment });
});
const upVoteToggle = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.commentId)
        return reply.code(400).send({
            status: "fail",
            error: "Missing Field",
            message: [{ field: "commentId", message: "field required" }],
        });
    if (!req.userId)
        return reply
            .code(401)
            .send({ status: "fail", message: "User is unauthorize" });
    const isCommentExist = yield commentExist({ commentId: req.body.commentId }, req.prisma);
    if (!isCommentExist)
        return reply
            .code(404)
            .send({ status: "fail", message: "Comment not found" });
    yield upVoteToggleQuery({ commentId: req.body.commentId, userId: req.userId }, req.prisma);
    return reply.code(200).send({ status: "success" });
});
const downVoteToggle = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!((_d = req.body) === null || _d === void 0 ? void 0 : _d.commentId))
        return reply
            .code(400)
            .send({ status: "fail", message: "Comment id is missing" });
    if (!req.userId)
        return reply
            .code(401)
            .send({ status: "fail", message: "User is unauthorize" });
    const isCommentExist = yield commentExist({ commentId: req.body.commentId }, req.prisma);
    if (!isCommentExist)
        return reply
            .code(404)
            .send({ status: "fail", message: "Comment not found" });
    yield downVoteToggleQuery({ userId: req.userId, commentId: req.body.commentId }, req.prisma);
    return reply.code(200).send({ status: "success" });
});
const replyComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.type === null ||
        req.body.type === undefined ||
        !req.body.type.match(/^(project|post)$/i)) {
        return res.code(400).send({
            status: "fail",
            message: "Missing field",
            error: [{ field: "type", message: "field required" }],
        });
    }
    if (!req.userId) {
        return res.code(401).send({
            status: "fail",
            message: "User is unauthorize",
        });
    }
    yield replyCommentFc({
        commentId: req.body.commentId,
        targetId: req.body.targetId,
        author_id: req.userId,
        content: req.body.content,
        type: req.body.type.toUpperCase(),
    }, req.prisma);
    return res.code(200).send({ status: "success", message: "Comment Replied" });
});
const commentController = {
    createComment,
    updateComment,
    getComment,
    getComments,
    deleteComment,
    upVoteToggle,
    downVoteToggle,
    replyComment,
};
export default commentController;
// ! Test
export const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.userId)
        yield testCommentQuery({ userId: req.userId, commentId: req.body.commentId }, req.prisma);
    res.send({ status: "success" });
});
