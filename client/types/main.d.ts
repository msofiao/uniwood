declare interface UserProfileInfo {
  id: string;
  affiliation: string;
  address: string;
  bio: string;
  email: string;
  dateOfBirth: string;
  fullname: string;
  gender: string;
  pfp: string;
  cover: string;
  username: string;
  followersCount: number;
  followingCount: number;
}

declare interface PostAuthor {
  fullname: string;
  affiliation: string;
  id: string;
  pfp: string;
  cover: string;
  bio: string;
  address: string;
  username: string;
}

declare interface CommentAuthor extends PostAuthor {}

declare interface Author {
  id: string;
  fullname: string;
  username: string;
  bio: string;
  pfp: string;
  cover: string;
  address: string;
  affiliation: string;
}

declare interface Post {
  id: string;
  title: string;
  context: string;
  createdAt: string;
  liked_by_users_id: string[];
  media: {
    filename: string;
    caption: string | undefined;
  }[];
  tags: string[];
  comments: CommentProps[];
  author: PostAuthor;
}

declare interface CommentProps {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  up_voted_by_users_id: string[];
  down_voted_by_users_id: string[];
}

declare interface Projects {
  id: string;
  title: string;
  context: string;
  createdAt: string;
  liked_by_users_id: string[];
  media: {
    filename: string;
    caption: string | undefined;
  }[];
  tags: string[];
  comments: CommentProps[];
  author: Author;
}

declare interface IConvo {
  reecipiendInfo: {
    fullname: string;
    username: string | undefined;
    pfp: string | undefined;
    id: string | undefined;
  };
  messages: IMessage[];
}

declare interface IMessage {
  id: string;
  author_id: string;
  type: "TEXT" | "VIDEO" | "IMAGE" | "FILE" | "AUDIO";
  chat: string | null;
  createdAt: string;
  media?: {
    filename: string;
    caption: string | null;
  }[];
  status: "SENT" | "DELIVERED" | "READ";
}

declare interface IConvoUnit {
  converseId: string;
  message: Omit<IMessage, "id">;
  recipientInfo: {
    recipientId: string;
    fullname: string;
    pfp: string;
  };
}

declare type IRecipientInfo = {
  id: string;
  recipientId: string;
  fullname: string;
  pfp: string;
  username: string;
};

declare interface INotifSocketPayload {
  type: "POST_REACT" | "POST_COMMENT" | "FOLLOW";
  createdAt: string;

  notifTo_id: string;
  notifFrom_id: string;
  post_id?: string;
  comment_id?: string;
  id: string;
  notifBy: {
    id: string;
    fullname: string;
    username: string;
    pfp: string;
  };
}
