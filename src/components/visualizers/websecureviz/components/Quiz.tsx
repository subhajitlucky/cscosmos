'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function Quiz({ questions }: { questions: Question[] }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentQuestion].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-card border rounded-xl p-8 text-center space-y-6">
         <h2 className="text-2xl font-bold">Quiz Complete!</h2>
         <div className="text-4xl font-extrabold text-primary">
            {score} / {questions.length}
         </div>
         <p className="text-muted-foreground">
            {score === questions.length ? "Perfect score! You are a security master." : "Good effort! Review the topics to improve your score."}
         </p>
         <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Restart Quiz
         </Button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="bg-card border rounded-xl p-8 space-y-8 max-w-2xl mx-auto">
       <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
       </div>

       <h3 className="text-xl font-bold">{q.question}</h3>

       <div className="space-y-3">
          {q.options.map((opt, i) => (
             <button
               key={i}
               onClick={() => handleSelect(i)}
               disabled={isAnswered}
               className={`w-full text-left p-4 rounded-lg border transition-all ${
                 isAnswered 
                   ? i === q.correctIndex 
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : i === selectedOption
                        ? "bg-red-100 border-red-500 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        : "opacity-50"
                   : "hover:bg-accent hover:border-primary"
               }`}
             >
                <div className="flex items-center justify-between">
                   <span>{opt}</span>
                   {isAnswered && i === q.correctIndex && <CheckCircle className="h-5 w-5 text-green-600" />}
                   {isAnswered && i === selectedOption && i !== q.correctIndex && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
             </button>
          ))}
       </div>

       <AnimatePresence>
         {isAnswered && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }} 
               animate={{ opacity: 1, height: "auto" }}
               className="bg-muted/50 p-4 rounded-lg text-sm"
            >
               <p className="font-bold mb-1">Explanation:</p>
               <p>{q.explanation}</p>
               <div className="mt-4 flex justify-end">
                  <Button onClick={nextQuestion}>
                     {currentQuestion === questions.length - 1 ? "Finish" : "Next Question"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
