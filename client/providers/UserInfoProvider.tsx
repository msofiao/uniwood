import React, { Dispatch, SetStateAction } from "react"; // Import the 'React' module

import { createContext, useState } from "react";

export const UserInfoContext = createContext<UserInfoContextProps | undefined>(
  undefined
);

export default function UserInfoProvier({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    pfp: "",
    username: "",
    address: "",
    bio: "",
    cover: "",
    affiliation: "",
    id: "",
  });
  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}
