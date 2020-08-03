import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';


const NavBar = () => {
    const {state, dispatch} = useContext(UserContext);
    const renderList = () => {
        if(state){
            return [    
                <li key='followingPosts'><Link to="/followingPosts">Home</Link></li>,            
                <li key='profile'><Link to="/profile">Profile</Link></li>,
                <li key='create'><Link to="/create">CreatePost</Link></li>,
                <li key='explore'><Link to="/">Explore</Link></li>,
                <li key='logout'>
                    <Link to="/login" onClick={()=>{sessionStorage.clear(); dispatch({type:"CLEAR"})}}>
                        Logout
                    </Link>
                </li>
            ]
        }
        else{
            return [
                <li key='login'><Link to="/login">Login</Link></li>,
                <li key='signup'><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    });

    return(
        <>
        <div className="navbar-fixed">
        <nav>
            <div className="nav-wrapper white" style={{padding:"0px 5%"}}>
                <Link to={state?"/followingPosts":"/login"} className="brand-logo">InStack</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>
        </div>
        
        <ul className="sidenav" id="mobile-demo">
            {renderList()}
        </ul>
        </>
    )
}

export default NavBar;