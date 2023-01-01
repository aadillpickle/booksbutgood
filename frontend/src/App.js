import 'react-chat-elements/dist/main.css'
import Chapter from "./pages/Chapter.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
