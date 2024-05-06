import React, { createContext, useState } from "react";
import type { TokenContextProps } from "../types/providers";

export const TokenContext = createContext<TokenContextProps | undefined>(
  undefined,
);

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </TokenContext.Provider>
  );
}
