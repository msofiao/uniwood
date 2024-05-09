import { PrismaClient } from "@prisma/client";
class GetPrismaInstance {
    // static prismaInstance = new PrismaClient();
    static myString = "Hello World!";
    static prismaInstance = new PrismaClient();
    static getPrismaInstance() {
        return this.prismaInstance;
    }
}
console.log({ prisma: GetPrismaInstance.getPrismaInstance() });
console.log("Hello World!");
