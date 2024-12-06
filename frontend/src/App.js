import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import FriendList from './components/friend';
import CreateEvent from './components/eventcreate';
import EventList from './components/eventlist';
import EventDetails from './components/eventdetail';
import MiniGameQuiz from './components/quizIT';
import ListTopic from './components/listtopicquiz';
import UniverseQuiz from './components/quizUniverse';
import HistoryVNQuiz from './components/quizHistoryVN';
import HistoryWQuiz from './components/quizHistoryWorld';
import GeographyQuiz from './components/quizGeography';
import MathQuiz from './components/quizMath';
import LiteratureQuiz from './components/quizLiterature';
import Home from './components/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/header" element={<Header />} />
        <Route path="/friend" element={<FriendList />} />
        <Route path="/event" element={<CreateEvent />} />
        <Route path="/eventlist" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/quizit" element={<MiniGameQuiz />} />
        <Route path="/topic" element={<ListTopic />} />
        <Route path="/quizuniverse" element={<UniverseQuiz />} />
        <Route path="/quizhistoryvn" element={<HistoryVNQuiz />} />
        <Route path="/quizhistory" element={<HistoryWQuiz />} />
        <Route path="/quizgeo" element={<GeographyQuiz />} />
        <Route path="/quizmath" element={<MathQuiz />} />
        <Route path="/quizlit" element={<LiteratureQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
