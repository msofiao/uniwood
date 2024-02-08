import { PrismaClient } from "@prisma/client";
import { PostPostBody } from "../controllers/postsController";

export const createPost = async (
  { title, context, tags, media, userId }: PostPostBody & { userId: string },
  prisma: PrismaClient
) => {
  if (tags?.length === 1 && tags[0] === "") tags = [];
  console.log({ tags, title });
  await prisma.user.update({
    where: { id: userId },
    data: {
      posts: {
        create: {
          title: title ?? null,
          context,
          tags: tags ?? [],
          media: media ?? [],
        },
      },
    },
  });
};

export const likePostTogggle = async (
  { postId, userId }: { postId: string; userId: string },
  prisma: PrismaClient
) => {
  const [user, post] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: userId },
      select: { liked_posts_id: true },
    }),
    prisma.post.findUnique({
      where: { id: postId },
      select: { liked_by_users_id: true },
    }),
  ]);

  if (post?.liked_by_users_id.includes(userId)) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          liked_posts_id: {
            set: user?.liked_posts_id.filter((e) => e !== postId),
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          liked_by_users_id: {
            set: post.liked_by_users_id.filter((e) => e !== userId),
          },
        },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { liked_posts_id: { push: postId } },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { liked_by_users_id: { push: userId } },
      }),
    ]);
  }
};
