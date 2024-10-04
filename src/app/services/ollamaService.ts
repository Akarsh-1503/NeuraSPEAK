import dotenv from "dotenv";
import { Ollama } from "@langchain/community/llms/ollama";

dotenv.config();

let questionIndex = 0;
const mlQuestions = [
  "What is overfitting, and how can you prevent it?",
  "Explain the difference between supervised and unsupervised learning.",
  "How does gradient descent work?",
  "What is the bias-variance tradeoff?",
  "Explain the use of cross-validation in model evaluation.",
  "How does a decision tree algorithm work?",
  "What is the purpose of regularization?"
];

const llm = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "gemma2:2b",
});


export const getLLMResponse = async (userText: string, interviewing:Boolean): Promise<string> => {
  
  try {
    
    let prompt;

    if(questionIndex<mlQuestions.length && interviewing==true){

      if(questionIndex == 0){
        prompt= `You are an interviewer conducting a technical interview on Machine Learning. 
        This is starting of interview so greet the candidate and ask the candidate a technical interview question in atmost 1-2 sentence based on this context:
        "${mlQuestions[questionIndex]}, .`
      }
      else if (questionIndex == 2 || questionIndex == 4) {
        
        prompt = `The candidate responded: "${userText}". You must provide a follow-up question to candidate in atmost 1-2 sentence. in conversational tone `;
      } else {
        
        prompt = `The candidate responded: "${userText}". Ask the candidate a technical interview question in atmost 1-2 sentence on the given context in conversational tone:
        "${mlQuestions[questionIndex]}".`;
      }
    
    }
    else{
      prompt = `This is the end of a technical interview on Machine Learning. Give greetings as if you were taking the interview to end interview in atmost 1-2 sentence.`;
    }
    questionIndex= questionIndex+1;



    const gptMessage = await llm.invoke(
      prompt,
    );


    return gptMessage;
  } catch (error) {
    console.error("Error invoking Ollama model:", error);
  return "Sorry it looks like some technical error occurred at my end. Were you able to listen the question?"
  }
};
