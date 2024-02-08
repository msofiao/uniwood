import { Affiliation, Proffeciency, Role, Gender } from "@prisma/client";
import { FastifyReply } from "fastify";
import { FastifyRequest } from "../types/fastify";
import { hash } from "bcrypt";

import { FileInfo } from "../types/global";
import { moveFile, capitalize, constantToCapitalize } from "../utils";
import { isValidObjectId } from "../utils/checker";

const createUser = async (
  req: FastifyRequest<{ Body: UserPostBody }>,
  res: FastifyReply
) => {
  // Check if Email
  const emailExist = await req.prisma.user.findUnique({
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
  const usernameExist = await req.prisma.user.findUnique({
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
  const hashedPassword = await hash(req.body.password.replace(" ", ""), 10);

  // Create User & Credential
  try {
    await req.prisma.user.create({
      data: {
        email: req.body.email.toLowerCase(),
        username: req.body.username.toLowerCase().replace(/w/, ""),
        firstname: req.body.firstname.replace(/w(2, )/, " ").trim(),
        middlename: req.body.middlename.replace(/w(2, )/, " ").trim(),
        lastname: req.body.lastname.replace(/w(2, )/, " ").trim(),
        bio: req.body.bio?.replace(/w(2, )/, " ").trim(),
        date_of_Birth: new Date(req.body.dateOfBirth),
        gender: req.body.gender.toUpperCase() as Gender,
        role: "USER",
        address: {
          barangay: req.body.barangay.replace(/w(2, )/, " ").trim(),
          municipality: req.body.municipality.replace(/w(2, )/, " ").trim(),
          province: req.body.province.replace(/w(2, )/, " ").trim(),
        },
        proffeciency: req.body.proffeciency
          .toUpperCase()
          .replace(" ", "_") as Proffeciency,
        affiliation: req.body.affiliation
          .toUpperCase()
          .replace(" ", "_") as Affiliation,
        user_image: {
          pfp_name: req.body?.pfp?.filename ?? "default-pfp.jpg", // TODO add default pfp
          cover_name: req.body?.cover?.filename ?? "default-cover.jpg", // TODO add default cover
        },
        credential: {
          create: {
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "fail",
      message: "Internal Server Error",
    });
  }

  // Move files to public folder
  moveFile([req.body?.pfp, req.body?.cover], "tmp", "public");

  return res.code(201).send({
    status: "success",
    message: "User Successfully Created",
  });
};

const updateUser = async (
  req: FastifyRequest<{ Body: UserPutBody }>,
  res: FastifyReply
) => {
  // TODO Add authorization if the user is the same as the one updating or an Admin
  // Check if id exist
  if (req.body.id === undefined)
    return res.status(400).send({ status: "fail", message: "Missing User Id" });

  // Check if user exist
  let userExist = await req.prisma.user.findUnique({
    where: { id: req.body.id },
    include: { credential: true },
  });
  if (!userExist) {
    userExist = await req.prisma.user.findUnique({
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
  const hashedPassword =
    req.body.password && (await hash(req.body.password, 10));
  try {
    await req.prisma.user.update({
      where: { id: req.body.id },
      data: {
        username: req.body.username ?? userExist.username,
        firstname: req.body.firstname ?? userExist.firstname,
        middlename: req.body.middlename ?? userExist.middlename,
        lastname: req.body.lastname ?? userExist.lastname,
        bio: req.body.bio ?? userExist.bio,
        date_of_Birth: new Date(
          req.body.dateOfBirth || userExist.date_of_Birth
        ),
        gender: req.body.gender ?? userExist.gender,
        address: {
          update: {
            barangay: req.body.barangay ?? userExist.address.barangay,
            municipality:
              req.body.municipality ?? userExist.address.municipality,
            province: req.body.province ?? userExist.address.province,
          },
        },
        proffeciency: req.body.profeciency ?? userExist.proffeciency,
        affiliation: req.body.affiliation ?? userExist.affiliation,
        user_image: {
          pfp_name: req.body.pfp?.filename ?? userExist.user_image.pfp_name,
          cover_name:
            req.body.cover?.filename ?? userExist.user_image.cover_name,
        },
        credential: {
          update: {
            email: req.body.email ?? userExist?.credential?.email,
            password: hashedPassword ?? userExist?.credential?.password,
          },
        },
      },
    });
  } catch (error) {
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
  moveFile([req.body?.pfp, req.body?.cover], "tmp", "public");

  return res.send({ status: "success", message: "User Successfully Updated" });
};

const deleteUser = async (
  req: FastifyRequest<{ Body: { id: string } }>,
  res: FastifyReply
) => {
  // TODO Add authorization if the user is the same as the one deleting or an Admin
  // Check if id exist
  if (req.body.id == null)
    return res.status(400).send({ status: "fail", message: "Missing User Id" });

  // Check if user exist
  const userExist = await req.prisma.user.findUnique({
    where: { id: req.body.id },
  });
  if (!userExist)
    return res.status(404).send({
      status: "fail",
      message: "User not found",
    });

  // Delete User
  const deleteUser = await req.prisma.user.delete({
    where: { id: req.body.id },
  });

  return res.send({
    status: "success",
    message: "User Successfully Deleted",
  });
};

const getAllusers = async (req: FastifyRequest, res: FastifyReply) => {
  // TODO Add authorization if the user is the same as the one deleting or an Admin

  const allusers = await req.prisma.user.findMany({});
  return res.send({
    status: "success",
    message: "Successfully fetched all users",
    data: allusers,
  });
};
const getNewUsers = async (
  req: FastifyRequest<{ Querystring: { count: string } }>,
  res: FastifyReply
) => {
  // TODO Add authorization if the user is the same as the one deleting or an Admin

  const allusers = await req.prisma.user.findMany({
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
      address: capitalize(
        `${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`
      ),
      bio: user.bio,
      affiliation: constantToCapitalize(user.affiliation),
    };
  });
  return res.send({
    status: "success",
    message: "Successfully fetched all users",
    data: data,
  });
};

const getUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) => {
  // TODO Add authorization if the user is logged

  // Check if id exist
  if (req.params.id == null)
    return res.status(400).send({ status: "fail", message: "Missing User Id" });
  // Check get user
  let user;
  try {
    user = await req.prisma.user.findUnique({
      where: {
        username: req.params.id,
      },
    });

    if (isValidObjectId(req.params.id) && !user)
      user = await req.prisma.user.findUnique({
        where: { id: req.params.id },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "fail",
      message: "User not found",
    });
  }

  if (!user)
    return res.status(404).send({
      status: "fail",
      message: "User not found",
    });

  return res.send({
    status: "success",
    message: "Successfully fetched user",
    data: {
      id: user.id,
      fullname: capitalize(`${user.firstname} ${user.lastname}`),
      cover: user.user_image.cover_name,
      pfp: user.user_image.pfp_name,
      address: capitalize(
        `${user.address.barangay}, ${user.address.municipality}, ${user.address.province}`
      ),
      username: user.username,
      bio: user.bio,
      dateOfBirth: user.date_of_Birth,
      proffeciency: constantToCapitalize(user.proffeciency),
      Affiliation: constantToCapitalize(user.affiliation),
      gender: constantToCapitalize(user.gender),
      email: user.email,
    },
  });
};

const getUserRawData = async (
  req: FastifyRequest<{ Params: { usernameOrId: string }; Body: any }>,
  res: FastifyReply
) => {
  let user = await req.prisma.user.findUnique({
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
    user = await req.prisma.user.findUnique({
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
};

// TODO Create Search User Controller

export interface UserPostBody {
  username: string;
  email: string;
  firstname: string;
  middlename: string;
  lastname: string;
  bio: string | null;
  dateOfBirth: Date;
  gender: Gender;
  role: Role;
  proffeciency: Proffeciency;
  affiliation: Affiliation;
  password: string;
  pfp: FileInfo | undefined;
  cover: FileInfo | undefined;
  barangay: string;
  municipality: string;
  province: string;
}
// ? Remove properties with null values in the client side
export interface UserPutBody {
  id: string;
  username?: string;
  email?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  password?: string;
  bio?: string;
  gender?: Gender;
  barangay?: string;
  municipality?: string;
  province?: string;
  profeciency?: Proffeciency;
  affiliation?: Affiliation;
  pfp?: FileInfo | undefined;
  dateOfBirth?: Date;
  cover?: FileInfo | undefined;
}

const userController = {
  createUser,
  updateUser,
  deleteUser,
  getAllusers,
  getUser,
  getUserRawData,
  getNewUsers,
};

export default userController;
