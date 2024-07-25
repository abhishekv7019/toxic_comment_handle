import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/signup.css';


function SignUpPage() {
  const navigate = useNavigate();

  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [result,setresult]= useState('');
  const [confirmpassword, setconfirmpassword] = useState('');

  function handlesubmit(event){
    event.preventDefault()
    if(username.length<=4){
      alert("username should have 4 or more characters")
    }
    else if(password.length<8){
      alert("Password length should be more that 8")
    }
    else if(confirmpassword!=password){
      alert("Passwords don't match")
    }
    else{
      insertArticle()
      setusername('')
      setpassword('')
      setconfirmpassword('')
      if (result=="user registered successfully"){
        navigate('/')
      }
    
      
    }
  }

  const handleChangeusername = (event) => {
    setusername(event.target.value);
  }

  const handleChangepassword = (event) => {
    setpassword(event.target.value);
  }

  const handleChangeconfirmpassword = (event) => {
    setconfirmpassword(event.target.value);
  }
  
     //data insertion
     const insertArticle = () => {
      fetch('http://localhost:5000/app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || 'An error occurred');
          });
        }
        return response.json();
      })
      .then(data => {
        setresult(data.message);
        if(data.message==="User registered successfully"){
          navigate('/')
        }
      })
      .catch(error => {
        setresult(error.message);
        console.error('Error:', error);
      });
    };
  return (
    <div className="back12">
      <div className="container11">
        <form className="signup-form" onSubmit={handlesubmit}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" 
            value={username}  
            onChange={handleChangeusername}
            required />
          </div>
          

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" value={password}  
            onChange={handleChangepassword}
             required />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" value={confirmpassword}  
            onChange={handleChangeconfirmpassword}
             required />
          </div>
          <div className="form-group">
            <button type="submit">Sign Up</button>
          </div>
          <p>{result}</p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;