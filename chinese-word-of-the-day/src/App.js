import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import chineseWords from './chinese_words.csv'; // Adjust the path as necessary
import './App.css'; // Import the CSS file
import cheerSound from './sounds/cheer.mp3'; // Import the cheer sound
import Confetti from 'react-confetti';

const App = () => {
  const [wordList, setWordList] = useState([]);
  const [targetWord, setTargetWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [strikes, setStrikes] = useState(0);
  const [isWrongGuess, setIsWrongGuess] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const cheerAudio = useRef(new Audio(cheerSound)); // Create a ref for the cheer audio

  useEffect(() => {
    // Load and parse the CSV file
    Papa.parse(chineseWords, {
      download: true,
      header: true,
      complete: (result) => {
        setWordList(result.data);
        const randomWord = result.data[Math.floor(Math.random() * result.data.length)];
        setTargetWord(randomWord);
      }
    });
  }, []);

  const handleGuessChange = (event) => {
    setGuess(event.target.value.substr(0, targetWord.word.length));
    setIsWrongGuess(false); // Reset wrong guess indicator when typing
  };

  const handleGuessSubmit = (event) => {
    event.preventDefault();
    if (guess.length !== targetWord.word.length) return;

    if (guess === targetWord.word) {
      cheerAudio.current.play(); // Play the cheer sound
      setIsWinner(true);
    } else {
      setStrikes(prevStrikes => prevStrikes + 1);
      setIsWrongGuess(true); // Set wrong guess indicator
      if (strikes + 1 >= 6) {
        alert(`Game Over! The word was ${targetWord.word}.`);
        startNewGame();
      }
    }

    setGuess('');
  };

  const startNewGame = () => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(newWord);
    setStrikes(0);
    setGuess('');
    setIsWrongGuess(false); // Reset wrong guess indicator
    setIsWinner(false);
  };

  if (!targetWord) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Guess the Chinese Word</h1>
      {isWinner && <Confetti />}
      {!isWinner ? (
        <>
          <p>Guess the {targetWord.word.length}-character word!</p>
          <form onSubmit={handleGuessSubmit}>
            <input
              type="text"
              value={guess}
              onChange={handleGuessChange}
              maxLength={targetWord.word.length}
              className={`guess-input ${isWrongGuess ? 'wrong' : ''}`}
            />
            <button type="submit">Guess</button>
          </form>
        </>
      ) : (
        <div>
          <p>Congratulations! You guessed the word!</p>
          <button onClick={startNewGame}>Start New Game</button>
        </div>
      )}

      <div>
        <p><strong>Strikes:</strong> {strikes} / 5</p>
      </div>
      <div>
        {strikes >= 0 && <p><strong>English:</strong> {targetWord.word_eng}</p>}
        {strikes >= 1 && <p><strong>Sentence:</strong> {targetWord.sentence.replace(targetWord.word, "_".repeat(targetWord.word.length))}</p>}
        {strikes >= 2 && (
          <>
            <audio controls src={targetWord.sound}>Your browser does not support the audio element.</audio>
            <audio controls src={targetWord.sentence_sound}>Your browser does not support the audio element.</audio>
          </>
        )}
        {strikes >= 3 && <p><strong>Pinyin:</strong> {targetWord.word_pinyin}</p>}
        {strikes >= 4 && <p><strong>Sentence Pinyin:</strong> {targetWord.sentence_pinyin}</p>}
        
      </div>
    </div>
  );
};

export default App;
