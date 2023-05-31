import React, { useState, useEffect } from 'react';
import bin_del from './bin.png';
import edit from './edit.png';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        author: '',
        timestamp: '',
        text: '',
    });
    const [editingPost, setEditingPost] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
        setPageLoaded(true); // Define a variável pageLoaded como true quando a página é carregada
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
        alert('Post create!');
    };

    const editPost = (index) => {
        setEditingPost(index);
        setNewPost(posts[index]);
        alert('Editing post!');
    };

    const updatePost = (event) => {
        event.preventDefault();
        const updatedPosts = [...posts];
        updatedPosts[editingPost] = newPost;
        setPosts(updatedPosts);
        setEditingPost(null);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
        alert('Post updated!');
    };

    const deletePost = (index) => {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
        alert('Post deleted!');
    };
    const formatTimestamp = (timestamp) => {
        const currentDate = new Date();
        const postDate = new Date(timestamp);

        const secondsAgo = Math.floor((currentDate - postDate) / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);

        if (secondsAgo < 60) {
            return 'now'; // Substitui a contagem de segundos por "now"
        } else if (minutesAgo < 60) {
            return `${minutesAgo} minutes ago`;
        } else {
            return `${hoursAgo} hours ago`;
        }
    };




    return (
        <div>
            <h1>Social Network</h1>

            <form onSubmit={editingPost !== null ? updatePost : addPost}>
                <h2>What's on your mind?</h2>

                <div className="container">
                    <label>
                        <p>
                            Title</p>
                        <input
                            class="title"
                            type="text"
                            placeholder="Hello world"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label class="autor">
                        <p>
                            Content</p>
                        <input
                            class="comentario"
                            placeholder="Content here"
                            name="author"
                            value={newPost.author}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        <textarea
                            class="comentario1"
                            name="text"
                            value={newPost.text}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <div class="btn_publish">
                        <button type="submit" title='Create'>{editingPost !== null ? 'Create' : 'Create'}</button>
                    </div>
                </div>
            </form>

            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <div class="container_titulo">
                            <h3>{post.title}</h3>
                            <div class="btn">
                                <div class='bin_del_action'>
                                    <img onClick={() => deletePost(index)} src={bin_del} alt="Bin" className='bin_del' />
                                </div>
                                <div class='edit_action'>
                                    <img onClick={() => editPost(index)} src={edit} alt="Edit" className='edit' />
                                </div>
                            </div>
                        </div>
                        <aside>
                            <div>
                                <p>@{post.author}</p>
                                <p>{pageLoaded && formatTimestamp(post.timestamp)}</p>
                            </div>
                            <p>{post.text}</p>
                        </aside>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;
