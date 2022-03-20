import React, {useState, useEffect} from 'react'
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, get} from "firebase/database"
import "./quiz.css"
import {Container} from 'react-bootstrap'
var firebaseConfig = {
    apiKey: "AIzaSyAwzjY4glLzS6jy9TTQwyYBkhO8FmPzECA",
  authDomain: "udemy-quiz-1eef0.firebaseapp.com",
  databaseURL: "https://udemy-quiz-1eef0-default-rtdb.firebaseio.com",
  projectId: "udemy-quiz-1eef0",
  storageBucket: "udemy-quiz-1eef0.appspot.com",
  messagingSenderId: "551914711827",
  appId: "1:551914711827:web:6396905572261e8a6f48e6"
}
const app = initializeApp(firebaseConfig)
var db = getDatabase(app);
const dbRef = ref(db, 'quiz');

const getQuestions = async () => {
    try{
        const questions = await get(dbRef);
      
        return questions.val();

    }catch(error){
        console.log(error)
    }
}
const QuizQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        getQuestions().then(questions => {
            setQuestions(questions);
            setIsLoading(false);
        })
    }, [])
    

    const AnsweredQuestion = (answer) =>{
        setIsAnswered(true)
        if(answer === questions[currentQuestion].correct_answer){    
            setScore(score + 1);
        }
        const nextQuestion = currentQuestion + 1;
        
        setTimeout(()=>{
            if(nextQuestion === questions.length){
                setIsFinished(true);
            }else{
                setCurrentQuestion(nextQuestion);
                
            }
          setIsAnswered(false)
        }, 1000)
      }
 
    const nextQuestion = () => {
        
        setIsAnswered(false);
      
        const nextQuestion = currentQuestion + 1;
       
        if(nextQuestion === questions.length){
            setIsFinished(true);
        }else{
            setCurrentQuestion(nextQuestion);
           
        }
    }
    if(isLoading){
        return <div>Loading...</div>
    }
    if(isFinished){
        return (
            <div className='score'>
                <h1>Your score is {score}</h1>
                <button className='restart' onClick={()=>{
                    window.location.reload();
                }    
            }>Restart</button>
            </div>
        )   
    }
    
    return (
        
        <>
            <div className='header'>
            <h1>{questions[currentQuestion].question}</h1>  
          
            </div>
            <Container className='optionsContainer'>
                {questions[currentQuestion].options.map((answer, i) => (
                    <div key={i}>
                        <button className={isAnswered?  (answer===questions[currentQuestion].correct_answer ? 'correct':'incorrect'):'not-selected'}
                         onClick={() =>AnsweredQuestion(answer)}>{answer}</button>
                    </div>
                ))}
            </Container>
<br></br>
            <button className='skip' onClick={nextQuestion}>Skip</button>
        </>
    )   
}
export default QuizQuestions

