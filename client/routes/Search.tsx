import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Button, Paper, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "../components/Post.tsx";
import axiosClient from "../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Search() {
  const [tabIndex, setTabIndex] = React.useState("1");
  const handletTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };
  const [query] = useSearchParams();
  const [resData, setResData] = useState<{
    posts: Post[];
    users: Author[];
    projects: Projects[];
  }>();

  useEffect(() => {
    axiosClient
      .get(`/search/${query.get("q")}`)
      .then((res) => setResData(res.data.data));
  }, [query]);

  return (
    <div className="search">
      <TabContext value={tabIndex}>
        <TabList className="tab-list" onChange={handletTabChange}>
          <Tab className="tab" label="Posts" value="1" />
          <Tab className="tab" label="Projects" value="2" />
          <Tab className="tab" label="Users" value="3" />
        </TabList>
        <TabPanel value="1">
          {resData?.posts &&
            resData.posts.map((post) => <Post postParam={post as any} />)}
        </TabPanel>
        {/* <TabPanel value="2">
          <Project />
        </TabPanel> */}
        <TabPanel value="3">
          <div className="flex justify-center gap-3 flex-col">
            {resData?.users &&
              resData.users.map((user) => <Users user={user} />)}
          </div>
        </TabPanel>
      </TabContext>
    </div>
  );
}

function Users({ user }: { user: Author }) {
  const navigate = useNavigate();
  return (
    <Paper className="users" id={user.id}>
      <Avatar
        className="avatar"
        src={`${process.env.SERVER_PUBLIC}/${user.pfp}`}
      />
      <div className="user-details">
        <p className="name">{user.fullname}</p>
        <p className="affiliation">{user.affiliation}</p>
        <p className="username">@{user.username}</p>
      </div>
      <Button
        className="button"
        variant="contained"
        sx={{ color: "white", textTransform: "none", fontWeight: "bold" }}
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        View Profile
      </Button>
    </Paper>
  );
}
