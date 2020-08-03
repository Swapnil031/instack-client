import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App'
import M from 'materialize-css';

const ENDPOINT  = 'https://in-stack.herokuapp.com';
//const ENDPOINT  = 'https://localhost:5000';


const Login = () => {
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch(`${ENDPOINT}/signin`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
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
                sessionStorage.setItem("jwt",data.token)
                sessionStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "Login Success"})
                history.push('/')
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
                    onClick={()=>PostData()}>
                    Login
                </button>
                <p>
                    <Link to="/signup">Don't have an account ?</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;