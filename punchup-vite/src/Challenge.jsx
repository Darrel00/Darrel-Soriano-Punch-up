import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import Download from "./assets/Download.svg";
import Eraser from "./assets/Eraser.svg";
import Pen from "./assets/Pen.svg";
import Redo from "./assets/Redo.svg";
import Undo from "./assets/Undo.svg";
import Stroke from "./assets/Stroke.svg";
import Trash from "./assets/Trash-Can.svg";
import PunchupPic from "./assets/Punchup-Picture.svg";
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
    const strokeBtnRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const navigate = useNavigate();


    // Stroke Width //
    const strokeWidths = [
        { label: 'Thin', value: 2},
        { label: 'Medium', value: 5 },
        { label: 'Thick', value: 10 },
        { label: 'Extra Thick', value: 20 },
    ]

    const handleStrokeClick = () => {
        if (strokeBtnRef.current) {
            const rect = strokeBtnRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.top,
                left: rect.right + 8,
            });
    }
    setShowWidthMenu(prev => !prev);
};

    const handleWidthSelect = (value) => {
        lineWidthRef.current = value;
        setSelectedWidth(value);
        setShowWidthMenu(false);
    }
    
    // Save Function //
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

    // Prompt Function //
    const getPrompt = async () => {
            const response = await fetch("https://retoolapi.dev/FfoNKG/prompts");
            const data = await response.json();
            const random = data[Math.floor(Math.random() * data.length)];
            setPrompt(random.DesignPrompt);
            console.error("Failed to fetch prompt:", error);
    }

    // Timer Function //
    const timer = () => {
        const timerValue = document.getElementById('timer');
        const timerInterval = setInterval(() => {
            timerValue.textContent = timerValue.textContent - 1;
            if (timerValue.textContent === '0') {
                clearInterval(timerInterval);
            }
        }, 1000);
    }  

    useEffect(() => {
        const canvas = canvasRef.current;
        const toolbar = toolbarRef.current;

        if (!canvas || !toolbar) return;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Function
        const draw = (e) => {
            if(!isPaintingRef.current || (!DrawModeRef.current && !EraseModeRef)) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineWidth = lineWidthRef.current;
            ctx.lineCap = 'round';
            ctx.strokeStyle = DrawModeRef.current ? '#000000' : '#ffffff';
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        };

        toolbar.addEventListener('click', e => {
            if (e.target.id === 'draw') {
                DrawModeRef.current = true;
                EraseModeRef.current = false;
                canvas.style.cursor = 'crosshair';
                
                if (!canvas.dataset.listenersAttached) {
                    canvas.addEventListener('mousedown', () => {
                        if (!DrawModeRef.current && !EraseModeRef.current) return;
                        isPaintingRef.current = true;
                    });

                    canvas.addEventListener('mouseup', () => {
                        if (!isPaintingRef.current) return;
                        isPaintingRef.current = false;
                        ctx.stroke();
                        ctx.beginPath();
                        saveState(); 
                    });

                    canvas.addEventListener('mousemove', draw);

                    canvas.dataset.listenersAttached = 'true';
                }
            }

            // Erase Function (Incomplete)
            if (e.target.id === 'erase') {
                DrawModeRef.current = false;
                EraseModeRef.current = true;
                canvas.style.cursor = 'crosshair';
            }

        // Clear all
        if (e.target.id === 'clear') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
        });

        // Undo and Redo Function //
        const undoStack = [canvas.toDataURL()];
        const redoStack = [];

        const saveState = () => {
            undoStack.push(canvas.toDataURL());
            redoStack.length = 0; 
        };

        const restoreState = (dataURL) => {
            const img = new Image();
            img.src = dataURL;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };

        const handleUndo = () => {
            if (undoStack.length > 1) {
                redoStack.push(undoStack.pop()); 
                restoreState(undoStack[undoStack.length - 1]); 
            }
        };

        const handleRedo = () => {
            if (redoStack.length > 0) {
                const state = redoStack.pop();
                undoStack.push(state);
                restoreState(state);
            }
        };

        document.getElementById('undo').addEventListener('click', handleUndo);
        document.getElementById('redo').addEventListener('click', handleRedo);

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

    return (
            <div className="background">
                <section className="website-top">
                    <div className='website-top-text'>
                        <h1 className='title'>Test your ideas with the Challenge Mode!</h1>
                        <br />
                        <h3 className='description'>See what it’s like to be a designer by putting your ideas into a drawing!
                            Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.</h3>
                    </div>
                    <img src={PunchupPic} className='punchup-pic' />
                </section>
                <div className="header">
                  <button id='generate' className='generate-prompt' onClick={getPrompt}>Generate a Prompt</button>
                  <div id='prompt' className='prompt'>{prompt}</div>
                  <button onClick={() => navigate('/free-drawing')} className='route-button'>Free Draw</button>
                  <button onClick={() => navigate('/')} className='route-button'>Home</button>
                </div>
                <section className="drawing-section">
                {showWidthMenu && createPortal(
                <div
                    className="menu"
                    style={{
                        position: 'fixed',
                        top: menuPosition.top + 1500,
                        left: menuPosition.left + 500,
                        zIndex: 1000,
                    }}
                >
                    {strokeWidths.map(({ label, value }) => (
                        <div
                            key={value}
                            onClick={() => handleWidthSelect(value)}
                            className="map"
                        >
                            <div className="stroke" />
                            {label} ({value}px)
                        </div>
                    ))}
                </div>,
                document.body
            )}
                  <div ref={toolbarRef} className='toolbar'>
                    <img src={Pen} id='draw' className='pencil'/>
                    <img src={Eraser} id='erase' className='eraser'/>
                    <input className='stroke-color' id="stroke" name="stroke" type="color"/>
                    <div className="stroke-width-section">
                        <img src={Stroke} id="lineWidth" name='lineWidth' className='stroke-width' onClick={handleStrokeClick} />
                    </div>
                    <img src={Trash} id="clear" className='trash' />
                  </div>
                  <div className="drawing-board">
                    <div className='drawing-section-top'>
                    <h1 className='mode-title'>Challenge Mode</h1>
                    <div className='timer-section'>
                    <button className='timer-button'>Start Timer</button>
                    <div className='timer' id='timer'>60</div>
                  </div>
                  </div>
                    <canvas ref={canvasRef} id="drawing-board"></canvas>
                  <div className='bottom-section'>
                    <input className='drawing-name' id='given-name' placeholder='Give it a name....'/>
                    <div className='bottom-section-buttons'>
                    <img src={Undo} className='undo' id='undo'/>
                    <img src={Redo} className='redo' id='redo'/>
                    <img src={Download} onClick={handleSave} className='download'/>
                    </div>
                  </div>
                  </div>
                </section>
            </div>
    )
}

export default Challenge;
