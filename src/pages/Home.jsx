import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { HiLogout, HiSearch } from 'react-icons/hi';
import WordForm from '../components/WordForm';
import WordList from '../components/WordList';
import './Home.css';

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  // Lọc từ vựng dựa trên searchTerm (tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt)
  const filteredWords = words.filter(w => {
    const term = searchTerm.toLowerCase();
    return (
      w.word.toLowerCase().includes(term) ||
      w.viMeaning.toLowerCase().includes(term)
    );
  });

  // Chỉ lấy ra số thẻ bằng với visibleCount để render lên màn hình
  const displayedWords = filteredWords.slice(0, visibleCount);

  return (
    <div className="home-container">
      <header className="home-header glass-panel">
        <div className="header-content">
          <h1 className="logo-title">VocabBuilder 🚀</h1>
          <div className="user-info">
            <span className="user-email">{currentUser.email}</span>
            <button className="btn-icon logout-btn" onClick={handleLogout} title="Logout">
              <HiLogout size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="top-section">
          {/* Component thêm từ mới */}
          <WordForm />
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Your Vocabulary ({filteredWords.length})</h2>
            <div className="search-bar">
              <HiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search English or Vietnamese..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(20); // Reset số lượng hiển thị khi tìm kiếm
                }}
              />
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
