
  // Fisher Yates Shuffle Algo 
 export function shuffleCards(array){
    for(let i = array.length - 1; i>0; i-- ){
      const j = Math.floor(Math.random() * i+1);
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
  }

  // handle Player clicking Card
  // Handle Player 1's card click
export function handleClickPlayer1Card(card) {
  // Set the played card
  setPlayedCard(card);

  // Update Player 1's cards by filtering out the played card
  setPlayer1Cards((prev) => prev.filter((item) => item !== card));
  setCurrPlayer(2);
  checkWin();

}

// Handle Player 2's card click
export function handleClickPlayer2Card(card) {
  // Set the played card
  setPlayedCard(card);

  // Update Player 2's cards by filtering out the played card
  setPlayer2Cards((prev) => prev.filter((item) => item !== card));
  setCurrPlayer(1);
  checkWin();
}



 
export function checkCardValidity(card) {
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
  

export function handleDeckOfCards() {
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
        setCurrPlayer(2);

      // } else {
      //   setPlayer2Cards((prev) => [...prev, card]);
      //   showToast("Computer drew a card!", { type: "success" });
      // }
    }
  }

export function handleComputerDrawCards(){ 
    // if (
    //   player2Cards.some(
    //     (card) =>
    //       card.slice(-1) === currColor || card.slice(-1) === 'W' || card.slice(0, 1) === currValue
    //   )
    // ) {
    //     handleClickPlayer2Card()
    // } else {
      const card = deckOfCards[0];
      const newDeck = deckOfCards.slice(1);
      setDeckOfCards(newDeck);
        setPlayer2Cards((prev) => [...prev, card]);
        showToast("Computer drew a card!", { type: "success" });
     
    // }
  }

  // handle turns
 export function handleTurn() {
    setCurrPlayer(currPlayer === 1 ? 2 : 1); // Switch between player 1 and player 2
  }
  // handle skip
 export function handleSkip() {
    setCurrPlayer(currPlayer === 1 ? 2 : 1); // Skip to the next player
  }


 export function ComputerLogic() {
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
        RandomColor = randomColor === 'R' ? 'Red' : randomColor === 'B' ? 'Blue' : randomColor === 'G' ? "Green" : 'Yellow' 
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
    } else if (currValue === 'D') {
      // Draw 2 logic
      for (let i = 0; i < 2; i++) {
        handleComputerDrawCards();
      }
    } else {
      // No valid cards to play, draw a card
      handleComputerDrawCards();
    }
  
    // End computer's turn and switch back to player
    handleTurn();
  }
  

export function checkWin() {
    if(player1Cards.length === 0){
      console.log(player1Cards.length)
      showToast("YOU WIN!", { type: "success" });
    }
    else if(player2Cards.length === 0){
      showToast("COMPUTER WINS!", { type: "success" });

    }
  }






  
