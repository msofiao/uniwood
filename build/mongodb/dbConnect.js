var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
export class MongodbInstane {
    getDbInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!MongodbInstane.dbInstance) {
                MongodbInstane.dbInstance = yield (yield MongodbInstane.client.connect()).db(process.env.DATABASE_NAME);
                console.log("Database Connected");
                // MongodbInstane.dbInstance = MongodbInstane.client.db("uniwood");
            }
            return MongodbInstane.dbInstance;
        });
    }
}
MongodbInstane.client = new MongoClient(process.env.DATABASE_URL);
