import React, { useState, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Header from './Header';
import './Profile.css';
import ProfileDescription from './ProfileDescription';
import AIResponseLog from './AIResponseLog';

const Profile = () => {
  
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profileDescription, setProfileDescription] = useState('');

  if (isLoading) {
    return <Navigate to="/" />;
  }

  const handleEditDescription = () => {
    setIsEditingDescription(!isEditingDescription);
  };

  const handleSaveDescription = async () => {
    console.log('handleSaveDescription called');
    try {
      if (isAuthenticated && user) {
        const response = await fetch('http://localhost:3000/api/profiledescription', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, profileDescription }),
        });
  
        if (response.ok) {
          console.log('Profile description updated successfully');
          setIsEditingDescription(false);

          // Update the user's time
        await fetch('http://localhost:3000/api/users/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            time: new Date(),
          }),
        });

        console.log('User time updated');
        await fetchProfileDescription();
        } else {
          console.error('Error updating profile description');
        }
      } else {
        console.error('User is undefined');
      }
    } catch (error) {
      console.error('Error updating profile description:', error);
    }
  };   

  const handleCancelEdit = async() => {
    setIsEditingDescription(false);
    await fetchProfileDescription();
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfileDescription(event.target.value);
  };

  const fetchProfileDescription = async () => {
    try {
      if (isAuthenticated && user) {
        const response = await fetch(`http://localhost:3000/api/profiledescription?email=${user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const { description } = await response.json();
          setProfileDescription(description);
        } else {
          console.error('Error fetching profile description:', await response.json());
        }
      } else {
        console.error('User object is undefined');
      }
    } catch (error) {
      console.error('Error fetching profile description:', error);
    }
  };

  useEffect(() => {
    fetchProfileDescription();
  }, [isAuthenticated, user]);

  return (
    isAuthenticated &&
    user && (
      <div>
        <Header />
        <div className="content">
          <div className="profile-container">
            <img src={user.picture} alt={user.name} />
            <div className="profile-info-list-container">
                <p className="user-name-text">{user.name}</p>
                <p className="user-info-text">{user.email}</p>
                <button onClick={handleEditDescription}> Edit profile </button>
              </div>
            <div className="profile-description-container">
              {isEditingDescription ? (
                <div style={{width:'100%'}}>
                  <ProfileDescription 
                    email={user.email}
                    text={profileDescription}
                    onChange={handleDescriptionChange}
                  />
                  <button onClick={handleSaveDescription} className="save-button">Save</button>
                  <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <div>
                  <p>Profile Description:</p>
                  <p>{profileDescription || 'No description available'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
