import { PrismaClient } from "@prisma/client";
class GetPrismaInstance {
    static getPrismaInstance() {
        return this.prismaInstance;
    }
}
// static prismaInstance = new PrismaClient();
GetPrismaInstance.myString = "Hello World!";
GetPrismaInstance.prismaInstance = new PrismaClient();
const prisma = GetPrismaInstance.myString;
console.log({ prisma: GetPrismaInstance.getPrismaInstance() });
console.log("Hello World!");
