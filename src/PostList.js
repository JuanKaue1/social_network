import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import bin_del from './bin.png';
import edit from './edit.png';

const PostList = () => {
    // const [posts, setPosts] = useState([]);
    // const [newPost, setNewPost] = useState({
    //     title: '',
    //     author: '',
    //     timestamp: '',
    //     text: '',
    // });
    // const [editingPost, setEditingPost] = useState(null);
    // const [pageLoaded, setPageLoaded] = useState(false);
    // const [showAlert, setShowAlert] = useState(false);
    // const [alertMessage, setAlertMessage] = useState('');

    // useEffect(() => {
    //     const storedPosts = localStorage.getItem('posts');
    //     if (storedPosts) {
    //         setPosts(JSON.parse(storedPosts));
    //     }
    //     setPageLoaded(true);
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem('posts', JSON.stringify(posts));
    // }, [posts]);

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        author: '',
        timestamp: '',
        text: '',
    });
    const [editingPost, setEditingPost] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Variável de estado para controlar a exibição do modal

    useEffect(() => {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
        setPageLoaded(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('posts', JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        // Mostra o modal por 5 segundos quando showAlert é true
        if (showAlert) {
            setShowModal(true);
            setTimeout(() => {
                setShowAlert(false);
                setShowModal(false);
            }, 100000);
        }
    }, [showAlert]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPost({ ...newPost, [event.target.name]: event.target.value });
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };

    const addPost = (event) => {
        event.preventDefault();
        if (
            newPost.title.trim() === '' ||
            newPost.author.trim() === '' ||
            newPost.text.trim() === ''
        ) {
            showAlertMessage('Por favor, preencha todos os campos com conteúdo válido.');
            return;
        }

        const lines = newPost.text.split('\n');
        let isValid = true;

        // Verificar se há uma linha em branco no início ou no final do texto
        if (lines.length > 0) {
            if (lines[0].trim() === '' || lines[lines.length - 1].trim() === '') {
                isValid = false;
            }
        }

        // Verificar se há mais de uma linha em branco consecutiva
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '' && lines[i - 1].trim() === '') {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            showAlertMessage('O texto contém linhas em branco inválidas. Por favor, corrija e tente novamente.');
            return;
        }

        const post = {
            ...newPost,
            timestamp: Date.now(),
        };
        setPosts([...posts, post]);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
        resetTextareaHeight();
        showAlertMessage('Post created!');
    };

    const updatePost = (event) => {
        event.preventDefault();
        if (
            newPost.title.trim() === '' ||
            newPost.author.trim() === '' ||
            newPost.text.trim() === ''
        ) {
            showAlertMessage('Por favor, preencha todos os campos com conteúdo válido.');
            return;
        }

        const lines = newPost.text.split('\n');
        let isValid = true;

        // Verificar se há uma linha em branco no início ou no final do texto
        if (lines.length > 0) {
            if (lines[0].trim() === '' || lines[lines.length - 1].trim() === '') {
                isValid = false;
            }
        }

        // Verificar se há mais de uma linha em branco consecutiva
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '' && lines[i - 1].trim() === '') {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            showAlertMessage('O texto contém linhas em branco inválidas. Por favor, corrija e tente novamente.');
            return;
        }

        const updatedPosts = [...posts];
        updatedPosts[editingPost] = newPost;
        setPosts(updatedPosts);
        setEditingPost(null);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
        resetTextareaHeight();
        showAlertMessage('Post atualizado!');
    };

    const editPost = (index) => {
        if (
            posts[index].title.trim() === '' ||
            posts[index].author.trim() === '' ||
            posts[index].text.trim() === ''
        ) {
            showAlertMessage('Please fill in all fields with valid content.');
            return;
        }

        setEditingPost(index);
        setNewPost(posts[index]);
        showAlertMessage('Editing post!');
    };

    const deletePost = (index) => {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
        showAlertMessage('Post deleted!');
    };

    const formatTimestamp = (timestamp) => {
        const currentDate = new Date();
        const postDate = new Date(timestamp);

        const secondsAgo = Math.floor((currentDate - postDate) / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);

        if (secondsAgo < 60) {
            return 'now';
        } else if (minutesAgo < 60) {
            return `${minutesAgo} minutes ago`;
        } else {
            return `${hoursAgo} hours ago`;
        }
    };

    const resetTextareaHeight = () => {
        const textarea = document.querySelector('.comentario1');
        if (textarea) {
            textarea.style.height = 'auto';
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
                            maxLength={30}
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
                            maxLength={20}
                            required
                        />
                    </label>
                    <label>
                        <textarea
                            className="comentario1"
                            name="text"
                            value={newPost.text}
                            onChange={handleInputChange}
                            onInput={(event) => {
                                event.target.style.height = 'auto';
                                event.target.style.height = event.target.scrollHeight + 'px';
                            }}
                            maxLength={800}
                            required
                        />
                    </label>
                    <div class="btn_publish">
                        <button type="submit" title='Create'>
                            {editingPost !== null ? 'Create' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>

            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <div class="container_titulo">
                            <h3>{post.title}</h3>
                            <div class="btn">
                                <button class="btn_bin_edit1" onClick={() => deletePost(index)}>
                                    <img title='Delete' src={bin_del} alt="Bin" class='bin_del' />
                                </button>
                                <button class="btn_bin_edit2" onClick={() => editPost(index)}>
                                    <img title='To edit' src={edit} alt="Edit" class='edit' />
                                </button>
                            </div>
                        </div>
                        <aside>
                            <div>
                                <p>@{post.author}</p>
                                <p>{pageLoaded && formatTimestamp(post.timestamp)}</p>
                            </div>
                            <p>
                                {post.text.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        </aside>
                    </li>
                ))}
            </ul>

            {/* <Modal show={showAlert} onHide={handleAlertClose} centered> */}
            {/* <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header> */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>

                <Modal.Body>{alertMessage}</Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary" onClick={handleAlertClose}>
                        OK
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostList;
