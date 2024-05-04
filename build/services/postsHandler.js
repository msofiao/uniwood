var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { removeFiles, storeFile } from "../utils/fileManager.ts";
// *This Multipart consumer is for posts with meedia that contains each caption in the image
/**
 * Multipart Consumer for arbitrary numner of files and fields
 * body type = Record<string, string> & media: {caption?: string, filename: string}[]
 * ? Client Side must have a field in the form Data for uploading medias ie. caption-[hash], image-[hash], video-[hash]
 * @param req
 * @param res
 * @returns
 */
export function postsCustomMultipartConsumer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        console.log({ isMultipart: req.isMultipart() });
        if (!req.isMultipart() || req.isMultipart() === undefined)
            return;
        const parts = req.parts();
        let body = {};
        const media = {};
        try {
            try {
                for (var _d = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = yield parts_1.next(), _a = parts_1_1.done, !_a; _d = true) {
                    _c = parts_1_1.value;
                    _d = false;
                    const part = _c;
                    if (part.type === "field") {
                        console.log({ field: true, fields: part.fieldname });
                        if (part.fieldname.includes("caption-")) {
                            const hash = part.fieldname.split("-")[1];
                            if (media[hash] === undefined)
                                media[hash] = { caption: part.value, filename: null };
                            media[hash].caption = part.value;
                        }
                        else if (part.fieldname === "tags" &&
                            typeof part.value === "string") {
                            const tags = part.value.replace(/(\s|\[|\]|#)/g, "").split(",");
                            body[part.fieldname] = tags;
                        }
                        else
                            body[part.fieldname] = part.value;
                    }
                    if (part.type === "file") {
                        console.log(`file Entered: ${part.fieldname}`);
                        if (part.file.truncated)
                            return res.status(413).send({ message: "File too large" });
                        if (part.fieldname.includes("image-") ||
                            part.fieldname.includes("video-")) {
                            const hash = part.fieldname.split("-")[1];
                            if (media[hash] === undefined)
                                media[hash] = {
                                    caption: null,
                                    filename: (yield storeFile(part, "tmp")).filename,
                                };
                            else
                                media[hash].filename = (yield storeFile(part, "tmp")).filename;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = parts_1.return)) yield _b.call(parts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            req.body = Object.assign(Object.assign({}, body), { media: Object.values(media).filter((elem) => elem.filename !== null) });
            console.log({ body: req.body });
        }
    });
}
export function postPostOnresponseHander(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove Files From Temp Folder
        if (res.statusCode === 201)
            return;
        req.body.media.forEach((elem) => {
            if (elem.filename !== null)
                removeFiles([elem.filename], "tmp");
        });
    });
}
/**
 * Remove Files From Temp Folder
 */
export function postPutOnresponseHander(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove Files From Temp Folder
        if (res.statusCode === 200)
            return;
        if (!req.body.media)
            return;
        req.body.media.forEach((elem) => {
            if (elem.filename !== null)
                removeFiles([elem.filename], "tmp");
        });
    });
}
