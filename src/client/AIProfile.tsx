import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react"; 
import { Navigate } from "react-router-dom";
import Header from "./Header";
import ProfileDescription from "./ProfileDescription";
import AIResponseLog from "./AIResponseLog";
import { set } from "mongoose";

const AIProfile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [text, setText] = useState('');

    if (!isAuthenticated || !user) {
      return <Navigate to="/" />;
    }

    const userEmail: string = user.email || '';

    if (isLoading) {
      return <div>Loading...</div>;
    }

    const handleChange = (event: any) => {
      setText(event.target.value);
    };

    return (
      isAuthenticated && user && (
        <div>
          <Header />
          <div style={{padding: '80px'}}>
          <h1>AI Profile Summary Page</h1>
          <ProfileDescription
            email={user.email}
            text={text}
            onChange={handleChange}
          />
          <br />
          <AIResponseLog />
        </div>
        </div>
      )
    );
  }
  
  export default AIProfile;