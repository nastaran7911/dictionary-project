import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import "./Dictionary.css";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchWord = async (e) => {
    e.preventDefault();
    if (!word) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setResults(response.data[0]);
    } catch (err) {
      setError("Word not found. Please try another search.");
    }
    setLoading(false);
  };

  const playAudio = (audioUrl) => {
    new Audio(audioUrl).play();
  };

  return (
    <div className="Dictionary">
      <h1>Dictionary</h1>
      <form onSubmit={searchWord}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="Loading">Loading...</p>}
      {error && <p className="Error">{error}</p>}

      {results && (
        <div className="Results">
          <div className="Word-header">
            <h2>
              {results.word}
              <span className="Phonetic">{results.phonetic}</span>
              {results.phonetics[0]?.audio && (
                <button
                  className="SoundButton"
                  onClick={() => playAudio(results.phonetics[0].audio)}
                >
                  <FontAwesomeIcon icon={faVolumeUp} />
                </button>
              )}
            </h2>
          </div>

          {results.meanings.map((meaning, index) => (
            <div key={index} className="Meaning">
              <h3>{meaning.partOfSpeech}</h3>
              {meaning.definitions.map((definition, defIndex) => (
                <div key={defIndex} className="Definition">
                  <p>{definition.definition}</p>
                  {definition.example && (
                    <p className="Example">{definition.example}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dictionary;
