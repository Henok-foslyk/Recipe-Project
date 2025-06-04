import { React } from 'react'
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import './App.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {

  return (
    <>
      <Navbar />
      <Home />
    </>
  )
}

export default App
