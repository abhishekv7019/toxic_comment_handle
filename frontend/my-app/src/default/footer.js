import React from 'react';
import '../css/Footer.css'; 

function Footer() {
  
    const styles1 = {
          color:'white',
        }
    
  return (
    <footer className="footer">
      <div className="container21">
        <div className="footer-content">
          <div className="footer-logo">
            <h1>5<span style={styles1}>Chan</span></h1>
            <p className=''>Your ultimate destination for tracking and discovering movies!</p>
          </div>
          <div className="footer-links">
           
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;