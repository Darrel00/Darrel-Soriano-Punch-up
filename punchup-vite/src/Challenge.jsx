import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Download from "./assets/Download.svg";
import Eraser from "./assets/Eraser.svg";
import Pen from "./assets/Pen.svg";
import Redo from "./assets/Redo.svg";
import Undo from "./assets/Undo.svg";
import Stroke from "./assets/Stroke.svg";
import Trash from "./assets/Trash-Can.svg";
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
    const navigate = useNavigate();


    // Stroke Width //
    const strokeWidths = [
        { label: 'Thin', value: 2},
        { label: 'Medium', value: 5 },
        { label: 'Thick', value: 10 },
        { label: 'Extra Thick', value: 20 },
    ]

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

    // const timer = () => {
        
    // }

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
                        isPaintingRef.current = false;
                        ctx.stroke();
                        ctx.beginPath();
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
        }
        });

        // Undo and Redo Function //
        /*
        const undoStack = [canvas.toDataURL()];
        const redoStack = [];
        function getTopImage() {
            return undoStack[undoStack.length - 1];
        }

        function handleMouseUp() {
            clicked = false;
            undoStack.push(source);
            redoStack = [];
        }

        function undo() {
            redoStack.push(undoStack.pop());
            source = getTopImage();
            img.src = source;
            canvas.clearRect(0,0,canvas.width,canvas.height);
        };
        canvas.drawImage(img,0,0,canvas.width,canvas.height);
        renderImage();

        function redo() {
            undoStack.push(redoStack.pop());
            source = getTopImage();
            img.src = source;
            canvas.clearRect(
               0,0,canvas.width,canvas.height
            );
            canvas.drawImage(
               img,0,0,canvas.width,canvas.height
            );
            renderImage();
        }

        if (e.target.id === 'undo') {
            if (undoStack.length > 1) {
                undo();
            }
        }

        if (e.target.id === 'redo') {
            if (redoStack.length >=1) {
                redo();
            }
        }

        function handleUndo() {
            if (undoStack.length>1) {
                undoRedo(redoStack, undoStack);
            }
        }
        function handleRedo() {
            if (redoStack.length>=1) {
                undoRedo(undoStack, redoStack);
            }
        }
        */

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
                    <div>
                        <h1 className='title'>Experience being a Graphic Designer!</h1>
                        <h3 className='description'>See what it’s like to be a designer by putting your ideas into a drawing!
                            Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.</h3>
                    </div>
                </section>
                <div className="header">
                  <button id='generate' className='generate-prompt' onClick={getPrompt}>Generate a Prompt</button>
                  <div id='prompt' className='prompt'>{prompt}</div>
                  <button onClick={() => navigate('/free-drawing')} className='free-draw'>Free Draw</button>
                  <button onClick={() => navigate('/')} className='homepage'>Home</button>
                </div>
                <section className="drawing-section">
                  <div ref={toolbarRef} className='toolbar'>
                    <img src={Pen} id='draw' className='pencil'/>
                    <img src={Eraser} id='erase' className='eraser'/>
                    <input className='stroke-color' id="stroke" name="stroke" type="color"/>
                    <div className="stroke-width-section">
                        <img src={Stroke} id="lineWidth" name='lineWidth' className='stroke-width' onClick={() => setShowWidthMenu(prev => !prev)} />

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
                    <img src={Trash} id="clear" className='trash' />
                  </div>
                  <div className="drawing-board">
                    <h1 className='challenge-mode'>Challenge Mode</h1>
                    <canvas ref={canvasRef} id="drawing-board"></canvas>
                  <div className='bottom-section'>
                    <input className='drawing-name' id='given-name' placeholder='Give it a name....'/>
                    <div className='bottom-section-buttons'>
                    <img src={Undo} className='undo'/>
                    <img src={Redo} className='redo'/>
                    <img src={Download} onClick={handleSave} className='download'/>
                    </div>
                  </div>
                  </div>
                  <div className='timer-section'>
                    <button className='timer-button'></button>
                    <div className='timer'></div>
                  </div>
                </section>
            </div>
    )
}

export default Challenge;
