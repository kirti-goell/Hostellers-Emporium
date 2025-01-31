import React, { useState } from 'react';
import axios from 'axios';
import camera from "./Pics/AddCamera.png";

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [path,setPath] = useState("");
    const upload = async (event) => {
        // Prevent form from submitting the traditional way
        event.preventDefault();
        // alert("enterd")
        if (!image) {
            alert('Please select an image');
            return;
        }

        
        // Prepare form data for file upload
        const formData = new FormData();
        formData.append('image', image);
        
        try {
            const response = await axios.post('http://localhost:5000/addImage', formData, {
            
                    'Content-Type': 'multipart/form-data'
                
            });

            if (response.data.path) {
                setPath( "http://localhost:5000"+ response.data.path)
                localStorage.setItem('imagePath', response.data.path);
                // alert('Image uploaded successfully');
            } else {
                alert('Error uploading image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(error);
        }
    };

    return (
        <div id="image-input-cont">
            <form onSubmit={upload} id="image-input-inner-cont">
                <label id="image-label" for="image-input">
                    <img src={image == null? camera : path}/>
                </label>
                <input
                    type="file"
                onChange={(event) => {
                    console.log(event.target.files[0]);
                    setImage(event.target.files[0])}}
                    accept="image/*"
                    id="image-input"
                />
                <button type="submit" id="image-upload">Upload</button>
            </form>
        </div>
    );
}
