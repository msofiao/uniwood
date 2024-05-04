var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { removeFiles } from "../utils/fileManager";
export function usersPostOnResponseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove Files From Temp Folder
        if (res.statusCode === 201)
            return;
        removeFiles([req.body.pfp, req.body.cover], "tmp");
    });
}
export function userPutOnResponseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove Files From Temp Folder
        if (res.statusCode === 200)
            return;
        removeFiles([req.body.pfp, req.body.cover], "tmp");
    });
}
