import React, { useState, useEffect, useContext } from 'react';
import {UserContext} from '../../App'
import { Link } from 'react-router-dom';

const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';

const Home = () => {
    const [data, setData] = useState([]);
    const {state,dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch(`${ENDPOINT}/allpost`,{
            headers:{
                "Authorization": "Bearer "+sessionStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setData(result.posts);
        })
    },[])

    const likePost = (id) =>{
        fetch(`${ENDPOINT}/like`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const unlikePost = (id) =>{
        fetch(`${ENDPOINT}/unlike`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    const makeComment = (text,postId) =>{
        fetch(`${ENDPOINT}/comment`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    const deletePost = (postId) =>{
        fetch(`${ENDPOINT}/deletepost/${postId}`,{
            method:'delete',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

    const deleteComment = (postId,commentId) => {
        fetch(`${ENDPOINT}/deleteComment`,{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+sessionStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                commentId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    return(
        <div className="home">
            {   
                (data.length !== 0) ? 
                data.slice(0).reverse().map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px 25px"}}>
                                <img 
                                    src={item.postedBy.picture} 
                                    alt="DP" 
                                    style={{height:"35px", width:"35px", borderRadius:"50%", marginRight:"10px", verticalAlign:"middle"}}/>
                                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                {item.postedBy.name}</Link> 
                                {
                                    item.postedBy._id === state._id &&
                                    <i 
                                        className="material-icons" 
                                        style={{float:"right", cursor:"pointer"}}
                                        onClick={()=>deletePost(item._id)}>
                                    delete</i>
                                }                                
                            </h5>
                            <div className="card-image">
                                <img alt="PostedPic" src={item.photo} style={{height:"600px"}}/>
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id) ?
                                    <i  className="material-icons"
                                        onClick={() => unlikePost(item._id)} 
                                        style={{color:"red", cursor:"pointer"}}>
                                            favorite
                                    </i> :
                                    <i  className="material-icons"
                                        onClick={() => likePost(item._id)}
                                        style={{"cursor":"pointer"}}>
                                            favorite
                                    </i>
                                }
                                <span style={{verticalAlign:"top",fontSize:"18px", marginLeft:"10px"}}>{item.likes.length} likes</span>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        if(record.postedBy.id === state._id){
                                            return(
                                                <h6 key={record._id}>
                                                    <span style={{fontWeight:"bolder"}}>{record.postedBy.name}</span> - {record.text}
                                                    <i className="material-icons" 
                                                    style={{cursor:"pointer", verticalAlign:"top", fontSize:"20px", color:"grey", marginLeft:"10px"}}
                                                    onClick={()=>deleteComment(item._id,record._id)}>
                                                        delete
                                                    </i>
                                                </h6>
                                            )
                                        }else{
                                            return(
                                                <h6 key={record._id}>
                                                    <span style={{fontWeight:"bolder"}}>{record.postedBy.name} - </span>{record.text}
                                                </h6>
                                            )
                                        }                                        
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault();
                                    if(e.target[0].value!==''){
                                        makeComment(e.target[0].value, item._id);
                                        e.target[0].value = '';
                                    }
                                }}>
                                    <input type="text" placeholder="Add Comment..." />
                                </form>                                
                            </div>
                        </div>
                    )    
                }) 
                :
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
        </div>
    )
}

export default Home;