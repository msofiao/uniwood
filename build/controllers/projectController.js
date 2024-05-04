var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createProject as createProjectFn, getProjectById as getProjectByIdFn, deleteProject as deleteProjectFn, updateProject as updateProjectFn, getProjects as getProjectsFn, projectLikeToggle as projectLikeToggleFn, } from "../models/projectQuery.ts";
import { requestFieldChecker } from "../utils/reqTools.ts";
import { moveFile } from "../utils/fileManager.ts";
// const createProject = async ({tags: string })
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if required fields are present
    const missingFields = requestFieldChecker(["title", "context", "tags", "media"], req);
    if (missingFields.length > 0)
        return res
            .code(400)
            .send({ status: "error", message: "Missing required fields" });
    yield createProjectFn({
        author_id: req.userId,
        title: req.body.title,
        context: req.body.context,
        media: req.body.media,
        tags: req.body.tags,
    }, req.prisma);
    // Move file to public folder
    req.body.media.forEach((elem) => __awaiter(void 0, void 0, void 0, function* () {
        yield moveFile([elem.filename], "tmp", "public");
    }));
    return res.code(201).send({
        status: "success",
        message: "Project created",
    });
});
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.projectId)
        return res
            .code(400)
            .send({ status: "error", message: "Project id is required" });
    const project = yield getProjectByIdFn(req.params.projectId, req.prisma);
    return res.code(200).send({ status: "success", data: project });
});
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield getProjectsFn(req.prisma);
    return res.code(200).send({ status: "success", data: projects });
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.projectId)
        return res
            .code(404)
            .send({ status: "error", message: "Project id is required" });
    yield deleteProjectFn(req.params.projectId, req.prisma);
    return res.code(200).send({ status: "success", message: "Project deleted" });
});
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if project exist
    const missingFields = requestFieldChecker(["projectId", "title", "tags", "context", "media"], req);
    if (missingFields.length > 0)
        return res.code(400).send({
            status: "error",
            message: "Missing required fields",
            error: missingFields,
        });
    try {
        yield updateProjectFn({
            projectId: req.body.projectId,
            title: req.body.title,
            tags: req.body.tags || [],
            context: req.body.context,
            media: req.body.media,
        }, req.prisma);
    }
    catch (error) {
        return res
            .code(500)
            .send({ status: "success", message: "Unexpected Error Occured", error });
    }
    req.body.media.forEach((elem) => {
        moveFile([elem.filename], "tmp", "public");
    });
    return res.code(200).send({ status: "success", message: "Project updated" });
});
const projectLikeToggle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield projectLikeToggleFn({ userId: req.userId, projectId: req.params.projectId }, req.prisma);
    }
    catch (error) {
        console.log(error);
        return res.code(500).send({
            status: "fail",
            message: "Unexpected Error Occured",
            error: error.message,
        });
    }
    return res.code(200).send({ status: "success", message: "Project liked" });
});
const projectController = {
    createProject,
    getProjectById,
    getProjects,
    deleteProject,
    updateProject,
    projectLikeToggle,
};
export default projectController;
