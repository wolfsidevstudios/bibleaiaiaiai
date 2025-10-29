import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { ArrowLeft, Check, X, Award, Repeat } from 'lucide-react';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const quiz = quizzes.find(q => q.id === quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-2xl mb-4">Quiz not found</h2>
        <Link to="/search" className="text-yellow-400 hover:underline">Go back to Explore</Link>
      </div>
    );
  }

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  if (isQuizFinished) {
    return (
      <div className="bg-black text-white min-h-screen p-4 flex flex-col items-center justify-center text-center">
        <Award size={64} className="text-yellow-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-lg text-gray-300 mb-4">You scored</p>
        <p className="text-6xl font-bold mb-6">{score} <span className="text-3xl text-gray-400">/ {quiz.questions.length}</span></p>
        <div className="w-full max-w-md space-y-4">
             <button onClick={handleRestartQuiz} className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
                <Repeat size={20}/>
                Try Again
            </button>
            <Link to="/search" className="block w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                Back to Explore
            </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <Link to="/search" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold">{quiz.title}</h1>
        <div className="w-6"></div>
      </header>

      <div className="p-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
          <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-center text-sm text-gray-400 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      </div>

      <main className="flex-grow flex flex-col justify-center p-6 text-center">
        <h2 className="text-2xl font-semibold leading-relaxed mb-8">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map(option => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;

            let buttonClass = "bg-gray-800 hover:bg-gray-700";
            if(isAnswered) {
                if(isCorrect) {
                    buttonClass = "bg-green-600 text-white";
                } else if (isSelected && !isCorrect) {
                    buttonClass = "bg-red-600 text-white";
                } else {
                    buttonClass = "bg-gray-800 opacity-50";
                }
            }

            return (
                <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg font-semibold text-lg transition-all duration-300 flex justify-between items-center ${buttonClass}`}
                >
                {option}
                {isAnswered && isCorrect && <Check size={24}/>}
                {isAnswered && isSelected && !isCorrect && <X size={24}/>}
                </button>
            );
          })}
        </div>
      </main>

      {isAnswered && (
          <footer className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">{selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite!"}</p>
                    <p className="text-sm text-gray-300"><span className="font-semibold">{currentQuestion.reference}:</span> {currentQuestion.explanation}</p>
                </div>
                <button onClick={handleNextQuestion} className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
          </footer>
      )}
    </div>
  );
};

export default QuizPage;
