import { React } from 'react'
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import './App.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
