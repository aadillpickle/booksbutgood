import 'react-chat-elements/dist/main.css'
import Chapter from "./pages/Chapter.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactGA from 'react-ga';
ReactGA.initialize('G-BFGZ10KN5V');
ReactGA.pageview(window.location.pathname + window.location.search);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Chapter/>} />
        <Route path="/chapter/:id" element={<Chapter/>} />
      </Routes>
    </Router>
  );
};

export default App;
