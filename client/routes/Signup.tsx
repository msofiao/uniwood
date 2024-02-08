import React, { useState } from "react";
import "../styles/signup.scss";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Added handlePasswordChange function
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  const handleProficiencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProficiency(e.target.value);
  };

  const handleAffiliationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAffiliation(e.target.value);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add signup logic here
  };

  return (
    <div className="signup">
      <form onSubmit={(e) => {}}>
        <div className="main-container">
          <h2 className="signup-heading">Sign Up!</h2>
          <div className="sub-container1">
            <label className="signup-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            <label className="signup-label">Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} />
            <label className="signup-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <label className="signup-label">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <label className="signup-label">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
            />
            <label className="signup-label">Address:</label>
            <input type="text" value={address} onChange={handleAddressChange} />
          </div>

          <div className="sub-container2">
            <label className="signup-label">Bio:</label>
            <textarea value={bio} onChange={handleBioChange} />
            <label className="signup-label">Role:</label>
            <input type="text" value={role} onChange={handleRoleChange} />
            <label className="signup-label">Proficiency:</label>
            <input
              type="text"
              value={proficiency}
              onChange={handleProficiencyChange}
            />
            <label className="signup-label">Affiliation:</label>
            <input
              type="text"
              value={affiliation}
              onChange={handleAffiliationChange}
            />
            <button type="submit" className="signup-submit-button">
              Sign Up
            </button>
          </div>

          <div className="sub-container3">
            <label className="signup-label">Profile Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile Image"
                className="profile-image"
              />
            )}
            <label className="signup-label">Cover Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
            {coverImage && (
              <img src={coverImage} alt="Cover Image" className="cover-image" />
            )}
          </div>
        </div>
      </form>
      <div className="logo-wood-container">
        <a href="" target="_blank">
          <img
            src={`${process.env.SERVER_PUBLIC}/assets/sample-profile-pic.png`}
            className="logo_uniwood"
            alt="Uniwood logo"
          />
        </a>
      </div>
      <div className="login">
        Already have an Account? <a href="">Login Here!</a>
      </div>
    </div>
  );
}

export default Signup;
