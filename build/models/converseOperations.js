var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
/**
 * Updates the unread messsages count of a conversation
 * @param user_id user to update the unread messages
 * @param conversationId
 * @returns
 */
const prisma = new PrismaClient();
export const updateUnreadMessagesCount = (user_id, conversation_id) => __awaiter(void 0, void 0, void 0, function* () {
    const converseExist = yield converseDocExistsById(conversation_id);
    console.log({ converseExist });
    if (!converseExist)
        throw new Error("Converse document not found");
    return yield prisma.converse.update({
        where: { id: conversation_id },
        data: {
            unread: {
                updateMany: {
                    where: { user_id: user_id },
                    data: {
                        count: 0,
                    },
                },
            },
        },
    });
});
export const converseDocExistsById = (converes_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.converse.findFirst({
        where: {
            id: converes_id,
        },
    });
});
export const converseDocExistByMessengersId = (messengersId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.converse.findFirst({
        where: {
            messengers_id: {
                hasEvery: messengersId,
            },
        },
        select: {
            id: true,
        },
    });
});
