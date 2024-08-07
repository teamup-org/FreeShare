import React from 'react';
import './UploadImgPage.css';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';
import ImageAI from './ImageAI';


const UploadImgPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [warning, setWarning] = useState('');

    const [AIResult, setAIResult] = useState(false);

    const [ImageDescription, setImageDescription] = useState('');
    const [uploadImage, setUploadImage] = useState('');


    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
        setWarning('');
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setWarning('Please select an image before uploading.');
        } else {

            //Put the API code in here

            console.log('Image uploaded:', selectedFile);
            setAIResult(true);

            setUploadImage(selectedFile);

            setSelectedFile(null);
            setWarning('');

            //set the AI result here
            setImageDescription('description');
        }
    };

    return (
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
                        />
                        <button 
                            className='upload-button' 
                            onClick={handleUpload}
                        >
                            Upload
                        </button>
                        {warning && <p style={{ color: 'red' }}>{warning}</p>}
                    </div>
                </div>
                {AIResult ? (<ImageAI image={selectedFile} description={AIResult} />) : (<></>)}
            </div>
            <Footer />
        </div>
    );
};

export default UploadImgPage;