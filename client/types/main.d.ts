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
  proffeciency: string;
  username: string;
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
  author: Author;
}

declare interface CommentProps {
  id: string;
  content: string;
  createdAt: string;
  author: CommentPropsAuthor;
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
