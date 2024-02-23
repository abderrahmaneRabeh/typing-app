import { useState, useEffect,useRef } from "react";
import { generate } from "random-words";

const NUM_OF_WORDS = 150;
const SECONDS = 20;

export default function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [currentChar, setCurrentChar] = useState("")
  const [correct, setCorrect] = useState(0);
  const [Incorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null)
  const generateWords = () => {
    return new Array(NUM_OF_WORDS).fill(null).map(() => generate());
  };

  const start = () => {
    if (status !== "started") {
      setStatus('started')
      let interval = setInterval(() => {
        setCountDown((countDown) => {
          if (countDown === 0) {
            clearInterval(interval);
            setStatus('finished');
            setCurrentInput("")
            return SECONDS
          } else {
            return countDown - 1;
          }
        });
      }, 1000);
    } 
    if (status ==='finished'){
      setWords(generateWords())
      setCurrentWordIndex(0)
      setCorrect(0)
      setInCorrect(0)
      setCurrentIndex(-1);
      setCurrentChar(""); 
    }


  };

  const checkMatch = () => {
    const wordToCompare = words[currentWordIndex];
    const doesItMatch = wordToCompare === currentInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setInCorrect(Incorrect - 1);
    }
  };

  const getCharIndex = (wordIndx,charIndx,char) =>{
    if(wordIndx === currentWordIndex && charIndx === currentIndex && currentChar && status !== 'finished'){
      if (currentChar === char) {
        return 'has-background-success';
      }else {
        return 'has-background-danger';
      }
    }else if (wordIndx === currentWordIndex &&currentChar >= words[currentWordIndex].length){
      return 'has-background-danger';
    } else{
      return '';
    }
  }

  const handleKeyDown = ({ keyCode,key }) => {
    if (keyCode === 32) {
      checkMatch();
      setCurrentInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentIndex(-1)
    }else if(keyCode === 8){
      setCurrentIndex(currentIndex-1);
      setCurrentChar("");
    }else{
      setCurrentIndex(currentIndex+1)
      setCurrentChar(key)
    }
  };

  useEffect(() => {
    if(status === 'started'){
      textInput.current.focus()
    }
  }, [status]);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  return (
    <div>
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
        <div className="control is-expanded">
          <input
           ref={textInput}
            disabled={status !== "started"}
            type="text"
            className="input"
            onKeyDown={handleKeyDown}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        </div>
      </div>
      <div className="section">
        <button onClick={start} className="button button is-info is-fullwidth">
          start
        </button>
      </div>
      {status === "started" && (
        <div className="card section">
          <div className="card-content">
            <div className="content">
              {words.map((word, i) => {
                return (
                  <span key={i}>
                    <span>
                      {word.split("").map((letter, j) => {
                        return (
                          <span className={getCharIndex(i,j,letter)} key={j}>
                            {letter}
                          </span>
                        );
                      })}
                    </span>
                    <span> </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">WPM</p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered ">
              <div className="is-size-5">Accuracy</div>
              <p className="has-text-info is-size-1">
                {Math.round((correct/(correct+Incorrect))*100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
