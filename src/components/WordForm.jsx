import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function WordForm({ onWordAdded }) {
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [enMeaning, setEnMeaning] = useState('');
  const [viMeaning, setViMeaning] = useState('');
  const [explanation, setExplanation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!word.trim() || !viMeaning.trim()) return;

    setLoading(true);
    try {
      // Lưu vào subcollection: users/{userId}/vocab_words
      await addDoc(collection(db, `users/${currentUser.uid}/vocab_words`), {
        userId: currentUser.uid,
        word: word.trim(),
        partOfSpeech: partOfSpeech,
        pronunciation: pronunciation.trim(),
        enMeaning: enMeaning.trim(),
        viMeaning: viMeaning.trim(),
        explanation: explanation.trim(),
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setWord('');
      setPronunciation('');
      setPartOfSpeech('');
      setEnMeaning('');
      setViMeaning('');
      setExplanation('');
      
      if (onWordAdded) onWordAdded();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding word.");
    }
    setLoading(false);
  }

  return (
    <div className="word-form-container glass-panel">
      <h3>Add New Word</h3>
      <form onSubmit={handleSubmit} className="word-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label>English Word *</label>
            <input 
              type="text" 
              required 
              value={word} 
              onChange={e => setWord(e.target.value)} 
              placeholder="e.g. ubiquitous"
            />
          </div>
          <div className="form-group" style={{ flex: '0.6' }}>
            <label>Part of Speech</label>
            <select 
              value={partOfSpeech} 
              onChange={e => setPartOfSpeech(e.target.value)}
            >
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
          <div className="form-group flex-1">
            <label>Pronunciation</label>
            <input 
              type="text" 
              value={pronunciation} 
              onChange={e => setPronunciation(e.target.value)} 
              placeholder="e.g. /juːˈbɪk.wɪ.təs/"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group flex-1">
            <label>Vietnamese Meaning *</label>
            <input 
              type="text" 
              required 
              value={viMeaning} 
              onChange={e => setViMeaning(e.target.value)} 
              placeholder="e.g. có mặt khắp nơi"
            />
          </div>
          <div className="form-group flex-1">
            <label>English Meaning</label>
            <input 
              type="text" 
              value={enMeaning} 
              onChange={e => setEnMeaning(e.target.value)} 
              placeholder="e.g. seeming to be everywhere"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Explanation / Example</label>
          <textarea 
            value={explanation} 
            onChange={e => setExplanation(e.target.value)} 
            placeholder="e.g. The mobile phone, that most ubiquitous of consumer-electronic appliances..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Word'}
        </button>
      </form>
    </div>
  );
}
