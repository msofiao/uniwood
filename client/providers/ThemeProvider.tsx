import React from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import "@fontsource/nunito";
import "@fontsource/roboto";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import "@fontsource/space-mono";
import "@fontsource/inter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f17f69",
      dark: "#ef7158",
    },
    secondary: {
      dark: "#73acba",
      main: "#82b5c1",
    },
    text: {
      primary: "#0f1419",
      secondary: "#536471",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      "Segoe UI Historic, Roboto, Monteserrat, Poppins, Nunito Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.75rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.25rem",
    },
    h6: {
      fontSize: "1rem",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    subtitle1: {
      fontSize: "1rem",
      color: "#909197",
    },
    subtitle2: {
      fontSize: "0.875rem",
      color: "#909197",
    },
  },
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
