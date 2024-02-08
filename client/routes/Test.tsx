import { Box, Tab } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { sendTestRequest } from "../utils";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Poster, { PosterModal } from "../components/Poster";

export async function loader() {
  const testResponse = await sendTestRequest();
  console.log({ testResponse });
  return null;
}
export default function Test() {
  const [value, setValue] = React.useState("1");
  const [postModalView, setPostModalView] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Poster setPostModalView={setPostModalView} />
          <PosterModal
            postModalView={postModalView}
            setPostModalView={setPostModalView}
          />
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </>
  );
}

// function MyModal() {
//   return <Modal></Modal>;
// }

// type
interface TestContextProps {
  testInfo: string;
  setTestInfo: Dispatch<SetStateAction<string>>;
}
