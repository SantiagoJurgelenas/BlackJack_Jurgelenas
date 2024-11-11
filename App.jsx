import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Game from './components/Game';
import './styles.css';

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Game />
            <Footer />
        </div>
    );
};
/*30% ayuda de Carlitos.AI
por lo que no merezco mucho el podio :>*/
export default App;
