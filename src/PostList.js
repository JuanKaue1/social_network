import React, { useState, useEffect } from 'react';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        author: '',
        timestamp: '',
        text: '',
    });
    const [editingPost, setEditingPost] = useState(null);

    const formatTimestamp = (timestamp) => {
        const now = new Date().getTime();
        const postTime = new Date(timestamp).getTime();
        const diffInMilliseconds = now - postTime;

        const seconds = Math.floor(diffInMilliseconds / 1000);
        if (seconds < 60) {
            return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }

        const minutes = Math.floor(diffInMilliseconds / 1000 / 60);
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }

        const hours = Math.floor(diffInMilliseconds / 1000 / 60 / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    };

    useEffect(() => {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('posts', JSON.stringify(posts));
    }, [posts]);


    const handleInputChange = (event) => {
        setNewPost({ ...newPost, [event.target.name]: event.target.value });
    };

    const addPost = (event) => {
        event.preventDefault();
        const post = {
            ...newPost,
            timestamp: Date.now(), 
        };
        setPosts([...posts, post]);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
    };



    const editPost = (index) => {
        setEditingPost(index);
        setNewPost(posts[index]);
    };

    const updatePost = (event) => {
        event.preventDefault();
        const updatedPosts = [...posts];
        updatedPosts[editingPost] = newPost;
        setPosts(updatedPosts);
        setEditingPost(null);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
    };

    const deletePost = (index) => {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    };

    return (
        <div>
            <h1>Social Network</h1>

            <form onSubmit={editingPost !== null ? updatePost : addPost}>
                <h2>What's on your mind?</h2>

                <div class="container">
                    <label>
                        Title
                        <input
                            type="text"
                            placeholder="Hello world"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Content
                        <input
                            type="text"
                            placeholder="Contet here"
                            name="author"
                            value={newPost.author}
                            onChange={handleInputChange}
                            required
                            class="autor"
                            />
                        <textarea
                            class="comentario"
                            placeholder=""
                            name="text"
                            value={newPost.text}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">{editingPost !== null ? 'Atualizar' : 'Publicar'}</button>
                </div>
            </form>

            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <h2>{post.title}</h2>
                        <p>Autor: {post.author}</p>
                        <p>Postado em: {formatTimestamp(post.timestamp)}</p>
                        <p>{post.text}</p>
                        <button onClick={() => editPost(index)}>Editar</button>
                        <button onClick={() => deletePost(index)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default PostList;
