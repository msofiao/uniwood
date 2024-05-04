var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { rename, unlink } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
/**
 * Stores a file a the server folder
 *
 * @param multFile multipart file
 * @param location  sets the location of the file 'public' (default) for server/public dir and 'private' for server/private dir
 * @returns promise from the pipeline stream
 */
export function storeFile(multFile_1) {
    return __awaiter(this, arguments, void 0, function* (multFile, location = "public") {
        if (multFile == undefined) {
            throw Error("undefined argument");
        }
        const extension = multFile.filename.substring(multFile.filename.lastIndexOf(".") + 1);
        // If file is empty
        if (!extension)
            throw Error("File is empty");
        const filename = randomBytes(86).toString("base64url");
        try {
            yield pipeline(multFile.file, createWriteStream(path.join(import.meta.dirname, `../${location}/${filename}.${extension}`)));
        }
        catch (error) {
            throw error;
        }
        return {
            filename: `${filename}.${extension}`,
            location,
            mimetype: multFile.mimetype,
            fieldname: multFile.fieldname,
            encoding: multFile.encoding,
            extension,
        };
    });
}
/**
 * Cleans a folder by deleting all files in it
 *
 * @param filesInfo array of files to delete or a filename
 * @param folder folder to delete the files from
 */
export function removeFiles(filesInfo = [], folder = "tmp") {
    filesInfo.forEach((filesInfo) => {
        console.log({ filesInfo });
        if (filesInfo === undefined)
            return;
        if (typeof filesInfo === "string")
            return unlink(path.resolve(import.meta.dirname, `../${folder}/${filesInfo}`));
        unlink(path.resolve(import.meta.dirname, `../${folder}/${filesInfo.filename}`));
    });
}
/**
 * Move Temporary File to public or private folder
 * @param filesInfo
 * @param currentFolder folder where the file is currently located
 * @param targetFolder folder where the file will be moved
 */
export function moveFile(filesInfo_1) {
    return __awaiter(this, arguments, void 0, function* (filesInfo, currentFolder = "tmp", targetFolder = "public") {
        filesInfo.forEach((fileInfo) => __awaiter(this, void 0, void 0, function* () {
            console.log({ fileInfo });
            if (!fileInfo)
                return;
            if (typeof fileInfo !== "string") {
                yield rename(path.resolve(import.meta.dirname, `../${currentFolder}/${fileInfo.filename}`), path.resolve(import.meta.dirname, `../${targetFolder}/${fileInfo.filename}`));
            }
            else {
                yield rename(path.resolve(import.meta.dirname, `../${currentFolder}/${fileInfo}`), path.resolve(import.meta.dirname, `../${targetFolder}/${fileInfo}`));
            }
        }));
    });
}
