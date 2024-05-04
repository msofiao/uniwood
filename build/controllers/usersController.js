var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { hash } from "bcrypt";
import { ObjectId } from "mongodb";
import { moveFile, capitalize, constantToCapitalize, createAccessToken, createRefreshToken, sendRefreshToken, } from "../utils";
import { isValidObjectId } from "../utils/checker";
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Check if Email
    const emailExist = yield req.prisma.user.findUnique({
        where: { email: req.body.email },
        include: { credential: true },
    });
    if (emailExist)
        return res.status(409).send({
            status: "fail",
            error: "ValidationError",
            errorFields: [{ field: "email", message: "Email already exist" }],
        });
    // Check if username exist
    const usernameExist = yield req.prisma.user.findUnique({
        where: { username: req.body.username },
    });
    if (usernameExist)
        return res.status(409).send({
            status: "fail",
            error: "ValidationError",
            errorFields: [{ field: "username", message: "Username already exist" }],
        });
    // TODO Add a valition
    // TODO Add a default PFP and Cover image
    // hash Password
    const hashedPassword = yield hash(req.body.password.replace(" ", ""), 10);
    const userId = new ObjectId().toHexString();
    // Create User & Credential
    try {
        yield req.prisma.user.create({
            data: {
                id: userId,
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase().replace(/w/, ""),
                firstname: req.body.firstname.replace(/w(2, )/, " ").trim(),
                middlename: req.body.middlename.replace(/w(2, )/, " ").trim(),
                lastname: req.body.lastname.replace(/w(2, )/, " ").trim(),
                bio: (_a = req.body.bio) === null || _a === void 0 ? void 0 : _a.replace(/w(2, )/, " ").trim(),
                date_of_Birth: new Date(req.body.dateOfBirth),
                gender: req.body.gender.toUpperCase(),
                role: "USER",
                address: {
                    barangay: req.body.barangay.replace(/w(2, )/, " ").trim(),
                    municipality: req.body.municipality.replace(/w(2, )/, " ").trim(),
                    province: req.body.province.replace(/w(2, )/, " ").trim(),
                },
                affiliation: req.body.affiliation
                    .toUpperCase()
                    .replace(" ", "_"),
                user_image: {
                    pfp_name: (_d = (_c = (_b = req.body) === null || _b === void 0 ? void 0 : _b.pfp) === null || _c === void 0 ? void 0 : _c.filename) !== null && _d !== void 0 ? _d : "default-pfp.jpg", // TODO add default pfp
                    cover_name: (_g = (_f = (_e = req.body) === null || _e === void 0 ? void 0 : _e.cover) === null || _f === void 0 ? void 0 : _f.filename) !== null && _g !== void 0 ? _g : "default-cover.jpg", // TODO add default cover
                },
                credential: {
                    create: {
                        email: req.body.email.toLowerCase(),
                        password: hashedPassword,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "fail",
            message: "Internal Server Error",
        });
    }
    // Move files to public folder
    moveFile([(_h = req.body) === null || _h === void 0 ? void 0 : _h.pfp, (_j = req.body) === null || _j === void 0 ? void 0 : _j.cover], "tmp", "public");
    const accessToken = createAccessToken({
        email: req.body.email,
        id: userId,
        username: req.body.username,
        userFullname: capitalize(`${req.body.firstname} ${req.body.lastname}`),
    });
    const refreshToken = createRefreshToken({
        email: req.body.email,
        id: userId,
    });
    sendRefreshToken(refreshToken, res);
    return res.code(201).send({
        status: "success",
        message: "User Successfully Created",
        data: {
            id: userId,
            accessToken: accessToken,
        },
    });
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    // TODO Add authorization if the user is the same as the one updating or an Admin
    // Check if id exist
    if (req.body.id === undefined)
        return res.status(400).send({ status: "fail", message: "Missing User Id" });
    // Check if user exist
    let userExist = yield req.prisma.user.findUnique({
        where: { id: req.body.id },
        include: { credential: true },
    });
    if (!userExist) {
        userExist = yield req.prisma.user.findUnique({
            where: { username: req.body.id },
            include: { credential: true },
        });
    }
    if (!userExist)
        return res.status(404).send({
            status: "fail",
            message: "User not found",
        });
    // TODO Add validation
    // Update USER
    const hashedPassword = req.body.password && (yield hash(req.body.password, 10));
    try {
        yield req.prisma.user.update({
            where: { id: req.body.id },
            data: {
                username: (_k = req.body.username) !== null && _k !== void 0 ? _k : userExist.username,
                firstname: (_l = req.body.firstname) !== null && _l !== void 0 ? _l : userExist.firstname,
                middlename: (_m = req.body.middlename) !== null && _m !== void 0 ? _m : userExist.middlename,
                lastname: (_o = req.body.lastname) !== null && _o !== void 0 ? _o : userExist.lastname,
                bio: (_p = req.body.bio) !== null && _p !== void 0 ? _p : userExist.bio,
                date_of_Birth: new Date(req.body.dateOfBirth || userExist.date_of_Birth),
                gender: (_q = req.body.gender) !== null && _q !== void 0 ? _q : userExist.gender,
                address: {
                    update: {
                        barangay: (_r = req.body.barangay) !== null && _r !== void 0 ? _r : userExist.address.barangay,
                        municipality: (_s = req.body.municipality) !== null && _s !== void 0 ? _s : userExist.address.municipality,
                        province: (_t = req.body.province) !== null && _t !== void 0 ? _t : userExist.address.province,
                    },
                },
                affiliation: (_u = req.body.affiliation) !== null && _u !== void 0 ? _u : userExist.affiliation,
                user_image: {
                    pfp_name: (_w = (_v = req.body.pfp) === null || _v === void 0 ? void 0 : _v.filename) !== null && _w !== void 0 ? _w : userExist.user_image.pfp_name,
                    cover_name: (_y = (_x = req.body.cover) === null || _x === void 0 ? void 0 : _x.filename) !== null && _y !== void 0 ? _y : userExist.user_image.cover_name,
                },
                credential: {
                    update: {
                        email: (_z = req.body.email) !== null && _z !== void 0 ? _z : (_0 = userExist === null || userExist === void 0 ? void 0 : userExist.credential) === null || _0 === void 0 ? void 0 : _0.email,
                        password: hashedPassword !== null && hashedPassword !== void 0 ? hashedPassword : (_1 = userExist === null || userExist === void 0 ? void 0 : userExist.credential) === null || _1 === void 0 ? void 0 : _1.password,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.code(500).send({
            status: "fail",
            error: "DBError",
            message: "Internal Server Error",
        });
    }
    // Delete old Files
    // if (req.body.pfp) removeFiles([userExist.user_image.pfp_name], "public");
    // if (req.body.cover) removeFiles([userExist.user_image.cover_name], "public");
    // Move files to public folder
    moveFile([(_2 = req.body) === null || _2 === void 0 ? void 0 : _2.pfp, (_3 = req.body) === null || _3 === void 0 ? void 0 : _3.cover], "tmp", "public");
    return res.send({ status: "success", message: "User Successfully Updated" });
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Add authorization if the user is the same as the one deleting or an Admin
    // Check if id exist
    if (req.body.id == null)
        return res.status(400).send({ status: "fail", message: "Missing User Id" });
    // Check if user exist
    const userExist = yield req.prisma.user.findUnique({
        where: { id: req.body.id },
    });
    if (!userExist)
        return res.status(404).send({
            status: "fail",
            message: "User not found",
        });
    // Delete User
    const deleteUser = yield req.prisma.user.delete({
        where: { id: req.body.id },
        select: { id: true }
    });
    return res.send({
        status: "success",
        message: "User Successfully Deleted",
        data: {
            id: deleteUser.id,
        }
    });
});
const getAllusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Add authorization if the user is the same as the one deleting or an Admin
    const allusers = yield req.prisma.user.findMany({});
    return res.send({
        status: "success",
        message: "Successfully fetched all users",
        data: allusers,
    });
});
const getNewUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Add authorization if the user is the same as the one deleting or an Admin
    const allusers = yield req.prisma.user.findMany({
        take: parseInt(req.query.count),
        orderBy: { date_joined: "desc" },
        select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            user_image: true,
            address: true,
            affiliation: true,
            bio: true,
        },
    });
    let data = allusers.map((user) => {
        return {
            id: user.id,
            username: user.username,
            fullname: capitalize(`${user.firstname} ${user.lastname}`),
            cover: user.user_image.cover_name,
            pfp: user.user_image.pfp_name,
            address: capitalize(`${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`),
            bio: user.bio,
            affiliation: constantToCapitalize(user.affiliation),
        };
    });
    return res.send({
        status: "success",
        message: "Successfully fetched all users",
        data: data,
    });
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Add authorization if the user is logged
    // Check if id exist
    if (req.params.id == null)
        return res.status(400).send({ status: "fail", message: "Missing User Id" });
    // Check get user
    let user;
    try {
        if (isValidObjectId(req.params.id)) {
            user = yield req.prisma.user.findFirst({
                where: {
                    id: req.params.id,
                },
                include: {
                    followers: {
                        select: {
                            id: true,
                        },
                    },
                    following: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
        }
        else {
            console.log("Finding by username");
            user = yield req.prisma.user.findFirst({
                where: {
                    username: req.params.id,
                },
                include: {
                    followers: {
                        select: {
                            id: true,
                        },
                    },
                    following: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "fail",
            message: "User not found",
        });
    }
    if (!user) {
        return res.status(404).send({
            status: "fail",
            message: "User not found",
        });
    }
    return res.send({
        status: "success",
        message: "Successfully fetched user",
        data: {
            id: user.id,
            fullname: capitalize(`${user.firstname} ${user.lastname}`),
            cover: user.user_image.cover_name,
            pfp: user.user_image.pfp_name,
            address: capitalize(`${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`),
            username: user.username,
            bio: user.bio,
            dateOfBirth: user.date_of_Birth,
            affiliation: constantToCapitalize(user.affiliation),
            gender: constantToCapitalize(user.gender),
            email: user.email,
            followersCount: user.followers.length,
            followingCount: user.following.length,
        },
    });
});
const getUserRawData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield req.prisma.user.findUnique({
        where: { username: req.params.usernameOrId },
        select: {
            id: true,
            username: true,
            firstname: true,
            middlename: true,
            lastname: true,
            bio: true,
            date_of_Birth: true,
            user_image: true,
            address: true,
            affiliation: true,
            gender: true,
        },
    });
    if (isValidObjectId(req.params.usernameOrId) && !user) {
        user = yield req.prisma.user.findUnique({
            where: { id: req.params.usernameOrId },
            select: {
                id: true,
                username: true,
                firstname: true,
                middlename: true,
                lastname: true,
                bio: true,
                date_of_Birth: true,
                user_image: true,
                address: true,
                gender: true,
                affiliation: true,
            },
        });
    }
    if (!user)
        return res.status(404).send({
            status: "fail",
            message: "User not found",
        });
    let userdata = {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        bio: user.bio,
        dateOfBirth: user.date_of_Birth,
        pfp: user.user_image.pfp_name,
        cover: user.user_image.cover_name,
        affiliation: constantToCapitalize(user.affiliation),
        gender: constantToCapitalize(user.gender),
        province: capitalize(user.address.province),
        municipality: capitalize(user.address.municipality),
        barangay: capitalize(user.address.barangay),
    };
    return res.code(200).send({
        status: "success",
        message: "Successfully fetched user",
        data: userdata,
    });
});
const getRecommendedAccountsForNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO add algorithm to get recommended accounts for new Users
    let recommendedAccountsDocs = yield req.prisma.user.findMany({
        take: parseInt("5"),
        select: {
            id: true,
            firstname: true,
            lastname: true,
            bio: true,
            email: true,
            user_image: true,
            address: true,
            date_of_Birth: true,
            gender: true,
            username: true,
            affiliation: true,
        },
    });
    recommendedAccountsDocs = recommendedAccountsDocs.filter((rmAccount) => rmAccount.id !== req.userId);
    const recommendedAccounts = recommendedAccountsDocs.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: capitalize(`${user.firstname} ${user.lastname}`),
        cover: user.user_image.cover_name,
        gender: user.gender,
        pfp: user.user_image.pfp_name,
        affiliation: constantToCapitalize(user.affiliation),
        address: capitalize(`${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`),
        bio: user.bio,
        dateOfBirth: user.date_of_Birth,
    }));
    return res.code(200).send({ status: "success", recommendedAccounts });
});
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.prisma.user.update({
            where: { id: req.userId },
            data: {
                following: {
                    connect: { id: req.query.userId },
                },
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "fail",
            error: "Database Erorr",
            message: "Unable to follow user",
        });
    }
    return res
        .code(200)
        .send({ status: "success", message: "Successfully followed" });
});
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.prisma.user.update({
            where: { id: req.userId },
            data: {
                following: {
                    disconnect: { id: req.query.userId },
                },
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.code(500).send({
            status: "fail",
            error: "Database Error",
            message: "Unable to unfollow user",
        });
    }
    return res
        .code(200)
        .send({ status: "success", message: "Successfully unfollowed" });
});
const addInterests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // To lowercase
    req.body.interests = req.body.interests.map((interest) => interest.toLowerCase());
    try {
        let eInterestDoc = yield req.prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                interests: true,
            },
        });
        if (eInterestDoc == null)
            throw Error("User not found");
        eInterestDoc.interests.forEach((interest) => {
            if (!req.body.interests.includes(interest)) {
                req.body.interests.push(interest);
            }
        });
        // Save Interest
        yield req.prisma.user.update({
            where: { id: req.userId },
            data: {
                interests: {
                    set: req.body.interests,
                },
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "fail",
            error: "DB Error",
            message: error,
        });
    }
    return res
        .code(200)
        .send({ status: "success", message: "Successfully added interests" });
});
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let usersDoc = yield req.prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: req.query.q,
                        mode: "insensitive",
                    },
                },
                {
                    firstname: {
                        contains: req.query.q,
                        mode: "insensitive",
                    },
                },
                {
                    lastname: {
                        contains: req.query.q,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });
    let parsedUsersData = usersDoc.map((user) => {
        return {
            id: user.id,
            fullname: capitalize(`${user.firstname} ${user.lastname}`),
            affiliation: constantToCapitalize(user.affiliation),
            bio: user.bio || "",
            dateOfBirth: user.date_of_Birth.toDateString(),
            gender: constantToCapitalize(user.gender),
            address: capitalize(`${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`),
            email: user.email,
            username: user.username,
            pfp: user.user_image.pfp_name,
            cover: user.user_image.cover_name,
        };
    });
    return res.code(200).send({ status: "success", data: parsedUsersData });
});
const verifyUserIfFollowed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetUserDoc = yield req.prisma.user.findFirst({
        where: {
            id: req.query.targetUser,
        },
        select: {
            id: true,
        },
    });
    if (!targetUserDoc)
        return res
            .code(404)
            .send({ status: "success", data: { isFollowed: false } });
    const isFollowed = yield req.prisma.user.findFirst({
        where: {
            id: req.userId,
            following_ids: {
                has: targetUserDoc.id,
            },
        },
        select: {
            id: true,
        },
    });
    if (!isFollowed)
        return res
            .code(404)
            .send({ status: "success", data: { isFollowed: false } });
    return res.code(200).send({ status: "success", data: { isFollowed: true } });
});
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let followersDoc;
    if (isValidObjectId(req.query.targetUserId)) {
        followersDoc = yield req.prisma.user.findUnique({
            where: { id: req.query.targetUserId },
            select: {
                followers: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                        user_image: true,
                        bio: true,
                        address: true,
                        affiliation: true,
                    },
                },
            },
        });
    }
    else {
        followersDoc = yield req.prisma.user.findUnique({
            where: { username: req.query.targetUserId },
            select: {
                followers: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                        user_image: true,
                        bio: true,
                        address: true,
                        affiliation: true,
                    },
                },
            },
        });
    }
    const userFollowedAccountsDoc = yield req.prisma.user.findUnique({
        where: { id: req.userId },
        select: {
            following: {
                select: {
                    id: true,
                },
            },
        },
    });
    const parsedFollowersData = followersDoc === null || followersDoc === void 0 ? void 0 : followersDoc.followers.map((follower) => {
        var _a;
        return {
            id: follower.id,
            fullname: capitalize(`${follower.firstname} ${follower.lastname}`),
            username: follower.username,
            pfp: follower.user_image.pfp_name,
            cover: follower.user_image.cover_name,
            bio: follower.bio,
            address: capitalize(`${follower.address.barangay}, ${follower.address.municipality}, ${follower.address.province}`),
            affiliation: constantToCapitalize(follower.affiliation),
            followedByTheUer: (_a = userFollowedAccountsDoc === null || userFollowedAccountsDoc === void 0 ? void 0 : userFollowedAccountsDoc.following.some((userFollowedAcc) => userFollowedAcc.id === follower.id)) !== null && _a !== void 0 ? _a : false,
        };
    });
    return res.code(200).send({ status: "success", data: parsedFollowersData });
});
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let followingDoc;
    if (isValidObjectId(req.query.targetUserId)) {
        followingDoc = yield req.prisma.user.findUnique({
            where: { id: req.query.targetUserId },
            select: {
                following: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                        user_image: true,
                        bio: true,
                        address: true,
                        affiliation: true,
                    },
                },
            },
        });
    }
    else {
        followingDoc = yield req.prisma.user.findUnique({
            where: { username: req.query.targetUserId },
            select: {
                following: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        username: true,
                        user_image: true,
                        bio: true,
                        address: true,
                        affiliation: true,
                    },
                },
            },
        });
    }
    const parsedFollowersData = followingDoc === null || followingDoc === void 0 ? void 0 : followingDoc.following.map((follower) => {
        return {
            id: follower.id,
            fullname: capitalize(`${follower.firstname} ${follower.lastname}`),
            username: follower.username,
            pfp: follower.user_image.pfp_name,
            cover: follower.user_image.cover_name,
            bio: follower.bio,
            address: capitalize(`${follower.address.barangay}, ${follower.address.municipality}, ${follower.address.province}`),
            affiliation: constantToCapitalize(follower.affiliation),
        };
    });
    console.log({ parsedFollowersData });
    return res.code(200).send({ status: "success", data: parsedFollowersData });
});
const userController = {
    createUser,
    updateUser,
    deleteUser,
    getAllusers,
    getUser,
    getUserRawData,
    getNewUsers,
    getRecommendedAccountsForNewUser,
    followUser,
    unfollowUser,
    addInterests,
    searchUsers,
    verifyUserIfFollowed,
    getFollowings,
    getFollowers,
};
export default userController;
