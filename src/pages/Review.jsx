import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { HiOutlineVolumeUp, HiArrowRight, HiArrowLeft, HiRefresh } from 'react-icons/hi';
import PronunciationButtons from '../components/PronunciationButtons';
import './Review.css';

export default function Review() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, `users/${currentUser.uid}/vocab_words`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWords(wordsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 200);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setCurrentIndex(0);
    }, 200);
  };

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="loading-state">Loading vocabulary for review...</div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="empty-state glass-panel">
          <p>No words saved yet. Add some words in the Dashboard first!</p>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="home-container review-page">
      <Navbar />
      
      <div className="review-content">
        <div className="review-header">
          <h2>Flashcard Review</h2>
          <span className="card-counter">{currentIndex + 1} / {words.length}</span>
        </div>

        <div className="flashcard-scene">
          <div 
            className={`flashcard-item ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of the card (English) */}
            <div className="flashcard-face flashcard-front glass-panel">
              <span className="tap-hint">Tap to flip</span>
              <div className="speak-buttons-container">
                <PronunciationButtons word={currentWord.word} size={24} isLarge={true} />
              </div>
              <h2 className="card-word-large">{currentWord.word}</h2>
              {currentWord.partOfSpeech && (
                <span className="word-pos-badge-large">{currentWord.partOfSpeech}</span>
              )}
            </div>

            {/* Back of the card (Vietnamese & Meanings) */}
            <div className="flashcard-face flashcard-back glass-panel">
               <span className="tap-hint">Tap to flip back</span>
               <div className="back-content-large">
                 <h3 className="vi-meaning-large">{currentWord.viMeaning}</h3>
                 
                 {currentWord.pronunciation && (
                   <p className="pronunciation-large">{currentWord.pronunciation}</p>
                 )}
                 
                 {currentWord.enMeaning && (
                   <p className="en-meaning-large"><strong>EN:</strong> {currentWord.enMeaning}</p>
                 )}
                 
                 {currentWord.explanation && (
                   <div className="explanation-large">
                     <p>{currentWord.explanation}</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        <div className="review-controls">
          <button className="btn-control glass-btn" onClick={prevCard} title="Previous">
            <HiArrowLeft size={24} />
          </button>
          <button className="btn-secondary shuffle-btn" onClick={shuffleCards}>
            <HiRefresh size={20} className="icon-left" /> Shuffle
          </button>
          <button className="btn-control glass-btn" onClick={nextCard} title="Next">
            <HiArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
