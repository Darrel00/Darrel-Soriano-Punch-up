import { Routes, Route, useNavigate } from "react-router-dom";
import Toolbar from "./components/toolbar.jsx";
import SaveButton from "./components/save-button.jsx";
import Navbutton from "./components/nav-button.jsx"

function Challenge() {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path='/' element ={
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
                  <Toolbar />
                </section>
            </div>
            } />
            <Route path='/*' element={<ProjectList />} />
        </Routes>
    )
}

export default Challenge;

