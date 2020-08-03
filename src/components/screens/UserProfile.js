import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';

const Profile = () => {
    const {state, dispatch} = useContext(UserContext);
    const [userProfile, setProfile] = useState(null);
    const [showFollow, setShowFollow] = useState(true);
    const {userid} = useParams();

    useEffect(()=>{
        fetch(`${ENDPOINT}/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result);
            if(result.user.followers.includes(state._id)){
                setShowFollow(false);
            }
        })
    },[])

    const followUser = () =>{
        fetch(`${ENDPOINT}/follow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following,followers:data.followers}})
            sessionStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            });
            setShowFollow(false);
        })
    }

    const unfollowUser = () =>{
        fetch(`${ENDPOINT}/unfollow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following,followers:data.followers}})
            sessionStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollowers = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            });
            setShowFollow(true);
        })
    }

    return(
        <> 
        {userProfile ? 
        <div style={{maxWidth:"1000px", margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                padding:"20px 5px",
                borderBottom:"2px solid lightgrey"
            }} >            
                <div>
                    <img 
                        style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src={userProfile.user.picture}
                        alt="Profile Pic"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <div style={{display:'flex', justifyContent:"space-between", width:"108%"}}>
                        <h5>{userProfile.posts.length} posts</h5>
                        <h5>{userProfile.user.followers.length} followers</h5>
                        <h5>{userProfile.user.following.length} following</h5>
                    </div>
                    {   
                        showFollow?
                        <button className="btn #ff1744 red accent-3" onClick={() => followUser()}>Follow</button> :
                        <button className="btn #ff1744 red accent-3" onClick={() => unfollowUser()}>Unfollow</button>
                    }
                </div>
            </div>
            
            <div className='gallery'>
                {
                    userProfile.posts.map(item=>{
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
        : 
        //<h4 style={{textAlign:"center"}}>Loading...</h4>
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
        </>
    )
}

export default Profile;