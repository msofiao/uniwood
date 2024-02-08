import { PostMedia } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "../types/fastify";
import { createPost as createPostQuery } from "../models/postQuery";
import { moveFile } from "../utils/fileManager";
import { likePostTogggle as likePostToggleFnc } from "../models/postQuery";
import { isValidObjectId } from "../utils/checker";
import { capitalize } from "../utils";

const createPost = async (
  req: FastifyRequest<{ Body: PostPostBody }>,
  res: FastifyReply
) => {
  const userId = req.userId; // Edit from "string" to "req.user.id

  // TODO add validation
  if (!userId)
    return res.code(401).send({
      status: "fail",
      message: "User is unauthorize. Access token not read",
    });

  // Create Post
  try {
    await createPostQuery({ ...req.body, userId }, req.prisma);
  } catch (error) {
    console.error(error);
    return res.code(500).send({ status: "fail", message: "Internal Error" });
  }
  // Move tmp file to the public folder
  req.body.media.forEach(
    async (elem) => await moveFile([elem.filename], "tmp", "public")
  );
  return res.code(201).send({ status: "success", message: "Post created" });
};

const updatePost = async (
  req: FastifyRequest<{ Body: PostPutBody }>,
  res: FastifyReply
) => {
  if (!req.userId)
    return res
      .code(401)
      .send({ status: "fail", message: "User is not authorize" });

  //Check if post exist
  const postExist = await req.prisma.post.findUnique({
    where: { id: req.body.postId },
  });
  if (postExist === null)
    return res.code(404).send({ status: "fail", message: "Post not found" });

  // Check if post is belong to user or the admin
  if (postExist.author_id !== req.userId && req?.role !== "ADMIN")
    return res
      .code(403)
      .send({ status: "fail", message: "User is not authorize" });

  // Update post
  try {
    await req.prisma.post.update({
      where: { id: req.body.postId },
      data: {
        tags: req.body.tags ?? postExist.tags,
        media: req.body.media ?? postExist.media ?? [],
        context: req.body.context ?? postExist.context,
      },
    });
  } catch (error) {
    console.error(error);
    return res.code(500).send({ status: "fail", message: "Internal Error" });
  }

  // Move tmp file to the public folder
  if (req.body.media)
    req.body.media.forEach(
      async (elem) => await moveFile([elem.filename], "tmp", "public")
    );
  return res.code(200).send({ status: "success", message: "Post updated" });
};

const getPosts = async (req: FastifyRequest, res: FastifyReply) => {
  // TODO add validaton
  if (!req.userId)
    return res
      .code(401)
      .send({ status: "fail", message: "User is unauthorize" });

  // GET posts
  let posts: any | undefined;
  try {
    posts = await req.prisma.post.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        context: true,
        title: true,
        tags: true,
        media: true,
        createdAt: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            proffeciency: true,
            affiliation: true,
            user_image: {
              select: {
                pfp_name: true,
                cover_name: true,
              },
            },
          },
        },
        comments: {
          select: {
            content: true,
            createdAt: true,
            up_voted_by_users_id: true,
            author: {
              select: {
                firstname: true,
                lastname: true,
                proffeciency: true,
                affiliation: true,
                user_image: {
                  select: {
                    pfp_name: true,
                    cover_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(posts);
  } catch (error) {
    console.error(error);
    return res.code(500).send({ status: "fail", message: "Internal Error" });
  }
  console.log({ status: "success", data: posts });
  return res.code(200).send({ status: "success", data: posts });
};

const getAllUserPost = async (
  req: FastifyRequest<{ Params: { usernameOrId: string }; Body: any }>,
  res: FastifyReply
) => {
  let posts = await req.prisma.post.findMany({
    where: {
      author: {
        username: req.params.usernameOrId,
      },
      status: "ACTIVE",
    },
    select: {
      id: true,
      context: true,
      media: true,
      createdAt: true,
      title: true,
      tags: true,
      liked_by_users_id: true,
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          up_voted_by_users_id: true,
          down_voted_by_users_id: true,
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              bio: true,
              affiliation: true,
              user_image: true,
              address: true,
              username: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          bio: true,
          affiliation: true,
          user_image: true,
          address: true,
          username: true,
        },
      },
    },
  });

  if (isValidObjectId(req.params.usernameOrId) && posts.length === 0) {
    posts = await req.prisma.post.findMany({
      where: {
        author: {
          id: req.params.usernameOrId,
        },
      },
      select: {
        id: true,
        context: true,
        media: true,
        createdAt: true,
        title: true,
        tags: true,
        liked_by_users_id: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            up_voted_by_users_id: true,
            down_voted_by_users_id: true,
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                bio: true,
                affiliation: true,
                user_image: true,
                username: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            bio: true,
            affiliation: true,
            user_image: true,
            address: true,
            username: true,
          },
        },
      },
    });
  }

  if (!posts) {
    return res
      .code(404)
      .send({ status: "fail", message: "User not found by username" });
  }

  let data = posts.map((post) => {
    return {
      id: post.id,
      title: post.title,
      context: post.context,
      media: post.media,
      liked_by_users_id: post.liked_by_users_id,
      createdAt: post.createdAt,
      tags: post.tags,
      comments: post.comments.map((comment) => {
        return {
          id: comment.id, // Fix: Access the 'id' property from the 'comment' object
          content: comment.content,
          createdAt: comment.createdAt,
          up_voted_by_users_id: comment.up_voted_by_users_id,
          down_voted_by_users_id: comment.down_voted_by_users_id,
          author: {
            id: comment.author.id,
            fullname: capitalize(
              `${comment.author.firstname} ${comment.author.lastname}`
            ),
            bio: comment.author.bio,
            affiliation: comment.author.affiliation,
            cover: comment.author.user_image.cover_name,
            pfp: comment.author.user_image.pfp_name,
            address: comment.author.address,
            username: comment.author.username,
          },
        };
      }),
      author: {
        id: post.author.id,
        fullname: capitalize(
          `${post.author.firstname} ${post.author.lastname}`
        ),
        bio: post.author.bio,
        affiliation: post.author.affiliation,
        cover: post.author.user_image.cover_name,
        pfp: post.author.user_image.pfp_name,
        address: capitalize(
          `${post.author.address.barangay}, ${post.author.address.municipality}, ${post.author.address.province}`
        ),
        username: post.author.username,
      },
    };
  });

  return res.code(200).send({
    status: "success",
    data: data,
  });
};

const deletePost = async (
  req: FastifyRequest<{ Body: { postId: string | undefined } }>,
  res: FastifyReply
) => {
  // TODO add validation
  if (req.body.postId === undefined)
    return res
      .code(400)
      .send({ status: "fail", message: "Post id is required" });
  if (req.userId === undefined)
    return res
      .code(401)
      .send({ status: "fail", message: "User is unauthorize" });

  // Check if post exist
  const postExist = await req.prisma.post.findUnique({
    where: {
      id: req.body.postId,
    },
  });
  if (!postExist)
    return res.code(404).send({ status: "fail", message: "Post is not exist" });

  // Check if post is belong to user
  if (postExist.author_id !== req.userId)
    return res
      .code(403)
      .send({ status: "fail", message: "User is not authorize" });

  // delete post
  const deleteStatus = await req.prisma.post.update({
    where: {
      id: req.body.postId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  if (!deleteStatus)
    return res.code(500).send({ status: "fail", message: "Internal Error" });

  return res.code(200).send({ status: "success", message: "Post deleted" });
};

const getAllPosts = async (req: FastifyRequest, res: FastifyReply) => {
  const posts = await req.prisma.post.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      context: true,
      media: true,
      createdAt: true,
      title: true,
      tags: true,
      liked_by_users_id: true,
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          up_voted_by_users_id: true,
          down_voted_by_users_id: true,
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              bio: true,
              affiliation: true,
              user_image: true,
              address: true,
              username: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          bio: true,
          affiliation: true,
          user_image: true,
          address: true,
          username: true,
        },
      },
    },
  });

  let data = posts.map((post) => {
    return {
      id: post.id,
      title: post.title,
      context: post.context,
      media: post.media,
      liked_by_users_id: post.liked_by_users_id,
      createdAt: post.createdAt,
      tags: post.tags,
      comments: post.comments.map((comment) => {
        return {
          id: comment.id, // Fix: Access the 'id' property from the 'comment' object
          content: comment.content,
          createdAt: comment.createdAt,
          up_voted_by_users_id: comment.up_voted_by_users_id,
          down_voted_by_users_id: comment.down_voted_by_users_id,
          author: {
            id: comment.author.id,
            fullname: capitalize(
              `${comment.author.firstname} ${comment.author.lastname}`
            ),
            bio: comment.author.bio,
            affiliation: comment.author.affiliation,
            cover: comment.author.user_image.cover_name,
            pfp: comment.author.user_image.pfp_name,
            address: comment.author.address,
            username: comment.author.username,
          },
        };
      }),
      author: {
        id: post.author.id,
        fullname: capitalize(
          `${post.author.firstname} ${post.author.lastname}`
        ),
        bio: post.author.bio,
        affiliation: post.author.affiliation,
        cover: post.author.user_image.cover_name,
        pfp: post.author.user_image.pfp_name,
        address: capitalize(
          `${post.author.address.barangay}, ${post.author.address.municipality}, ${post.author.address.province}`
        ),
        username: post.author.username,
      },
    };
  });

  return res.code(200).send({ status: "success", data });
};

const getPost = async (
  req: FastifyRequest<{ Params: { postId: string }; Body: any }>,
  res: FastifyReply
) => {
  if (!req.params.postId)
    return res
      .code(400)
      .send({ status: "fail", message: "Post id is required" });

  const postExist = await req.prisma.post.findUnique({
    where: {
      id: req.params.postId,
    },
    select: {
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!postExist)
    return res.code(404).send({ status: "fail", message: "Post not found" });

  return res.code(200).send({ status: "success", data: postExist });
};

const likePostToggle = async (
  req: FastifyRequest<{ Body: { postId?: string } }>,
  res: FastifyReply
) => {
  if (!req.userId)
    return res
      .code(401)
      .send({ status: "fail", message: "User is not authorize" });

  if (!req.body?.postId)
    return res.code(400).send({
      status: "fail",
      message: "Missing body parameter",
      error: "Missing postId field",
    });
  await likePostToggleFnc(
    { postId: req.body.postId, userId: req.userId },
    req.prisma
  );

  const postExist = await req.prisma.post.findUnique({
    where: {
      id: req.body.postId,
    },
    select: {
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!postExist)
    return res.code(404).send({ status: "fail", message: "Post not found" });
  await req.prisma.user.update({
    where: {
      id: postExist.author.id,
    },
    data: {
      notification: {
        create: {
          type: "REACT",
          post_id: req.body.postId,
        },
      },
    },
  });
  return res
    .code(200)
    .send({ status: "success", message: "Post like status toggled" });
};

const getTopTags = async (
  req: FastifyRequest<{ Querystring: { count: string } }>,
  res: FastifyReply
) => {
  const count = parseInt(req.query.count) || 10;
  const tags = await req.prisma.post.findMany({
    select: {
      tags: true,
    },
  });

  const tagCount: { [key: string]: number } = {};
  tags.forEach((post) => {
    post.tags.forEach((tag) => {
      if (tagCount[tag]) tagCount[tag]++;
      else tagCount[tag] = 1;
    });
  });

  const sortedTags = Object.entries(tagCount).sort(
    (a, b) => tagCount[b[0]] - tagCount[a[0]]
  );

  console.log({ sortedTags, tagCount });
  return res.code(200).send({
    status: "success",
    data: Object.fromEntries(sortedTags.slice(0, count)),
  });
};

export type PostPostBody = {
  title?: string;
  context: string;
  tags: string[];
  media: PostMedia[];
};

export type PostPutBody = {
  postId: string;
  tags?: string[];
  context?: string;
  media?: {
    caption: string | null;
    filename: string;
  }[];
};

const postController = {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  getAllPosts,
  getPost,
  likePostToggle,
  getAllUserPost,
  getTopTags,
};

export default postController;
