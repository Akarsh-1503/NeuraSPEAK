

export const textToSpeech = (text: string) => {
  if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
  }
};
