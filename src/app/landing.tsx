"use client";
import { useEffect, useState, useRef } from "react";
import { textToSpeech } from "./api/deepgram/text-to-speech";
import { getLLMResponse } from "./services/ollamaService";


declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function Landing() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  const sendToBackend = async (message: string, modelKeyword?: string): Promise<void> => {
    setIsLoading(true);
    if (modelKeyword) setModel(modelKeyword);
    else if (!model) setModel("gemma2:2b");

    try {
      stopRecording();

      let introMessage = "", gptMessage = "", fullMessage;


      const commonPrompt = "Be precise and concise, never respond in more than 1-2 sentences! " + message;

      
      const userResponded = async (commonPrompt:string) => {

        
        await askQuestion(commonPrompt);
      };

      const askQuestion = async (question: string) => {
        const questionResponse = await getLLMResponse(question, true);

        textToSpeech(questionResponse)
        setIsProcessing(false)

      };

      userResponded(commonPrompt)
    } catch (error) {

      console.error("Error sending data to backend:", error);
    }

    setIsLoading(false);
  };

  const handleResult = (event: any): void => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      interimTranscript += event.results[i][0].transcript;
    }
    setTranscript(interimTranscript);
    silenceTimerRef.current = setTimeout(() => {
      setModel("gemma2:2b");
      sendToBackend(interimTranscript);
      setTranscript("");
      
    }, 2000);
    
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setResponse("");
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    recognitionRef.current.start();

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
        
        stopRecording()
        setTranscript("")
        setResponse("")
        sendToBackend("Provide the next question", model)
        textToSpeech("Okay so let us move to the next question")
        console.log("not knowing")
      }
    }, 10000); 
  };

  useEffect(
    () => () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    },
    []
  );

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const handleToggleRecording = () => {
    if (!isRecording) startRecording();
    else if (isRecording) stopRecording();
  };

  return (
    <main className="flex flex-col h-screen flex-center items-center bg-gray-100 mt-1">
      {(isRecording || transcript || response) && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full m-auto p-4 bg-white">
          <div className="flex justify-center items-center w-full">
            <div className="text-center">
              <p className="text-xl font-bold">{isRecording ? "Listening" : ""}</p>
              {/* {transcript && (
                <div className="p-2 h-full mt-4 text-center">
                  <p className="text-lg mb-0">{transcript}</p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-full h-screen" style={{margin:'auto'}}>
            <div className="flex items-center h-screen">
              <button
                onClick={handleToggleRecording}
                className={`flex items-center justify-center ${
                  isRecording ? "bg-green-500 w-28 h-28 text-white animate-pulse" : "w-28 h-28 bg-red-500 text-white"
                } rounded-full w-28 h-28 m-auto focus:outline-none`}
              >
                Gemma
              </button>
          </div>
        </div>
      </div>
    </main>
  );
}
