import React from 'react';
import { HiOutlineVolumeUp } from 'react-icons/hi';
import { playAudio } from '../utils/audio';
import './PronunciationButtons.css'; // We will create this for styling

export default function PronunciationButtons({ word, size = 20, isLarge = false }) {
  const handlePlay = (e, accent) => {
    e.stopPropagation(); // prevent card flip if inside flashcard
    playAudio(word, accent);
  };

  return (
    <div className={`pronunciation-buttons ${isLarge ? 'pronunciation-buttons-large' : ''}`}>
      <button 
        className="btn-icon play-btn play-uk" 
        onClick={(e) => handlePlay(e, 'uk')}
        title="Play British pronunciation"
      >
        <span className="accent-label">UK</span>
        <HiOutlineVolumeUp size={size} />
      </button>

      <button 
        className="btn-icon play-btn play-us" 
        onClick={(e) => handlePlay(e, 'us')}
        title="Play American pronunciation"
      >
        <span className="accent-label">US</span>
        <HiOutlineVolumeUp size={size} />
      </button>
    </div>
  );
}
