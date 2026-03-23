import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { HiSearch } from 'react-icons/hi';
import WordForm from '../components/WordForm';
import WordList from '../components/WordList';
import Navbar from '../components/Navbar';
import './Home.css';

export default function Home() {
  const { currentUser } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState(''); // State lọc theo Loại từ
  
  // State quản lý số lượng từ vựng hiển thị trên giao diện
  const [visibleCount, setVisibleCount] = useState(20);

  // Lắng nghe sự kiện cuộn trang (Scroll) để tăng số lượng hiển thị
  useEffect(() => {
    function handleScroll() {
      // Khi người dùng cuộn gần tới cuối trang (cách đáy 300px)
      if (
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 300
      ) {
        setVisibleCount((prevValue) => prevValue + 20);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Lấy dữ liệu từ subcollection: users/{userId}/vocab_words
    const q = query(
      collection(db, `users/${currentUser.uid}/vocab_words`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wordsData = [];
      snapshot.forEach((doc) => {
        wordsData.push({ id: doc.id, ...doc.data() });
      });
      setWords(wordsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching words:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Lọc từ vựng dựa trên searchTerm và Loại từ (Part of Speech)
  const filteredWords = words.filter(w => {
    const termMatches = 
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.viMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Nếu có chọn filterPos thì bắt buộc phải khớp
    const posMatches = filterPos === '' || w.partOfSpeech === filterPos;

    return termMatches && posMatches;
  });

  // Chỉ lấy ra số thẻ bằng với visibleCount để render lên màn hình
  const displayedWords = filteredWords.slice(0, visibleCount);

  return (
    <div className="home-container">
      <Navbar />

      <main className="main-content">
        <section className="top-section">
          {/* Component thêm từ mới */}
          <WordForm />
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Your Vocabulary ({filteredWords.length})</h2>
            <div className="filters-container">
              <div className="search-bar">
                <HiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search ..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(20); // Reset số lượng hiển thị khi tìm kiếm
                  }}
                />
              </div>
              <select 
                className="filter-select"
                value={filterPos}
                onChange={(e) => {
                  setFilterPos(e.target.value);
                  setVisibleCount(20);
                }}
              >
                <option value="">All Parts of Speech</option>
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
          
          <WordList words={displayedWords} loading={loading} />
          
          {/* Hiệu ứng loading nhẹ ở dưới nếu còn từ vựng chưa hiện hết */}
          {displayedWords.length < filteredWords.length && (
            <div style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8' }}>
              Loading more cards...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
