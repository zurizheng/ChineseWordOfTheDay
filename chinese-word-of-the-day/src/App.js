import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import chineseWords from './chinese_words.csv'; // Adjust the path as necessary
import './App.css'; // Import the CSS file

const App = () => {
  // Your existing component code
  const [wordList, setWordList] = useState([]);
  const [targetWord, setTargetWord] = useState(null);
  const [guess, setGuess] = useState('');
  const [strikes, setStrikes] = useState(0);
  const [isWrongGuess, setIsWrongGuess] = useState(false);

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
      alert('Congratulations! You guessed the word!');
      startNewGame();
    } else {
      setStrikes(prevStrikes => prevStrikes + 1);
      setIsWrongGuess(true); // Set wrong guess indicator
      if (strikes + 1 >= 7) {
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
  };

  if (!targetWord) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Guess the Chinese Word</h1>
      <p>Guess the {targetWord.word.length}-character word!</p>
      <form onSubmit={handleGuessSubmit}>
        <input
          type="text"
          value={guess}
          onChange={handleGuessChange}
          maxLength={targetWord.word.length}
          className={`guess-input ${isWrongGuess ? 'wrong' : ''}`} // Change input background color on wrong guess
        />
        <button type="submit">Guess</button>
      </form>
      <div>
        <p><strong>Strikes:</strong> {strikes} / 7</p>
      </div>
      <div>
        {strikes >= 1 && <p><strong>Pinyin:</strong> {targetWord.word_pinyin}</p>}
        {strikes >= 2 && <p><strong>English:</strong> {targetWord.word_eng}</p>}
        {strikes >= 3 && <p><strong>Sentence:</strong> {targetWord.sentence.replace(targetWord.word, "_".repeat(targetWord.word.length))}</p>}
        {strikes >= 4 && <p><strong>Sentence Pinyin:</strong> {targetWord.sentence_pinyin}</p>}
        {strikes >= 5 && <p><strong>Sentence English:</strong> {targetWord.sentence_eng}</p>}
        {strikes >= 6 && (
          <>
            <audio controls src={targetWord.sound}>Your browser does not support the audio element.</audio>
            <audio controls src={targetWord.sentence_sound}>Your browser does not support the audio element.</audio>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
