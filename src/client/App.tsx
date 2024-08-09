import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import ProfileGallery from './ProfileGallery';
import Profile from './Profile';
import NotFoundPage from './NotFoundPage';
import AIProfile from './AIProfile';
import UploadImgPage from './UploadImgPage';
import ImageGallery from './ImageGallery';
import UpdateProfile from './UpdateProfile';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/profile-gallery" element={<ProfileGallery />} />
          <Route path="/ai-profile" element={<AIProfile />} />
          <Route path="/upload-image" element={<UploadImgPage />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
