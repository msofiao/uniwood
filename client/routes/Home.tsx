import React, { useEffect } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import { Tab } from "@mui/material";
import Post from "../components/Post.tsx";
import Poster, { PosterModal } from "../components/Poster";
import axiosClient from "../utils/axios";
import { useFetcher } from "react-router-dom";
export default function Main() {
  const [tabTarget, setTabTarget] = useState("forYou");
  const [postModalView, setPostModalView] = useState(false);
  const [initialPostData, setInitialPostData] = useState([]);
  const rootLoaderFetch = useFetcher();

  

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabTarget(newValue);
  };

  // handle initial post data
  useEffect(() => {
    axiosClient
      .get("/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setInitialPostData(res.data.data))
      .catch(console.error);
  }, [rootLoaderFetch]);

  return (
    <div className="home">
      <TabContext value={tabTarget}>
        <TabList className="z-10" onChange={handleTabChange}>
          <Tab
            sx={{ width: "50%", fontWeight: "bold" }}
            label="For you"
            value="forYou"
          />
          <Tab
            sx={{ width: "50%", fontWeight: "bold" }}
            label="Following"
            value="following"
          />
        </TabList>
        <TabPanel sx={{ padding: "35px 45px" }} value="forYou">
          <Poster setPostModalView={setPostModalView} />
          {initialPostData &&
            initialPostData.map((post) => <Post postParam={post as any} />)}
          <PosterModal
            postModalView={postModalView}
            setPostModalView={setPostModalView}
          />
        </TabPanel>
        <TabPanel value="following">Following</TabPanel>
      </TabContext>
    </div>
  );
}
