export const playAudio = async (text, accent = 'us') => {
  if (!text) return;

  try {
    // Attempt to fetch pronunciation from Free Dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
    if (response.ok) {
      const data = await response.json();
      
      let audioUrl = null;
      let anyAudioUrl = null;

      if (data && data.length > 0 && data[0].phonetics) {
        for (const phonetic of data[0].phonetics) {
          if (phonetic.audio) {
            anyAudioUrl = anyAudioUrl || phonetic.audio;
            // Look for specific accent (e.g. -uk.mp3 or -us.mp3)
            if (phonetic.audio.includes(`-${accent}.mp3`)) {
              audioUrl = phonetic.audio;
              break;
            }
          }
        }
      }

      // If specific accent not found, try to use any available audio as a soft fallback? 
      // Actually strictly following the Longman approach, if we don't have the specific MP3, 
      // TTS fallback with correct accent is better than playing the wrong accent mp3.
      // But let's fallback to TTS if specific mp3 is missing to guarantee accent correctness.

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
        return;
      }
    }
  } catch (error) {
    console.error('Failed to fetch audio from dictionary API, falling back to TTS', error);
  }

  // Graceful fallback to the native browser text-to-speech with specific accent
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
  window.speechSynthesis.speak(utterance);
};
