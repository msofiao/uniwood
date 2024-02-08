import { Hidden } from "@mui/material";
import Alert, { AlertProps } from "@mui/material/Alert";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const AlertContext = createContext<AlertContextProps>(null as any);

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<AlertStateProps>({
    severity: "success",
    message: "Posted Succesfully",
    hidden: true,
  });
  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {!alert.hidden && (
        <Alert
          className={`fixed bottom-6 left-36 z- px-6 z-10`}
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, hidden: true })}
        >
          {alert.message}
        </Alert>
      )}

      {children}
    </AlertContext.Provider>
  );
}

interface AlertStateProps {
  severity: "error" | "info" | "success" | "warning";
  message: string;
  hidden: boolean;
}

interface AlertContextProps {
  alert: AlertStateProps;
  setAlert: Dispatch<SetStateAction<AlertStateProps>>;
}
