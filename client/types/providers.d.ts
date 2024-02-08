declare interface UserInfoContextProps {
  userInfo: {
    id: string;
    fullname: string;
    pfp: string;
    username: string;
    address: string;
    bio: string;
    cover: string;
    affiliation: string;
  };
  setUserInfo: Dispatch<
    SetStateAction<{
      id: string;
      fullname: string;
      pfp: string;
      username: string;
      address: string;
      bio: string;
      cover: string;
      affiliation: string;
    }>
  >;
}

declare interface TokenContextProps {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

declare interface ProfileContext {
  userProfileInfo: UserProfileInfo | null;
  userPosts: Post[];
  setUserProfileInfo: Dispatch<SetStateAction<UserProfileInfo>>;
  setUserPosts: Dispatch<SetStateAction<Post[]>>;
}

declare interface PostContext {
  post: (Post & { author: PostAuthor }) | null;
  setPost: Dispatch<SetStateAction<Post & { author: PostAuthor }>>;
}
