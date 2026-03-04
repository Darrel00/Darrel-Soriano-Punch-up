import { Routes, Route, useNavigate } from "react-router-dom";

function Challenge() {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route>
            <div className="background">
                <div className="website-top">
                    <div>
                        <h1>Experience being a Graphic Designer!</h1>
                        <h3>See what it’s like to be a designer by putting your ideas into a drawing! Generate a prompt, and use the drawing tools to make a design before the time runs out. When you’re done, save your image on the bottom right.

                        Have fun and get creative!</h3>
                    </div>
                </div>
            </div>
            </Route>
        </Routes>
    )
}