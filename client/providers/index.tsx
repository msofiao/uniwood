import React, { StrictMode } from "react";
import ThemeProvider from "./ThemeProvider";
import TokenProvider from "./TokenProvider";
import UserProvider from "./UserInfoProvider";
import { Box } from "@mui/material";
import AlertProvider from "./AlertProvider";
import PeerProvider from "./PeerProvider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <StrictMode>

    <ThemeProvider>
      <TokenProvider>
        <AlertProvider>
          <UserProvider>
            <PeerProvider>{children}</PeerProvider>
          </UserProvider>
        </AlertProvider>
      </TokenProvider>
    </ThemeProvider>
    // </StrictMode>
  );
}
