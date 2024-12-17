import { useState } from "react"
import packOfCards from "./utils/packOfCards";
import GameLogic from "./components/GameLogic";



function App() {

  const [player, setPlayer] = useState(1);
  
  return (
    <>
    <GameLogic/>
    </>
  )
}

export default App
