declare interface UserInfoResponseData {
  id: string;
  fullname: string;
  cover: string;
  pfp: string;
  address: string;
  bio: string;
  dateOfBirth: string;
  proffeciency: string;
  affiliation: string;
  gender: string;
  email: string;
  username: string;
}

declare interface RefreshTokenResponseData {
  accessToken: string;
  id: string;
}

declare interface LoginResponseData {
  accessToken: string;
  id: string;
}
declare interface LoginResponseError {
  message: string;
  error: "FieldError" | "UserNotFound" | "IncorrectPassword";
  message: string;
  fieldError: { field: string; message: string }[];
}
