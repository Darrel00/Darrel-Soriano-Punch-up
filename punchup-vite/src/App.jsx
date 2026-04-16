import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import FreeDrawButton from './assets/Free-Draw-Button.svg';
import ChallengeButton from './assets/Challenge-Button.svg';
import './App.css';

function Homepage() {
    const navigate = useNavigate();

    return (
            <div className="homepage-background">
                <section className="homepage-top">
                    <div className="homepage-top-text">
                        <h1 className='title-white'>Experience being a Graphic Designer! </h1>
                        <h2 className='subtitle-white'>Punch Up Project for Advanced Dynamic Content Design by Darrel Soriano</h2>
                        <h3 className='description-white'>
                          This is a portfolio project that I created for my Advanced Dynamic Content Design course. It was built using React and Vite, and the canvas API was used to create the drawing tools.</h3>
                          <h3 className='description-white'>
                          The project is a drawing tool where users can either draw freely or design a prompt with a limited time, and was chosen because of my passion for graphic design and creative thinking.</h3>
                    </div>
                </section>
                <div className="homepage-buttons">
                  <button onClick={() => navigate('/free-drawing')} className='homepage-button'>
                    <img src={FreeDrawButton} alt='Free Draw' className='homepage-button-image' />
                    <div className='homepage-button-text'>Free Draw Mode</div>
                    <h3 className='homepage-button-description'>Unlimited Time for Drawing Ideas</h3>
                  </button>
                  <button onClick={() => navigate('/challenge-mode')} className='homepage-button'>
                    <img src={ChallengeButton} alt='Challenge' className='homepage-button-image' />
                    <div className='homepage-button-text'>Challenge Mode</div>
                    <h3 className='homepage-button-description'>Design a Prompt with Limited Time</h3>
                  </button>
                  </div>
            </div>
    )
}

export default Homepage;
