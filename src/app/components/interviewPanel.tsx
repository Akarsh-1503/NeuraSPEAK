'use client';

import React, { useState } from 'react';
import { getLLMResponse } from '../services/ollamaService';
import { textToSpeech } from '../api/deepgram/text-to-speech';

const questions = [
  "What is overfitting, and how can you prevent it?",
  "Explain the difference between supervised and unsupervised learning.",
  "How does gradient descent work?",
  "What is the bias-variance tradeoff?",
  "Explain the use of cross-validation in model evaluation.",
  "How does a decision tree algorithm work?",
  "What is the purpose of regularization?"
];

export default function InterviewPanel() {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isPaused, setIsPaused] = useState(false);


  const startInterview = async () => {
    setIsInterviewing(true);
    setIsPaused(false)
    setIsProcessing(true)
    if(!isPaused)
      await askQuestion(questions[currentQuestion]);
  };

  const askQuestion = async (question: string) => {
    const questionResponse = await getLLMResponse(question, true);

    setIsProcessing(false)
    textToSpeech(questionResponse)
  };


  const pauseInterview = () => {
    setIsPaused(true);
    textToSpeech("Okay lets take a quick break")
  };

  const resumeInterview = () => {
    setIsPaused(false);
    textToSpeech("Let’s get back to it and start again!")
  };

  const endInterview = async () => {
    setIsInterviewing(false);
    setIsPaused(false);
    if(true){
      const questionResponse = await getLLMResponse("Thanks for this opportunity.", false);
      textToSpeech(questionResponse)
    }
  };


  return (
    <>
      <h1 className="text-3xl mb-2 ml-1 mt-3">NeuraSpeak</h1>
      <h6 className="text mb-3 ml-1 mt-0"><i>A Voice-Interactive application for a technical interview on machine learning</i></h6>
      <div>
      <button
        onClick={startInterview}
        style={{width:'200px'}}
        disabled={isInterviewing}
        className="bg-blue-500 text-white py-2 px-4 ml-1 mb-2 rounded mr-2 cursor-pointer"
      >
        {isPaused? 'Interview is Paused' : isInterviewing ? 'Interview in Progress' : 'Start Interview'}
      </button>
      <button
        onClick={pauseInterview}
        style={{width:'200px'}}
        disabled={!isInterviewing || isPaused}
        className="bg-blue-500 text-white py-2 px-4 ml-1 mb-2 rounded mr-2 cursor-pointer"
      >
        Pause Interview
      </button>
      <button
        onClick={resumeInterview}
        style={{width:'200px'}}
        disabled={!isPaused}
        className="bg-blue-500 text-white py-2 px-4  ml-1 mb-2 rounded mr-2 cursor-pointer"
      >
        Resume Interview
      </button>
      <button
        onClick={endInterview}
        style={{width:'200px'}}
        disabled={!isInterviewing}
        className="bg-blue-500 text-white py-2 px-4  ml-1 mb-2 rounded cursor-pointer"
      >
        End Interview
      </button>
    </div>
    
    </>
    );
}
