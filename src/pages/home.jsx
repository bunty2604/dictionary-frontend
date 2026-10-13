
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/words";

function Home() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word.trim(),
          meaning: meaning.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add word");
      }

      setWord("");
      setMeaning("");

      alert(data.message || "Word added successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="home-page">
      <header className="header-block">
        <span className="eyebrow">Word Book</span>
        <h1>My Dictionary</h1>
        <p>Add new words and their meanings.</p>
      </header>

      <form className="dictionary-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="word">Word</label>
          <input
            id="word"
            className="text-input"
            placeholder="Enter word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="meaning">Meaning</label>
          <textarea
            id="meaning"
            className="text-area"
            placeholder="Enter meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            required
          />
        </div>

        <div className="button-row">
          <button className="primary-button" type="submit">
            Add Word
          </button>

          <Link className="secondary-button" to="/dictionary">
            View Dictionary
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Home;
