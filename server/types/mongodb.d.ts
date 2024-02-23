export interface IConverseDocument {
  _id: string;
  messengers_id: string[];
  messengers: unknown[];
  createdAt: Date;
  updatedAt: Date;
  messages: unknown[];
  unreadCount: number;
}

export interface IUserDocument {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  middlename: string;
  lastname: string;
  date_of_birth: Date;
  gender: TGender;
  address: IAddress;
  role: TGender;
  affiliation: TAffiliation;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICredentialDocument {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUserDocument;
}

export interface INotificationDocument {
  _id: string;
  type: TNotificationType;
  createdAt: Date;
  updatedAt: Date;

  user_id?: string;
  post_id?: string;
  project_id?: string;
  comment_id?: string;
  foolower_id?: string;

  user: IUserDocument;
}

export interface IPostDocument {
  _id: string;
  title?: string;
  context: string;
  media?: IPostMedia[];
  status: TPostStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  liked_by_users_id: string[];
  disliked_by_users_id: string[];
  author_id: string;

  liked_by_users: IUserDocument[];
  disliked_by_users: IUserDocument[];
  author: IUserDocument;
  comments: ICommentDocument[];
}

export interface IProjectDocument {
  _id: string;
  title: string;
  context: string;
  tags: string[];
  media?: IProjectMedia[];
  projectStatus: TPostStatus;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];

  liked_by_users_id: string[];
  disliked_by_users_id: string[];
  author_id: string;

  liked_by_users: IUserDocument[];
  disliked_by_users: IUserDocument[];
  author: IUserDocument;
  comments: ICommentDocument[];
}

export interface ICommentDocument {
  _id: string;
  type: TCommentType;
  content: string;
  status: TPostStatus;
  createdAt: Date;
  updatedAt: Date;

  upvoted_by_users_id: string[];
  downvoted_by_users_id: string[];
  reply_to_id?: string;
  author_id: string;
  post_id?: string;
  project_id?: string;
  replies_id: string[];

  up_voted_by_users: IUserDocument[];
  down_voted_by_users: IUserDocument[];
  author: IUserDocument;
  replies?: ICommentDocument[];
  replied_to?: ICommentDocument;
}

interface IAddress {
  barangay: string;
  municipality: string;
  province: string;
}

type TAffiliation = "WOOD_WORKER" | "WOOD_ENTHUSIAST" | "WOOD_CRAFTER";
type TPRoffeciency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type TGender = "MALE" | "FEMALE";
type TRole = "ADMIN" | "USER";

// * TYPES
interface IMessage {
  _id: string;
  author_id: string;
  type: TMessageType;
  media: string;
  chat: string | undefined;
}

interface IUserImage {
  pfp_name: string;
  cover_name: string;
}

interface IPostMedia {
  filename: string;
  caption: string | undefined;
}

interface IProjectMedia {
  filename: string;
  caption: string | undefined;
}

// * ENUMS

type TNotificationType =
  | "PROJECT_LIKE"
  | "PROJECT_DISLIKE"
  | "COMMENT_LIKE"
  | "COMMENT_DISLIKE"
  | "COMMENT_REPLY"
  | "POST_LIKE"
  | "POST_DISLIKE"
  | "FOLLOW";
type TAccountVisibility = "PUBLIC" | "PRIVATE";
type TMessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
type TCommentType = "POST" | "PROJECT";
type TUserStatus = "ACTIVE" | "ARCHIVED";
type TUserActivity = "ONLINE" | "OFFLINE";
type TPostStatus = "ACTIVE" | "ARCHIVED";
