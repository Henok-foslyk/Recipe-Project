import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import SignInModal from './SignInModal';
import "../styles/navbar.css";
import icon from '../assets/icon.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, signOut } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogOut = () => {
    navigate("/");
    signOut();    
  }

  const handleProtectedClick = (e) => {
    e.preventDefault();
    setIsSignInOpen(true);
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={icon} alt="ReciMe Logo" />
        </Link>
      </div>

      <nav className="nav-links">

        {currentUser ? (
            <>
                <Link to="/recipes">Recipes</Link>
                <Link to="/my-recipes">My Recipes</Link>
                <Link to="/create-recipe">Create Recipe</Link>

                {currentUser.admin && ( // Only show if user is an admin
                <Link to="/admin">Admin</Link>
                )}

                <span className="welcome-text">Hi, {currentUser.username}</span>
                <button onClick={handleLogOut} className="logout-button">Logout</button>
            </>
            ) : (
            <>
                <button onClick={() => setIsSignInOpen(true)} className="logout-button">Login</button>
            </>
        )}
      </nav>

      <SignInModal open={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </div>
  );
};

export default Header;