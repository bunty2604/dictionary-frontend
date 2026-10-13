
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/home";
import Dictionary from "./pages/dictionary";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <section className="app-panel">
          <nav className="dictionary-nav">
            <NavLink to="/" end>
              Home
            </NavLink>

            <NavLink to="/dictionary">
              Dictionary Words
            </NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dictionary" element={<Dictionary />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
