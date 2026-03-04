import './nav-button.css';
import { useNavigate } from 'react-router-dom';

function Navbutton() {
    return (
        <div className='nav-button'>
            <button onClick={() => navigate('')}>Free Draw</button>
            <button onClick={() => navigate('')}>Challenge</button>
        </div>
    )
}

export default Navbutton;