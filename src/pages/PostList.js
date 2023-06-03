import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import bin_del from './imagens/bin.png';
import edit from './imagens/edit.png';

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
        if (showAlert) {
            setShowModal(true);
            setTimeout(() => {
                setShowAlert(false);
                setShowModal(false);
            }, 1500);
        }
    }, [showAlert]);

    const [textareaHeight, setTextareaHeight] = useState('auto');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPost({ ...newPost, [name]: value });
        adjustTextareaHeight();
    };
    const adjustTextareaHeight = () => {
        const textarea = document.querySelector('.comentario1');
        if (textarea) {
          textarea.style.height = 'auto'; // Redefine a altura para auto para que o tamanho seja ajustado corretamente
          textarea.style.height = textarea.scrollHeight + 'px'; // Define a altura do textarea para o tamanho do conteúdo
          setTextareaHeight(textarea.style.height); // Atualiza o estado local com a nova altura do textarea
        }
      };
      

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };
    const correctTextFormat = (text) => {
        let correctedText = text.trim(); // Remover espaços em branco no início e no final do texto
        correctedText = correctedText.replace(/\n{3,}/g, '\n\n'); // Remover linhas em branco consecutivas com mais de duas quebras de linha
        return correctedText;
    };
    const addPost = (event) => {
        event.preventDefault();

        // Corrigir formatação do texto
        let correctedText = newPost.text.trim(); // Remover espaços em branco no início e no final do texto
        correctedText = correctedText.replace(/\n{3,}/g, '\n\n'); // Remover linhas em branco consecutivas com mais de duas quebras de linha

        const post = {
            ...newPost,
            text: correctedText, // Usar o texto corrigido
            timestamp: Date.now(),
        };

        setPosts([...posts, post]);
        setEditingPost(null);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
        resetTextareaHeight();
        showAlertMessage('Post created!');
    };


    const updatePost = (event) => {
        event.preventDefault();

        const post = {
            ...newPost,
            text: correctTextFormat(newPost.text), // Corrigir formatação do texto
            timestamp: Date.now(),
        };

        const updatedPosts = [...posts];
        updatedPosts[editingPost] = post;
        setPosts(updatedPosts);
        setEditingPost(null);
        setNewPost({ title: '', author: '', timestamp: '', text: '' });
        resetTextareaHeight();
        showAlertMessage('Post updated!');

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

        // Corrigir formatação do texto
        let correctedText = newPost.text.trim(); // Remover espaços em branco no início e no final do texto
        correctedText = correctedText.replace(/\n{3,}/g, '\n\n'); // Remover linhas em branco consecutivas com mais de duas quebras de linha

        const post = {
            ...newPost,
            text: correctedText, // Usar o texto corrigido
            timestamp: Date.now(),
        };

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
            <h1 id="top">Social Network</h1>

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
                            maxLength={800}style={{ height: textareaHeight }} 
                            id="asd"
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

            <ul><div id="unique-id"></div>
                {posts.map((post, index) => (
                    <li key={index}>
                        <div class="container_titulo">
                            <h3>{post.title}</h3>
                            <div class="btn">
                                <button class="btn_bin_edit1" onClick={() => deletePost(index)}>
                                    <img title='Delete' src={bin_del} alt="Bin" class='bin_del' />
                                </button>
                                <button href="#top" class="btn_bin_edit2" onClick={() => editPost(index)} >
                                    <img title='To edit' src={edit} alt="Edit" class='edit'  />
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>

                <Modal.Body>{alertMessage}</Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostList;
