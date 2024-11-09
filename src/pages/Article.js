import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect, useState } from 'react';

export default function Article() {
  const { urlId } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [editArticle, setEditArticle] = useState(null);

  useEffect(() => {
    const ref = doc(db, 'articles', urlId);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        setArticle({ id: snapshot.id, ...snapshot.data() });
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [urlId]);

  const handleEdit = () => {
    setEditArticle(article);
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
    <div>
      {!article && <p>No records found!</p>}
      {article && !editArticle && (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>By {article.author}</p>
          <p>{article.description}</p>
          <button className="btn" onClick={handleEdit}>EDIT ARTICLE</button>
        </div>
      )}
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