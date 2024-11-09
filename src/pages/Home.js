import { Link } from 'react-router-dom';
import { getDocs, collection, deleteDoc, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect, useState } from 'react';
import DeleteIcon from '../assets/delete.svg';

// styles
import './Home.css';

export default function Home() {
  const [articles, setArticles] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = collection(db, 'articles');

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setArticles(results);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const ref = doc(db, 'articles', id);
    await deleteDoc(ref);
  };

  const handleEdit = async (id) => {
    const ref = doc(db, 'articles', id);
    setLoading(true);
    try {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setEditArticle({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const ref = doc(db, 'articles', editArticle.id);
    await updateDoc(ref, {
      title: editArticle.title,
      author: editArticle.author,
      description: editArticle.description,
    });
    setEditArticle(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditArticle((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="home">
      <h2>Articles</h2>
      {articles && articles.map(article => (
        <div key={article.id} className="card">
          <h3>{article.title}</h3>
          <p>Written by {article.author}</p>
          <Link to={`/articles/${article.id}`}>Read More...</Link>
          <img
            className="icon"
            onClick={() => handleDelete(article.id)}
            src={DeleteIcon} alt="delete icon"
          />
          <button className="btn" onClick={() => handleEdit(article.id)}>
            EDIT ARTICLE
          </button>
        </div>
      ))}
      {editArticle && (
        <div className="edit-form">
          <h3>Edit Article</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editArticle.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                name="author"
                value={editArticle.author}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={editArticle.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Update Article</button>
            <button type="button" onClick={() => setEditArticle(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}