import { Link } from 'react-router-dom';
import "../styles/navbar.css";




const Header = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <Link to="/">
                    {/* <p>Icon here</p> */}
                    <p> ReciMe</p>

                </Link>
            </div>

            <nav className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/recipes">Recipes</Link>
                <Link to="/myrecipes">My Recipes</Link>
                <Link to="/createRecipe">Create Recipe</Link>

            </nav>
        </div>
    );
};

export default Header;
