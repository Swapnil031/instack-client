import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import M from 'materialize-css';
require('dotenv').config();

const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';
const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;

const Profile = () => {
    const {state, dispatch} = useContext(UserContext);
    const [mypics, setPics] = useState([]);
    const [profilePic, setProfilePic] = useState("");
    const [url, setUrl] = useState("");

    useEffect(()=>{
        fetch(`${ENDPOINT}/mypost`,{
            headers:{
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])

    useEffect(() => {
        if(url !== ""){ 
            fetch(`${ENDPOINT}/editProfilePic`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+sessionStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:url
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error})
                }
                else{
                    setProfilePic('');
                    M.toast({html: "Profile Picture Updated"});
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [url])

    const postPicture = () => {
        const data = new FormData()
        data.append("file", profilePic)
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
            sessionStorage.setItem('user',JSON.stringify({...state,picture:data.url}));
            dispatch({type:"UPDATEPICTURE",payload:data.url});
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return(
        <div style={{maxWidth:"1000px", margin:"0px auto"}}>      
        {
            state ?
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                padding:"20px 5px",
                borderBottom:"2px solid lightgrey"}} > 
                <div>
                    <label>
                        <input type="file" style={{display:"none"}} onChange={(e) => setProfilePic(e.target.files[0])} />
                        <i className="small material-icons" style={{cursor:"pointer"}} title="Change Picture">edit</i>
                    </label>
                    <img 
                        style={{width:"160px", height:"160px", borderRadius:"50%"}}
                        src={state.picture}
                        alt="Profile Pic"/>        
                    {
                        profilePic ? <button className="btn #ff1744 red accent-3" onClick={()=>postPicture()}>Save</button> : null
                    }                
                </div>
                <div>
                    <h4>{state.name}</h4>
                    <div style={{display:'flex', justifyContent:"space-between", width:"108%"}}>
                        <h5>{mypics.length} posts</h5>
                        <h5>{state.followers.length} followers</h5>
                        <h5>{state.following.length} following</h5>
                    </div>
                </div>
            </div> 
            
            : 
            
            //<h4>Loading....</h4>
            <div className="preloader-wrapper active" style={{margin:"50px 48%"}}>
                <div className="spinner-layer spinner-red-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
        }            
            
            <div className='gallery'>
                {
                    mypics.map(item=>{
                        return(
                            <img 
                                className="item" 
                                alt={item.title} 
                                src={item.photo}
                                key={item._id}
                            />
                        )
                    })
                }                
            </div>
        </div>
    )
}

export default Profile;