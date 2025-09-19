import React from 'react';
import './header.css';

export default function header(){
  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="logo">FECAP</div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">HOME</a>
          <a href="#para-surdos">PARA SURDOS</a>
          <a href="#tutorial">TUTORIAL</a>
        </nav>

        <div className="socials">
  <a href="https://www.instagram.com" target="_blank" className="soc">
   <img src="/instagram20px.png" alt="" />
  </a>
  <a href="https://www.youtube.com" target="_blank" className="soc">
    <img src="/linkedin20px.png" alt="YouTube" />
  </a>
  <a href="https://www.linkedin.com" target="_blank" className="soc">
    <img src="/instagram20px.png" alt="LinkedIn" />
  </a>
</div>



      </div>
    </header>
  );
}
