import React, { useState, useEffect } from 'react';

const Game = () => {    /*encontrar mejor lugar para los const*/
    const [deckId, setDeckId] = useState(null);
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [message, setMessage] = useState('');
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const initializeGame = async () => {
            const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            const data = await response.json();
            setDeckId(data.deck_id);
        };
        initializeGame();
    }, []);

    const calculateScore = (cards) => {
        let score = 0;
        let aceCount = 0;
        cards.forEach(card => {
            if (['Jack', 'Queen', 'King'].includes(card.value)) {
                score += 10;
            } else if (card.value === 'Ace') {
                score += 11;
                aceCount += 1;
            } else {
                score += parseInt(card.value);
            }
        });
        /*Temita con el ace a resolver*/
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }
        return score;
    };

    const drawCards = async (count, pile) => {  /*agregar*/
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        const data = await response.json();
        const cards = data.cards;

        if (pile === 'player') {
            setPlayerCards(prev => [...prev, ...cards]);
            setPlayerScore(calculateScore([...playerCards, ...cards]));
        } else if (pile === 'dealer') {
            setDealerCards(prev => [...prev, ...cards]);
            setDealerScore(calculateScore([...dealerCards, ...cards]));
        }
    };

    const stay = () => {    /*plantar*/
        let dealerFinalScore = dealerScore;
        while (dealerFinalScore < 17) {
            drawCards(1, 'dealer');
            dealerFinalScore = calculateScore(dealerCards);
        }
        setGameOver(true);
    };

    useEffect(() => {
        if (playerScore > 21) {
            setMessage('¡Te pasasstee! HASHAHAHSHS.');
            setGameOver(true);
        } else if (dealerScore > 21) {
            setMessage('El dealer cago. ¡Murió el Negro Jacobo!');
            setGameOver(true);
        } else if (gameOver) {  /*definir score*/
            if (playerScore > dealerScore) {
                setMessage('¡Ganasteeee!');
            } else if (playerScore < dealerScore) {
                setMessage('Te ganó el Negro Jacobo.');
            } else {
                setMessage('Fua chaval es un empate :O');
            }
        }
    }, [playerScore, dealerScore, gameOver]);

    return (
        <div className="game-container">
            <div className="card-container">
                <h2>Jacobo's Cards</h2>
                {dealerCards.map(card => (
                    <img key={card.code} src={card.image} alt={card.code} className="card" />
                ))}
                <h2>Player's Cards</h2>
                {playerCards.map(card => (  /*ayuda de Carlitos con las imagenes*/
                    <img key={card.code} src={card.image} alt={card.code} className="card" />
                ))}
            </div>
            <div className="buttons">
                <button disabled={gameOver} onClick={() => drawCards(1, 'player')}>añadizar carta</button>
                <button disabled={gameOver} onClick={stay}>Cultivarse</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Game;
