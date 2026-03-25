import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Download from "./assets/Download.svg";
import Eraser from "./assets/Eraser.svg";
import Pen from "./assets/Pen.svg";
import Redo from "./assets/Redo.svg";
import Undo from "./assets/Undo.svg";
import Stroke from "./assets/Stroke.svg";
import './App.css';

function Challenge() {
    const canvasRef = useRef(null);
    const toolbarRef = useRef(null);
    const isPaintingRef = useRef(false);
    const lineWidthRef = useRef(5);
    const DrawModeRef = useRef(false);
    const EraseModeRef = useRef(false);
    const [showWidthMenu, setShowWidthMenu] = useState(false);
    const [selectedWidth, setSelectedWidth] = useState(5);
    const [prompt, setPrompt] = useState('');

    const strokeWidths = [
        { label: 'Thin', value: 2},
        { label: 'Medium', value: 5 },
        { label: 'Thick', value: 10 },
        { label: 'Extra Thick', value: 20 },
    ]
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const nameInput = document.getElementById('given-name');
        const newTitle = nameInput?.value.trim();

        const image = canvas.toDataURL("image/");
        const link = document.createElement("a");
        link.href = image;
        link.download = newTitle ? `${newTitle}.png` : "my-drawing.png";
        link.click();
    };

    const getPrompt = async () => {
            const response = await fetch("https://retoolapi.dev/FfoNKG/prompts");
            const data = await response.json();
            const random = data[Math.floor(Math.random() * data.length)];
            setPrompt(random.DesignPrompt);
            console.error("Failed to fetch prompt:", error);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const toolbar = toolbarRef.current;
        
        if (!canvas || !toolbar) return;
        
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const draw = (e) => {
            if(!isPaintingRef.current || !DrawModeRef.current) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineWidth = lineWidthRef.current;
            ctx.lineCap = 'round';
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        };

        // Draw
        toolbar.addEventListener('click', e => {
            if (e.target.id === 'draw') {
                DrawModeRef.current = true;
                EraseModeRef.current = false;
                canvas.style.cursor = 'crosshair';
                
                if (!canvas.dataset.listenersAttached) {
                    canvas.addEventListener('mousedown', () => {
                        if (!DrawModeRef.current) return;
                        isPaintingRef.current = true;
                    });

                    canvas.addEventListener('mouseup', () => {
                        isPaintingRef.current = false;
                        ctx.stroke();
                        ctx.beginPath();
                    });

                    canvas.addEventListener('mousemove', draw);

                    canvas.dataset.listenersAttached = 'true';
                }
            }

            if (e.target.id === 'erase') {
                DrawModeRef.current = false;
                EraseModeRef.current = true;
                canvas.style.cursor = 'default';

                if (!canvas.dataset.listenersAttached) {
                    canvas.addEventListener('mousedown', () => {
                        if (!DrawModeRef.current) return;
                        isPaintingRef.current = true;
                    });

                    canvas.addEventListener('mouseup', () => {
                        isPaintingRef.current = false;
                        ctx.stroke();
                        ctx.beginPath();
                    });

                    canvas.addEventListener('mousemove', (e) => {
                        if (!isPaintingRef.current || !DrawModeRef.current) return;
                        const rect = canvas.getBoundingClientRect();
                        ctx.lineWidth = lineWidthRef.current;
                        ctx.lineCap = 'round';
                        ctx.strokeStyle = DrawModeRef.current === 'erase'
                            ? '#ffffff'
                            : colorRef.current;
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                    });

                    canvas.dataset.listenersAttached = 'true';
                }
            }

        // Clear all
        if (e.target.id === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        });

        // Change Colour
        toolbar.addEventListener('change', e => {
            if(e.target.id === 'stroke') {
                ctx.strokeStyle = e.target.value;
            }
        });

        return () => {
            toolbar.removeEventListener('click', () => {});
            toolbar.removeEventListener('change', () => {});
        };
    }, []);

    const handleWidthSelect = (value) => {
        lineWidthRef.current = value;
        setSelectedWidth(value);
        setShowWidthMenu(false);
    }

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
                  <button id='generate' className='generate-prompt' onClick={getPrompt}>Generate a Prompt</button>
                  <div id='prompt' className='prompt'>{prompt}</div>
                  <button onClick={() => navigate('')}>Free Draw</button>
                  <button onClick={() => navigate('')}>Challenge</button>
                </div>
                <section className="drawing-section">
                  <div ref={toolbarRef} className='toolbar'>
                    <img src={Pen} id='draw'/>
                    <img src={Eraser} id='erase'/>
                    <input className='stroke-color' id="stroke" name="stroke" type="color"/>
                    <div className="stroke-width-section">
                        <img src={Stroke} id="lineWidth" name='lineWidth' onClick={() => setShowWidthMenu(prev => !prev)} />

                        {showWidthMenu && (
                            <div className="menu">

                            {strokeWidths.map(({ label, value }) => (
                                <div
                                    key={value}
                                    onClick={() => handleWidthSelect(value)}
                                    className="map"
                                    >
                                <div className="stroke"/>
                                {label} ({value}px)
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                    <button id="clear">Clear</button>
                  </div>
                  <div className="drawing-board">
                    <canvas ref={canvasRef} id="drawing-board"></canvas>
                  <div className='bottom-section'>
                    <input className='drawing-name' id='given-name' placeholder='Give it a name....'/>
                    <img src={Undo} className='undo'/>
                    <img src={Redo} className='redo'/>
                    <img src={Download} onClick={handleSave} className='download'/>
                  </div>
                  </div>
                </section>
            </div>
    )
}

export default Challenge;

