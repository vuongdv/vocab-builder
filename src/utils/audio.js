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

export const playExampleAudio = async (text, customAudioUrl) => {
  if (customAudioUrl && customAudioUrl.trim() !== '') {
    try {
      const audio = new Audio(customAudioUrl.trim());
      await audio.play();
      return;
    } catch (error) {
      console.error('Failed to play custom example audio URL, falling back to TTS', error);
    }
  }

  if (!text) return;
  // Xoá các ký tự gạch đầu dòng mọc định nếu có để đọc cho mượt
  const cleanText = text.replace(/^[-*•]\s*/, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US'; 
  window.speechSynthesis.speak(utterance);
};
