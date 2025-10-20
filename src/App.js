import './App.css';
import Header from './components/Header';
import "./styles.css";
import Results from './components/Results';
import { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Question from './components/Question';


function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
  ];

  const keywords = {
    Fire: 'fire',
    Water: 'water',
    Earth: 'earth',
    Air: 'air',
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  function handleAnswer(answer){
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };


  function determineElement(answers){
    const counts = {};
    answers.forEach(function(answer){
      const element = elements[answer];
      counts[element] = (counts[element] || 0) +1;
    });
    return Object.keys(counts).reduce(function(a,b){
      return counts[a] > counts[b] ? a : b
    });
  };

  async function fetchArtwork(keyword){
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`
      );
      
      if(!response.ok) {
        throw new Error('Failed to fetch results!');
      }

      const data = await response.json();
      const objectIDs = data.objectIDs;

      if (!objectIDs || objectIDs.length === 0) {
        throw new Error('No artworks found for this keyword');
      }

      const objectResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[0]}`
      );

      if (!objectResponse.ok){
        throw new Error('Failed to fetch artwork details!');
      }

      const objectData = await objectResponse.json();

      setArtwork(objectData);
    } catch(err){
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(
    function(){
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement])
      }
    },
    [currentQuestionIndex]
  );


  return (
    <UserProvider>
      <div className='App'>
        <Header />
        <Routes>
          <Route path='/' element={<UserForm/>} />
          <Route
            path='/quiz'
            element={
              currentQuestionIndex < questions.length ? (
                <Question
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
        {loading && <p>Loading artwork...</p>}
        {error && <p>Error: {error}</p>}
      </div>
    </UserProvider>
  );
}

export default App;
