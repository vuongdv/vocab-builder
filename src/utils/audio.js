export const playAudio = async (wordObj, accent = 'us') => {
  if (!wordObj || !wordObj.word) return;

  const audioUrl = accent === 'uk' ? wordObj.ukAudio : wordObj.usAudio;

  if (audioUrl && audioUrl.trim() !== '') {
    try {
      const audio = new Audio(audioUrl.trim());
      await audio.play();
      return;
    } catch (error) {
      console.error('Failed to play custom audio URL, falling back to TTS', error);
    }
  }

  // Graceful fallback to the native browser text-to-speech with specific accent
  const utterance = new SpeechSynthesisUtterance(wordObj.word);
  utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
  window.speechSynthesis.speak(utterance);
};
