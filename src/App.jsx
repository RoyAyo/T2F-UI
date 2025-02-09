import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './pages/Chat';
import Home from './pages/Home';

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<>Hello world</>} /> */}
        <Route path="/" Component={Home} />
        <Route path="/chat" Component={Chatbot} />
      </Routes>
    </Router>
  )
}

export default App
