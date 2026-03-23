import React, { useState } from 'react';
import { HiOutlineVolumeUp, HiTranslate, HiPencil, HiTrash } from 'react-icons/hi';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import EditWordModal from './EditWordModal';

export default function WordList({ words, loading }) {
  const [editingWord, setEditingWord] = useState(null);
  const { currentUser } = useAuth();
  if (loading) {
    return <div className="loading-state">Đang tải danh sách từ vựng...</div>;
  }

  if (!words || words.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <p>Bạn chưa lưu từ vựng nào. Hãy thêm từ mới nhé!</p>
      </div>
    );
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleDelete = async (wordId) => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      try {
        const wordRef = doc(db, `users/${currentUser.uid}/vocab_words`, wordId);
        await deleteDoc(wordRef);
      } catch (error) {
        console.error("Error deleting: ", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  return (
    <div className="words-grid">
      {words.map(wordObj => (
        <div key={wordObj.id} className="word-card glass-panel">
          <div className="word-header">
            <div className="word-title-group">
              <h3 className="word-title">{wordObj.word}</h3>
              {wordObj.partOfSpeech && (
                <span className="word-pos-badge">{wordObj.partOfSpeech}</span>
              )}
            </div>
            
            <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-icon" 
                onClick={() => speak(wordObj.word)}
                title="Listen"
              >
                <HiOutlineVolumeUp size={20} />
              </button>
              <button 
                className="btn-icon" 
                onClick={() => setEditingWord(wordObj)}
                title="Edit"
              >
                <HiPencil size={18} />
              </button>
              <button 
                className="btn-icon" 
                onClick={() => handleDelete(wordObj.id)}
                title="Delete"
              >
                <HiTrash size={18} />
              </button>
            </div>
          </div>
          
          {wordObj.pronunciation && (
            <div className="word-pronunciation">{wordObj.pronunciation}</div>
          )}
          
          <div className="word-meaning vi-meaning">
            <HiTranslate className="meaning-icon" /> 
            <strong>{wordObj.viMeaning}</strong>
          </div>
          
          {wordObj.enMeaning && (
            <div className="word-meaning en-meaning">
              <em>EN:</em> {wordObj.enMeaning}
            </div>
          )}
          
          {wordObj.explanation && (
            <div className="word-explanation">
              {wordObj.explanation}
            </div>
          )}
        </div>
      ))}

      {editingWord && (
        <EditWordModal 
          wordObj={editingWord} 
          onClose={() => setEditingWord(null)} 
        />
      )}
    </div>
  );
}
