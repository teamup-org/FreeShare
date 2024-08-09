import React, { useEffect } from 'react';
import './UploadImgPage.css';
import { Navigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';
import ImageAI from './ImageAI';
import { LineAxisOutlined } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

const UploadImgPage = () => {
    const { user, isAuthenticated } = useAuth0();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [warning, setWarning] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [AIResult, setAIResult] = useState(false);

    const [ImageDescription, setImageDescription] = useState(null);

    useEffect(() => {
        console.log('imageUrl:', imageUrl);
    }, [imageUrl]);
    
    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));
        setWarning('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setWarning('Please select a file.');
            return;
        }
        if (!isAuthenticated || !user || !user.email) {
            console.error('User is undefined');
            setWarning('User is undefined');
            return;
        }

        //Create a FormData object
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('user', user.email);

        //Put the API code in here
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/images/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const responseData = await response.json();
            console.log('responseData:', responseData);
            setImageDescription(responseData.description); 
            setAIResult(true);

        } catch (error) {
            console.error('Error uploading image:', error);
            setWarning('Error uploading image.');
        } finally {
            setLoading(false);
        }

        console.log('Image uploaded:', selectedFile);

        setSelectedFile(null);
        setWarning('');
    };

    return (
        isAuthenticated && user && (
        <div>
            <Header />
            <div className='main-container'>
                <div className='upload-main-container'>
                    <h1>Upload Image</h1>
                    <div className="upload-container">
                        <input 
                            type="file" 
                            className="input-file-tab" 
                            onChange={handleFileChange} 
                            accept="image/*"
                        />
                        <button 
                            className='upload-button' 
                            onClick={handleUpload}
                            disabled={loading || !selectedFile}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                        {warning && <p style={{ color: 'red' }}>{warning}</p>}
                    </div>
                </div>
                {imageUrl && (
                    <div>
                        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '20px' }} />
                    </div>
                )}
                {AIResult && (
                    <div className='image-description-container'>
                        <h2 style={{marginBottom: '10px'}}>AI Image description</h2>
                        {ImageDescription}
                    </div>
                )}
                
            </div>
            <Footer />
        </div>
        )
    );
};

export default UploadImgPage;