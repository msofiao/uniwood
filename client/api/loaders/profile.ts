import axiosClient from "../../utils/axios";

/**
 * Loads the user's profile info and the user's posts
 * @param param0
 * @returns
 */
export async function profileLoader({ params }: { params: any }) {
  const userInfoPromise = axiosClient.get(`/users/${params.usernameOrId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const userPostsPromise = axiosClient.get(
    `/posts/user/${params.usernameOrId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  const [userInfo, userPosts] = await Promise.all([
    userInfoPromise,
    userPostsPromise,
  ]);

  return {
    userProfileInfo: userInfo.data.data,
    userPosts: userPosts.data.data,
  };
}
