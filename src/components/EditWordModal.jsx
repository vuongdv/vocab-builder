import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import './EditWordModal.css'; // Sẽ tạo ngay sau

export default function EditWordModal({ wordObj, onClose }) {
  const [word, setWord] = useState(wordObj.word || '');
  const [pronunciation, setPronunciation] = useState(wordObj.pronunciation || '');
  const [enMeaning, setEnMeaning] = useState(wordObj.enMeaning || '');
  const [viMeaning, setViMeaning] = useState(wordObj.viMeaning || '');
  const [explanation, setExplanation] = useState(wordObj.explanation || '');
  const [partOfSpeech, setPartOfSpeech] = useState(wordObj.partOfSpeech || '');
  const [ukAudio, setUkAudio] = useState(wordObj.ukAudio || '');
  const [usAudio, setUsAudio] = useState(wordObj.usAudio || '');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  async function handleUpdate(e) {
    e.preventDefault();
    if (!word.trim() || !viMeaning.trim()) return;

    setLoading(true);
    try {
      const wordRef = doc(db, `users/${currentUser.uid}/vocab_words`, wordObj.id);
      await updateDoc(wordRef, {
        word: word.trim(),
        partOfSpeech: partOfSpeech,
        pronunciation: pronunciation.trim(),
        ukAudio: ukAudio.trim(),
        usAudio: usAudio.trim(),
        enMeaning: enMeaning.trim(),
        viMeaning: viMeaning.trim(),
        explanation: explanation.trim(),
      });
      onClose(); // Đóng Modal thành công
    } catch (error) {
      console.error("Error updating word: ", error);
      alert("Update failed!");
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>Edit Word</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleUpdate} className="word-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>English Word *</label>
              <input type="text" required value={word} onChange={e => setWord(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '0.6' }}>
              <label>Part of Speech</label>
              <select value={partOfSpeech} onChange={e => setPartOfSpeech(e.target.value)}>
                <option value="">Select...</option>
                <option value="Noun (n)">Noun (n)</option>
                <option value="Verb (v)">Verb (v)</option>
                <option value="Adjective (adj)">Adjective (adj)</option>
                <option value="Adverb (adv)">Adverb (adv)</option>
                <option value="Pronoun (pron)">Pronoun (pron)</option>
                <option value="Preposition (prep)">Preposition (prep)</option>
                <option value="Idiom">Idiom / Phrase</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Pronunciation</label>
              <input type="text" value={pronunciation} onChange={e => setPronunciation(e.target.value)} />
            </div>
            <div className="form-group flex-1">
              <label>Vietnamese Meaning *</label>
              <input type="text" required value={viMeaning} onChange={e => setViMeaning(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>UK Audio MP3 URL</label>
              <input type="text" value={ukAudio} onChange={e => setUkAudio(e.target.value)} placeholder="UK MP3 Link" />
            </div>
            <div className="form-group flex-1">
              <label>US Audio MP3 URL</label>
              <input type="text" value={usAudio} onChange={e => setUsAudio(e.target.value)} placeholder="US MP3 Link" />
            </div>
          </div>

          <div className="form-group">
            <label>English Meaning</label>
            <input type="text" value={enMeaning} onChange={e => setEnMeaning(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Explanation / Example</label>
            <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows="2" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
