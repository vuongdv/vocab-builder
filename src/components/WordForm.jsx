import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function WordForm({ onWordAdded }) {
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [enMeaning, setEnMeaning] = useState('');
  const [viMeaning, setViMeaning] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [ukAudio, setUkAudio] = useState('');
  const [usAudio, setUsAudio] = useState('');
  const [examples, setExamples] = useState([]);
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
        ukAudio: ukAudio.trim(),
        usAudio: usAudio.trim(),
        enMeaning: enMeaning.trim(),
        viMeaning: viMeaning.trim(),
        examples: examples.filter(ex => ex.text.trim() !== ''),
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setWord('');
      setPronunciation('');
      setPartOfSpeech('');
      setUkAudio('');
      setUsAudio('');
      setEnMeaning('');
      setViMeaning('');
      setExamples([]);
      
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

        <div className="form-row">
          <div className="form-group flex-1">
            <label>UK Audio MP3 URL</label>
            <input 
              type="text" 
              value={ukAudio} 
              onChange={e => setUkAudio(e.target.value)} 
              placeholder="e.g. https://.../breProns/word.mp3"
            />
          </div>
          <div className="form-group flex-1">
            <label>US Audio MP3 URL</label>
            <input 
              type="text" 
              value={usAudio} 
              onChange={e => setUsAudio(e.target.value)} 
              placeholder="e.g. https://.../ameProns/word.mp3"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Examples (with Custom Audio URL)</label>
          <div className="examples-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
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
                  value={ex.audioUrl} 
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

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Word'}
        </button>
      </form>
    </div>
  );
}
