import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';

interface ImageItem {
    image: string;
    id: string;
    user: string;
}

const ImageGallery = () => {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch('http://localhost:3000/images-gallery');
                if(response.ok) {
                    const data = await response.json();
                    setImages(data);
                }
			} catch (error) {
				console.error('Error fetching images:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchImages();
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<Header />
			<div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '80px' }}>
				{images.map((item) => (
					<div key={item.id} style={{ margin: '10px', textAlign: 'center' }}>
						<img 
							src={`data:image/jpeg;base64,${item.image}`} 
							alt="Uploaded" 
							style={{ width: '200px', height: 'auto' }}
						/>
						<p>{item.user}</p>
					</div>
				))}
			</div>
			<Footer />
		</div>
	);
};

export default ImageGallery;