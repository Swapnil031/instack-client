import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
require('dotenv').config();

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if(url !== ""){ 
            fetch(`${ENDPOINT}/createpost`,{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+sessionStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error})
                }
                else{
                    M.toast({html: "Posted Pic"})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instack")
        data.append("cloud_name", CLOUD_NAME)
        M.toast({html: "Please Wait...."})
        fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return(
        <div className="card input-filed"
            style={{
                margin:"50px auto",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"
            }}>
            <input 
                type="text" 
                placeholder="title" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="body" 
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #ff1744 red accent-3">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>

            <button 
                className="btn waves-effect waves-light #ff1744 red accent-3" 
                onClick={()=>postDetails()}
            >
                Submit
            </button>
        </div>
    )
}

export default CreatePost;