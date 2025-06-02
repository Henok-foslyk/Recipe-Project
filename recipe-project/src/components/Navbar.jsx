import { Link } from 'react-router-dom';




const Header = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <Link to="/">
                    <p>Icon here</p>
                </Link>
            </div>

            <nav className="nav-links">
                <Link to="/recipes">Recipes</Link>

            </nav>
        </div>
    );
};

export default Header;
