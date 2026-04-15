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
                        <h3 className='description-white'>See what it’s like to be a designer by putting your ideas into a drawing!
                            Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.</h3>
                    </div>
                </section>
                <div className="homepage-buttons">
                  <button onClick={() => navigate('/free-drawing')} className='homepage-button'>Free Draw Mode
                    <img src={FreeDrawButton} alt='Free Draw' className='homepage-button-image' />
                  </button>
                  <button onClick={() => navigate('/challenge-mode')} className='homepage-button'>Challenge Mode
                    <img src={ChallengeButton} alt='Challenge' className='homepage-button-image' />
                  </button>
                  </div>
            </div>
    )
}

export default Homepage;
