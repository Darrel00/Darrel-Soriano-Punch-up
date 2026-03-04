import SaveButton from "./components/save-button.jsx";
import Navbutton from "./components/nav-button.jsx";
import { useEffect, useRef } from 'react';
import './App.css';

function Challenge() {
    const canvasRef = useRef(null);
    const toolbarRef = useRef(null);
    const isPaintingRef = useRef(false);
    const lineWidthRef = useRef(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const toolbar = toolbarRef.current;
        
        if (!canvas || !toolbar) return;
        
        const ctx = canvas.getContext('2d');
        const canvasOffsetX = canvas.offsetLeft;
        const canvasOffsetY = canvas.offsetTop;

        canvas.width = window.innerWidth - canvasOffsetX;
        canvas.height = window.innerHeight - canvasOffsetY;

        toolbar.addEventListener('click', e => {
            if (e.target.id === 'clear') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        toolbar.addEventListener('change', e => {
            if(e.target.id === 'stroke') {
                ctx.strokeStyle = e.target.value;
            }

            if(e.target.id === 'lineWidth') {
                lineWidthRef.current = e.target.value;
            }
        });

        const draw = (e) => {
            if(!isPaintingRef.current){
                return;
            }

            ctx.lineWidth = lineWidthRef.current;
            ctx.lineCap = 'round';

            ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
            ctx.stroke();
        }

        canvas.addEventListener('mousedown', (e) => {
            isPaintingRef.current = true;
        });

        canvas.addEventListener('mouseup', e => {
            isPaintingRef.current = false;
            ctx.stroke();
            ctx.beginPath();
        });

        canvas.addEventListener('mousemove', draw);

        return () => {
            canvas.removeEventListener('mousedown', () => {});
            canvas.removeEventListener('mouseup', () => {});
            canvas.removeEventListener('mousemove', draw);
            toolbar.removeEventListener('click', () => {});
            toolbar.removeEventListener('change', () => {});
        };
    }, []);

    return (
            <div className="background">
                <section className="website-top">
                    <div>
                        <h1>Experience being a Graphic Designer!</h1>
                        <h3>See what it’s like to be a designer by putting your ideas into a drawing! Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.

                        Have fun and get creative!</h3>
                    </div>
                </section>
                <div className="header">
                  <Navbutton />
                </div>
                <section className="drawing-section">
                  <div ref={toolbarRef}>
                    <label htmlFor="stroke">Stroke</label>
                    <input id="stroke" name="stroke" type="color"/>
                    <label htmlFor="lineWidth">Line Width</label>
                    <input id="linewidth" name='lineWidth' type="number" value="5"/>
                    <button id="clear">Clear</button>
                  </div>
                  <div className="drawing-board">
                    <canvas ref={canvasRef} id="drawing-board"></canvas>
                  </div>
                </section>
            </div>
    )
}

export default Challenge;

