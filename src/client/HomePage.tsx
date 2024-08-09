import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import Header from "./Header";
import "./HomePage.css";

import free_share_logo from "./images/freeshare_logo.png";
import logo from "./images/teamup-logo.png";
import { SocialIcon } from 'react-social-icons';

const HomePage = () => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
    user,
  } = useAuth0();

  const createUser = async (userInfo: any) => {
    try {
      const accessToken = await getAccessTokenSilently();
      console.log("Access Token:", accessToken);

      const response = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          description: "No profile description",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data);
      } else if (response.status === 409) {
        await updateUserTime(userInfo.email);
      } else {
        console.error("Error creating user:", response.status);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUserTime = async (email: string) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          time: new Date(),
        }),
      });

      if (response.ok) {
        console.log("User time updated");
      } else if (response.status === 404) {
        console.error("User not found");
      } else {
        console.error("Error updating user:", response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      createUser(user);
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div className="home-page">
      <header>
        <div className="logo">
          <img src={logo} alt="TeamUp Logo" className="logo-image" />{" "}
          {/*Replace logo with respective team app logo*/}
        </div>
        <nav>
          <ul className="header-list-bar">
            <div>
              <li>
                <Link to="/">About Us</Link>
              </li>
              <li>
                <Link to="/about">About this product</Link>
              </li>
              {isAuthenticated ? <Header /> : null}
            </div>
            <div>
              <li>
                {isAuthenticated ? (
                  <button
                    className="nav-button button"
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    className="nav-button button"
                    onClick={() => loginWithRedirect()}
                  >
                    Log In
                  </button>
                )}
              </li>
            </div>
          </ul>
        </nav>
      </header>

      <main>
        <section className="welcome-section">
          <div className="main-container">
            <img src={free_share_logo} className="freeshare-logo" />
            <div className="welcome-text-container">
              <p className="welcome-text-light"> Welcome to</p>
              <p className="welcome-text-bold"> FreeShare</p>
            </div>
            <div>
              <p className="description-text">
                {" "}
                An open market for students to exchange unwanted items
              </p>
            </div>
          </div>
          <div></div>
        </section>
      </main>

      <footer>
        <div>
          <p className="footer-text">2024 FreeShare</p>
        </div>
        <div className="footr-social-icons-container">
          <SocialIcon url="www.facebook.com" bgColor="grey" style ={{width: '20px', height: '20px', marginRight: '10px', padding: '0px'}}/>
          <SocialIcon url="www.linkedin.com" bgColor="grey" style ={{width: '20px', height: '20px', marginRight: '10px', padding: '0px'}}/>
          <SocialIcon url="www.youtube.com" bgColor="grey" style ={{width: '20px', height: '20px', marginRight: '10px', padding: '0px'}}/>
          <SocialIcon url="www.instagram.com" bgColor="grey" style ={{width: '20px', height: '20px', marginRight: '10px', padding: '0px'}}/>
        </div>
      </footer>

      {/* <Profile /> */}
    </div>
  );
};

export default HomePage;
