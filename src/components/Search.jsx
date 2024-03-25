import React from "react";


//Searching component of the user
const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder="Search" />
      </div>
      <div className="user">
        <div className="user-cont">
          <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <div className="userProfile">
            <span>Username</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
