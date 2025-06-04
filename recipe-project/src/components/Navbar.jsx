import { Link } from 'react-router-dom';
import "../styles/navbar.css";
import icon from '../assets/icon.png';

const Header = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <Link to="/">
                    <img
                        src={icon}
                        alt="ReciMe Logo"
                    />
                </Link>
            </div>

            <nav className="nav-links">
                <Link to="/recipes">Recipes</Link>
                <Link to="/my-recipes">My Recipes</Link>
                <Link to="/create-recipe">Create Recipe</Link>
                <Link to="/displayrecipe">Display Recipe</Link>
                <Link to="/admin">Admin</Link>


            </nav>
        </div>
    );
};

export default Header;
