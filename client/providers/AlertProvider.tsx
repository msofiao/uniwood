import { Grow } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export const AlertContext = createContext<AlertContextProps>(null as any);

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<AlertStateProps>({
    severity: "success",
    message: "Posted Succesfully",
    visible: false,
  });

  const removeAlert = () => {
    console.log("remove alert");
    setTimeout(() => {
      setAlert({ ...alert, visible: false });
    }, 4000);
  };

  useEffect(removeAlert, [alert.visible]);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <Grow in={alert.visible}>
        <Alert
          className={`fixed bottom-6 left-36 z-50 px-6`}
          severity={alert.severity}
          variant="standard"
          onClose={() => setAlert({ ...alert, visible: false })}
        >
          {alert.message}
        </Alert>
      </Grow>
      {children}
    </AlertContext.Provider>
  );
}

interface AlertStateProps {
  severity: "error" | "info" | "success" | "warning";
  message: string;
  visible: boolean;
}

interface AlertContextProps {
  alert: AlertStateProps;
  setAlert: Dispatch<SetStateAction<AlertStateProps>>;
}
