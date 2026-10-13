
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/words";

function Dictionary() {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  // Fetch all words
  const fetchWords = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch words");
      }

      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend. Check your server.");
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Search by word or meaning
  const filteredWords = words.filter((item) => {
    const searchText = search.trim().toLowerCase();

    return (
      item.word.toLowerCase().includes(searchText) ||
      item.meaning.toLowerCase().includes(searchText)
    );
  });

  // Load selected word into edit form
  const handleEdit = (item) => {
    setEditId(item.id);
    setWord(item.word);
    setMeaning(item.meaning);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update word
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
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
        throw new Error(data.message || "Failed to update word");
      }

      setEditId(null);
      setWord("");
      setMeaning("");

      await fetchWords();
      alert(data.message || "Word updated successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setWord("");
    setMeaning("");
  };

  // Delete word
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this word?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete word");
      }

      await fetchWords();
      alert(data.message || "Word deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="words-section">
      <header className="header-block">
        <span className="eyebrow">Your Collection</span>
        <h1>Dictionary Words</h1>
        <p>Search and manage your vocabulary.</p>
      </header>

      {/* Edit form */}
      {editId !== null && (
        <form className="dictionary-form" onSubmit={handleUpdate}>
          <h2>Edit Word</h2>

          <div className="field-group">
            <label htmlFor="edit-word">Word</label>
            <input
              id="edit-word"
              className="text-input"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="edit-meaning">Meaning</label>
            <textarea
              id="edit-meaning"
              className="text-area"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>

          <div className="button-row">
            <button className="primary-button" type="submit">
              Update Word
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="field-group search-group">
        <label htmlFor="search">Search Dictionary</label>

        <input
          id="search"
          className="text-input"
          type="search"
          placeholder="Search by word or meaning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button
            className="link-button"
            type="button"
            onClick={() => setSearch("")}
          >
            Clear search
          </button>
        )}
      </div>

      {/* Words list */}
      <div className="section-heading">
        <h2>All Words</h2>
        <span className="count-badge">{filteredWords.length}</span>
      </div>

      {filteredWords.length === 0 ? (
        <p className="empty-state">
          {search.trim()
            ? `No matching words found for "${search}".`
            : "No words found. Add your first word from Home!"}
        </p>
      ) : (
        filteredWords.map((item) => (
          <article key={item.id} className="word-card">
            <div className="word-header">
              <h3>{item.word}</h3>

              <div className="card-actions">
                <button
                  className="link-button"
                  type="button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="link-button danger"
                  type="button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="word-meaning">
              <span>Meaning</span>
              {item.meaning}
            </p>
          </article>
        ))
      )}
    </section>
  );
}

export default Dictionary;
