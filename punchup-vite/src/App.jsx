import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';

function Challenge() {
    const navigate = useNavigate();

    return (
            <div className="background">
                <section className="website-top">
                    <div>
                        <h1 className='title'>Experience being a Graphic Designer!</h1>
                        <h3 className='description'>See what it’s like to be a designer by putting your ideas into a drawing!
                            Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.</h3>
                    </div>
                </section>
                <div className="header">
                  <button onClick={() => navigate('/free-drawing')} className='free-draw'>Free Draw</button>
                  <button onClick={() => navigate('/challenge-mode')} className='challenge'>Challenge</button>
                </div>
            </div>
    )
}

export default Challenge;
