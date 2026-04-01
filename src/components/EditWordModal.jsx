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
  const [partOfSpeech, setPartOfSpeech] = useState(wordObj.partOfSpeech || '');
  const [ukAudio, setUkAudio] = useState(wordObj.ukAudio || '');
  const [usAudio, setUsAudio] = useState(wordObj.usAudio || '');
  const [examples, setExamples] = useState(wordObj.examples || []);
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
        examples: examples.filter(ex => ex.text.trim() !== ''),
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
            <label>Examples (with Custom Audio URL)</label>
            <div className="examples-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px', marginTop: '5px' }}>
              {examples.map((ex, index) => (
                <div key={index} className="example-input-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={ex.text} 
                    onChange={e => {
                      const newEx = [...examples];
                      newEx[index].text = e.target.value;
                      setExamples(newEx);
                    }} 
                    placeholder="Example sentence" 
                    style={{ flex: 2, marginBottom: 0 }}
                  />
                  <input 
                    type="text" 
                    value={ex.audioUrl || ''} 
                    onChange={e => {
                      const newEx = [...examples];
                      newEx[index].audioUrl = e.target.value;
                      setExamples(newEx);
                    }} 
                    placeholder="MP3 URL (optional)" 
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setExamples(examples.filter((_, i) => i !== index))}
                    className="btn-icon"
                    style={{ color: '#ef4444', padding: '5px' }}
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button" 
              onClick={() => setExamples([...examples, { text: '', audioUrl: '' }])}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '6px 12px', width: 'fit-content' }}
            >
              + Add Example
            </button>
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
