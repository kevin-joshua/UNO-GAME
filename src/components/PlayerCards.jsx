import React, { useEffect, useState, useRef } from 'react';
import packOfCards from '../utils/packOfCards';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSound from 'use-sound';

import bgMusic from '../assets/sounds/game-bg-music.mp3'
import unoSound from '../assets/sounds/uno-sound.mp3'
import shufflingSound from '../assets/sounds/shuffling-cards-1.mp3'
import skipCardSound from '../assets/sounds/skip-sound.mp3'
import draw2CardSound from '../assets/sounds/draw2-sound.mp3'
import wildCardSound from '../assets/sounds/wild-sound.mp3'
import draw4CardSound from '../assets/sounds/draw4-sound.mp3'
import gameOverSound from '../assets/sounds/game-over-sound.mp3'

import bgB from '../assets/backgrounds/bgB.png';
import bgY from '../assets/backgrounds/bgY.png';
import bgG from '../assets/backgrounds/bgG.png';
import bgR from '../assets/backgrounds/bgR.png';





const PlayerCards = () => {

  //game sounds
  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true })
    const [playUnoSound] = useSound(unoSound)
    const [playShufflingSound] = useSound(shufflingSound)
    const [playSkipCardSound] = useSound(skipCardSound)
    const [playDraw2CardSound] = useSound(draw2CardSound)
    const [playWildCardSound] = useSound(wildCardSound)
    const [playDraw4CardSound] = useSound(draw4CardSound)
    const [playGameOverSound] = useSound(gameOverSound)




  //state variables
  

  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [deckOfCards, setDeckOfCards] = useState([]);
  const [playedCard, setPlayedCard] = useState('');
  const [currPlayer, setCurrPlayer] = useState(true);
  const [chooseColor, setChooseColor] = useState(false);
  const [play, setPlay] = useState(false);

  const [currColor, setCurrColor] = useState('');
  const [currValue, setCurrValue] = useState('');
  const arr = ['Red', 'Blue', 'Green', 'Yellow'];

  const showToast = (message, options) => {
    toast(message, options);
  };
 
  //images
  const images = import.meta.glob('../assets/cards-front/*.png', { eager: true });

  // Fisher Yates Shuffle Algo 
  function shuffleCards(array){
    for(let i = array.length - 1; i>0; i-- ){
      const j = Math.floor(Math.random() * i+1);
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
  }

  // handle Player clicking Card
  // Handle Player 1's card click
function handleClickPlayer1Card(card) {
  // Set the played card
  setPlayedCard(card);

  // Update Player 1's cards by filtering out the played card
  setPlayer1Cards((prev) => prev.filter((item) => item !== card));
  if(card.slice(0, 1) === '_' || card.slice(0, 1) === 's'  ){
  setCurrPlayer(currPlayer);
  }else{
    setCurrPlayer(!currPlayer);
  }
  
  checkWin();

}

// Handle Player 2's card click
function handleClickPlayer2Card(card) {
  // Set the played card
  setPlayedCard(card);
      setCurrPlayer(!currPlayer); // Skip to the next player

  // Update Player 2's cards by filtering out the played card
  
  setPlayer2Cards((prev) => prev.filter((item) => item !== card));
  
  checkWin();
 
}



 
  function checkCardValidity(card) {
    const cardColor = card.slice(-1);  // Get the last character for color
    const cardValue = card.slice(0,1);  // Get all but the last character for value
    
    // Check if the card is either a Wild card or matches color or value
    const isWildCard = cardColor === 'W' || currColor === 'W';
    const isColorMatch = cardColor === currColor;
    const isValueMatch = cardValue === currValue;
  
    if (isWildCard || isColorMatch || isValueMatch) {
      // Allow the card to be played
      // if (currPlayer === 1) {
        handleClickPlayer1Card(card);  // If Player 1's turn, handle the card
      // } else {
      //   handleClickPlayer2Card(card);  // If Player 2's turn, handle the card
      // }
    } else {
      // If the card cannot be played, show a toast message
      showToast("This card cannot be played. Please try again.", { type: "error" });
      

    }
  }
  

  function handleDeckOfCards() {
    if (
      player1Cards.some(
        (card) =>
          card.slice(-1) === currColor || card.slice(-1) === 'W' || card.slice(0, 1) === currValue
      )
    ) {
      showToast("You already have a playable card!", { type: "info" });
    } else {
      const card = deckOfCards[0];
      const newDeck = deckOfCards.slice(1);
      setDeckOfCards(newDeck);
        setPlayer1Cards((prev) => [...prev, card]);
        showToast("You drew a card!", { type: "success" });
        setTimeout(() => {
          if(card.slice(-1) === currColor || card.slice(-1) === 'W' || card.slice(0, 1) === currValue){
            handleClickPlayer1Card(card);  // If Player 1's turn, handle the card
            }
        }, 1000);
        
        setCurrPlayer(!currPlayer); // Skip to the next player

    }
  }

  function handleComputerDrawCards(){ 
    
      const card = deckOfCards[0];
      const newDeck = deckOfCards.slice(1);
      setDeckOfCards(newDeck);
        setPlayer2Cards((prev) => [...prev, card]);
        showToast("Computer drew a card!", { type: "success" });
        setTimeout(() => {
          if(card.slice(-1) === currColor || card.slice(-1) === 'W' || card.slice(0, 1) === currValue){
            handleClickPlayer1Card(card);  // If Player 1's turn, handle the card
            }
        }, 500);
    setCurrPlayer(!currPlayer); // Skip to the next player
     
  }

  // handle turns
  function handleTurn() {
    setCurrPlayer(!currPlayer); // Skip to the next player
    // Switch between player 1 and player 2
  }
  // handle skip
  function handleSkip() {
    setCurrPlayer(currPlayer); // Skip to the next player
  }


  function ComputerLogic() {
    // if(currPlayer === 2){ 
    if (!player2Cards || player2Cards.length === 0) return; // Prevent errors if no cards
   

    // Check for playable cards
    const validCard = player2Cards.find(
      (card) =>
        card.slice(-1) === currColor || // Matches current color
        card.slice(0, 1) === currValue || // Matches current value
        card.slice(-1) === 'W' // Wild card
    );
  
    if (validCard) {
      // Play the valid card
      handleClickPlayer2Card(validCard);
  
      // If it's a Wild card, set a new color
      if (validCard.slice(-1) === 'W') {
        const colors = ['R', 'G', 'B', 'Y'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrColor(randomColor);
        let RandomColor = randomColor === 'R' ? 'Red' : randomColor === 'B' ? 'Blue' : randomColor === 'G' ? "Green" : 'Yellow' 
        showToast(`Computer chose ${RandomColor} as the new color!`, { type: 'info' });
      } else {
        // Update current color and value for the played card
        setCurrColor(validCard.slice(-1));
        setCurrValue(validCard.slice(0, 1));
      }
  
      // Handle skip logic if needed
      if (validCard.slice(0, 1) === '_') {
        handleSkip(); // Skip player 1's turn
        
      }
    } 
    else {
      // No valid cards to play, draw a card
      handleComputerDrawCards();
    }
  
    // End computer's turn and switch back to player
    handleTurn();
    // }
  }
  

  function checkWin() {
 
    if(player1Cards.length === 0){
      console.log(player1Cards.length)
      showToast("YOU WIN!", { type: "success" });
      playGameOverSound();
      setTimeout(() => {
        window.location.reload();
      }, 300)
    }
    else if(player2Cards.length === 0){
      showToast("COMPUTER WINS!", { type: "success" });
      playGameOverSound();
      setTimeout(() => {
        window.location.reload();
      }, 300)

    }
  
  }

  // Choose Color
  function fetchColor(){
    showToast(`You set the color to ${color}`, { type: "success" });
    setCurrColor(color.slice(0, 1)); // This takes the first letter of the color
    setChooseColor(false);
   
  }

  
  function handleWildCards() {
     // Ensure `playedCard` is correctly set
    let card = playedCard;
    let value = card.slice(0, 1)
    if (value == 'D') {
      let num = parseInt(card.slice(1, 2)); // Parse the number of cards
      num === 4 ? playDraw4CardSound() : playDraw2CardSound(); // Play the correct sound
      console.log(card.slice(1, 2));
      let count = 0
      num === 4 ? setChooseColor(true) : null

      while (num > 0) {
        if (currPlayer) {
            const card = deckOfCards.splice(0, 1);
            // const newDeck = deckOfCards.slice(num);
            // setDeckOfCards(newDeck);
            setPlayer1Cards((prev) => [...prev, card]);
            count++;
            showToast(`You drew a card! ${count}`, { type: "success" }); 
        } else {
          const card = deckOfCards.splice(0, 1);
            // const newDeck = deckOfCards.slice(num);
            // setDeckOfCards(newDeck);
            setPlayer2Cards((prev) => [...prev, card]);
            count++;
            showToast(`Computer drew a card! ${count}`, { type: "success" }); 
        }
        num--;
      }
  
      handleTurn(); // Move the turn after all cards are drawn
    }
    else if (value === 'W') {
      if(currPlayer){
        
      playWildCardSound();
      setChooseColor(true);
      }
  }
  else if(value === '_' || value === 's'){
    playSkipCardSound();
    
    handleSkip();

  }
  
  }
  

  
  useEffect(() => {

    const shuffledCards = shuffleCards([...packOfCards])
  
    //initialising player1 cards
    setPlayer1Cards(shuffledCards.splice(0, 7));

    //initialising player2 cards
    setPlayer2Cards(shuffledCards.splice(0,7));

    //initializing the first card
    let startingCardIndex;
      while(true) {
         startingCardIndex = Math.floor(Math.random() * 94)
        if(shuffledCards[startingCardIndex]==='skipR' || shuffledCards[startingCardIndex]==='_R' || shuffledCards[startingCardIndex]==='D2R' ||
        shuffledCards[startingCardIndex]==='skipG' || shuffledCards[startingCardIndex]==='_G' || shuffledCards[startingCardIndex]==='D2G' ||
        shuffledCards[startingCardIndex]==='skipB' || shuffledCards[startingCardIndex]==='_B' || shuffledCards[startingCardIndex]==='D2B' ||
        shuffledCards[startingCardIndex]==='skipY' || shuffledCards[startingCardIndex]==='_Y' || shuffledCards[startingCardIndex]==='D2Y' ||
        shuffledCards[startingCardIndex]==='W' || shuffledCards[startingCardIndex]==='D4W') {
            continue;
        }
        else
            break;
    }
    
        let card = shuffledCards.splice(startingCardIndex,1)[0];
        setPlayedCard(card);
        setCurrColor(card.slice(-1));
        setCurrValue(card.slice(0,1))

    // initializzing deck of cards;
    setDeckOfCards(shuffledCards.slice(0,93))
    
    
     },[])


     useEffect(() => {
      if (!currPlayer) {
        setTimeout(() => {
          ComputerLogic();
        }, 1000); // Simulate delay for the computer's turn
      }  ;
      
    }, [currPlayer]);
    
      useEffect(() => {
       
          handleWildCards();
      if(player1Cards.length === 1 || player2Cards === 2){
        playUnoSound();
      }
      
      }, [playedCard])


      // useEffect(() => {
      //   changeImage();
      // }, [currColor])



      // const backGroundImage = useRef();
      // function changeImage(){
      //   let newImageUrl = currColor === 'R' ? 'bgR' : currColor === 'B' ? 'bgB' : currColor === 'Y' ? 'bgY' : 'bgG';
      //   backGroundImage.current.style.backgroundImage = `url(${newImageUrl})`
      // }
  


  return (
    
    <div style={{ backgroundImage: `url(${bgR})` ,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',} }
    // ref={backGroundImage}
    >
      {!play && (<button onClick={() => {
        setPlay(!play) 
        playShufflingSound();
      }} className='bg-white fixed top-1/2 left-[700px] p-10 rounded-lg text-4xl font-bold '>Play</button>)}
      <ToastContainer />

    {play && ( <>
        {/* rendering Player1 cards */}
    <button className='fixed top-14 left-14 bg-white rounded-lg p-2' onClick={() => {
      
        playBBgMusic();
      
      
    }}>
      <i className="fa-solid fa-music"></i>
    </button>
    <div className={"grid grid-cols-12 max-w-[900px] gap-2 fixed bottom-3 left-1/3"}>
        {player1Cards.map((card, cardIndex) => {
          const imagePath = images[`../assets/cards-front/${card}.png`]?.default || '';
          return (
            <button value={card} key={cardIndex} className='shadow-lg rounded-lg' onClick={() => {checkCardValidity(card);
            }}>
            <img
              src={imagePath}
              alt={`Card ${card}`}
              className='hover:brightness-75 max-w-28'
            />
            </button>
          );
        })}
      </div>
      {/* rendering played Card */}
      <img
        src={images[`../assets/cards-front/${playedCard}.png`]?.default}
        alt={`Card ${playedCard}`}
        className='max-w-40 fixed top-1/3 lg:left-[700px] left-1/2'
      /> 
    
      {/* rendering Deck of Cards */}

     <button onClick={() => {
      handleDeckOfCards()
     }}>   
    <img
        src={images[`../assets/cards-front/card-back.png`]?.default}
        alt={'Deck of cards'}
        className='max-w-40 fixed top-1/3 left-20'
        
      /> 
      
      </button>
      <div className='fixed bottom-1/4 left-10'>
  
  {chooseColor && arr.map((color, index) => (
    <button
      key={index}
      value={color}
      className='bg-white rounded-md p-2 m-2 hover:bg-slate-400'
      onClick={async () =>{
        showToast(`You set the color to ${color}`, { type: "success" });
          setCurrColor(color.slice(0, 1));
          setChooseColor(false);
    
      }
    }
    >
      {color}
    </button>
  ))}
</div>

      {/* rendering player2 cards */}
    <div className="grid grid-cols-12 max-w-[900px] gap-2 fixed top-3 left-1/3">
      {player2Cards.map((card, cardIndex) => {
        const imagePath = images[`../assets/cards-front/card-back.png`]?.default || '';
        return (
          <button value={card} key={cardIndex} className='shadow-lg rounded-lg'>
          <img
            src={imagePath}
            alt={`Card ${card}`}
            className=' max-w-28  '
          />
          </button>
        );
      })}
    </div>
    </>

  )
}
    </div>
  );
};

export default PlayerCards;
