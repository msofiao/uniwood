// const getProjects = async (req: FastifyRequest, res: FastifyReply) => {};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function createProject(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ title, context, tags, media, author_id, }, prisma) {
        yield prisma.project.create({
            data: {
                title,
                tags: tags || [],
                context,
                media: media || [],
                author: {
                    connect: {
                        id: author_id,
                    },
                },
            },
        });
    });
}
export function getProjects(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.project.findMany({});
    });
}
export function getProjectById(id, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.project.findUnique({
            where: {
                id,
                projectStatus: "ACTIVE",
            },
        });
    });
}
export function deleteProject(id, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.project.update({
            where: {
                id,
            },
            data: {
                projectStatus: "ARCHIVED",
            },
        });
    });
}
export function updateProject(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ projectId, title, context, tags, media, }, prisma) {
        const oldProjectPost = yield prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!oldProjectPost)
            throw new Error("Project not found");
        return yield prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                title: title || oldProjectPost.title,
                context: context || oldProjectPost.context,
                tags: tags || oldProjectPost.tags,
                media: media || oldProjectPost.media,
            },
        });
    });
}
export function projectLikeToggle(_a, prisma_1) {
    return __awaiter(this, arguments, void 0, function* ({ userId, projectId }, prisma) {
        const data = yield prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                liked_projects: {
                    where: { id: projectId },
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!data)
            throw new Error("User not found");
        if (data.liked_projects.length <= 0)
            yield prisma.user.update({
                where: { id: userId },
                data: {
                    liked_projects: {
                        connect: {
                            id: projectId,
                        },
                    },
                },
            });
        else
            yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    liked_projects: {
                        disconnect: {
                            id: projectId,
                        },
                    },
                },
            });
    });
}
