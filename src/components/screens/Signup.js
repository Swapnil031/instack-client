import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';

const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch(`${ENDPOINT}/signup`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error})
            }
            else{
                M.toast({html: data.message})
                history.push('/login')
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return(
        <div className="mycard">
            <div className="card auth-card">
                <h2>InStack</h2>
                <input
                    type="text"
                    placeholder="Enter Name" 
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter Password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #ff1744 red accent-3"
                 onClick={() => PostData()}>
                    Sign Up
                </button>
                <p>
                    <Link to="/login">Already have an account ?</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup;