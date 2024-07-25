import React,{useState,useEffect} from 'react';
import "../css/navbarcss.css"
import {  Link,useNavigate } from "react-router-dom";
import { getUsername } from '../auth/login';


function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleclick(event){
  
    localStorage.setItem('username', '');
    const username = getUsername();
    setIsLoggedIn(!!username);
    console.log('logged_out');
    navigate('/'); 
  }

  useEffect(() => {
    const username = getUsername();
    setIsLoggedIn(!!username);
  }, []);

    const divStyle = {
        color: 'white',
      };
	return (
		<div>
         <div class="header">
  <h1><a href="#default" class="logo">5<span style={divStyle}>chan</span></a></h1>
  <div className="header-center">
    <Link className='link' to="/home">
    <a  href="#">Home</a>
    </Link>
    <Link className='link' to="/postit">
    <a href="#">Post</a>
    </Link>
    
    
  </div>
  {isLoggedIn  ? 
  <div className="header-right1" onClick={handleclick}>
    
   <Link className='link ' >
   <a class="active logout" href="#">Logout</a>
   </Link> 
   </div>
  :
  <>
  <div className="header-right">
    <Link className='link' to='/login'>
    <a href="#">Login</a>
    </Link>
    <Link className='link' to='/signup'>
    <a class="active" href="#">Sign up</a>
    </Link> 
  </div>
  </>}
</div>
        </div>
	);
}

export default Navbar;
