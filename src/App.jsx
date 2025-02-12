import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Chatbot from './pages/Chat';
// import Home from './pages/Home';
import TweetToFart from './pages/Tweet';

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<>Hello world</>} /> */}
        {/* <Route path="/" Component={Home} /> */}
        <Route path="/" Component={TweetToFart} />
        {/* <Route path="/chat" Component={Chatbot} /> */}
      </Routes>
    </Router>
  )
}

export default App
