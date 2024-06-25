import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import EditModal from './editModal';
import { useNavigate } from 'react-router-dom';

const socket = socketIOClient('http://localhost:5001');

const ShowPosts = () => {
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchTimeout,setSearchTimeout] = useState(null);
    const [noPostsMessage, setNoPostsMessage] = useState('');
    const DEBOUNCE_DELAY = 300;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5001/feed/get");
                setPosts(res.data.feed);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();

        socket.on('postDeleted', (deletedPostId) => {
            setPosts(posts.filter(post => post._id !== deletedPostId));
        });

        
        return () => {
            socket.disconnect();
        };
    }, []);

    const onDeleteHandler = async (postId) => {
        try {
            await axios.delete(`http://localhost:5001/feed/delete/${postId}`);
            setPosts(posts.filter(post => post._id !== postId));
            socket.emit('deletePost', postId);
        } catch (err) {
            console.log(err);
        }
    };

    const onEditHandler = (postId, post) => {
        setEditingPost({ postId, ...post });
        setShowEditModal(true);
    };

    const onSubmitHandler = async (editedPost) => {
        try {
            const response = await axios.put(`http://localhost:5001/feed/edit/${editingPost.postId}`, {
                title: editedPost.title,
                author: editedPost.author,
                description: editedPost.description
            });
            if (response.status === 200) {
                setPosts(posts.map(post => (post._id === editingPost.postId ? response.data.post : post)));
                setShowEditModal(false);
                setEditingPost(null);
            } else {
                console.error('Failed to update post:', response.data);
            }
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const onViewHandler = async (postId) => {
        navigate(`/post/${postId}`);
    };

    const onSearchHandler = async (e) => {

        const searchText = e.target.value;
        setSearchQuery(searchText);

        if(searchTimeout){
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(setTimeout(async()=>{
            try {
                const response = await axios.get(`http://localhost:5001/feed/search?q=${searchText}`);
                if (response.status === 400 || response.status === 401) {
                    setSearchResults([]);
                    setNoPostsMessage('No posts matching your search criteria.');
                } else {
                    setSearchResults(response.data.data);
                    setNoPostsMessage(''); // Clear message when posts are found
                }
            } catch (err) {
                console.error('Error searching:', err);
            setSearchResults([]);
            setNoPostsMessage('No matching posts found.');
            }

        },DEBOUNCE_DELAY));

        if (!searchText.trim()) {
            setSearchResults([]);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            // Update posts with search results if search query is not empty
            setPosts(searchResults);
        } else {
            // Fetch all posts if search query is empty
            const fetchData = async () => {
                try {
                    const res = await axios.get("http://localhost:5001/feed/get");
                    setPosts(res.data.feed);
                } catch (err) {
                    console.log(err);
                }
            };
            fetchData();
        }
    }, [searchQuery, searchResults]);

    return (
        <div className='p-4 flex flex-col gap-2 bg-purple-500 text-white'>
            <div className='flex flex-row gap-2 justify-center rounded-md'>
                <input
                    className='rounded-md w-64 h-10 text-black'
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={onSearchHandler}
                />
            </div>
            <div className='flex flex-row gap-2 justify-center'>
                <button className='p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1' onClick={()=>onSearchHandler}>Search</button>
            </div>
            <h2 className='text-2xl font-bold'>Posts</h2>

            {posts.length === 0 && <h4 className='text-xl font-bold'>{noPostsMessage}</h4>}

            <div className='flex flex-wrap gap-20'>
                {posts.map((item, i) => (
                    <div key={i} className='border-2 bg-white text-black p-2 rounded-xl m-auto w-[400px]'>
                        <div className='h-80'>
                            <img src={item.img} alt='post' className='h-full w-full object-hover rounded-xl' />
                        </div>
                        <h4 className='text-xl font-bold'>{item.title}</h4>
                        <h4 className='text-xl font-medium'>{item.author}</h4>
                        <p>{item.description}</p>
                        <p>{new Date(item.createdAt).toUTCString()}</p>
                        <div className='flex gap-4'>
                            <button onClick={() => onDeleteHandler(item._id)} className='p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1'>Delete</button>
                            <button onClick={() => onEditHandler(item._id, item)} className='p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1'>Edit</button>
                            <button onClick={() => onViewHandler(item._id)} className='p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1'>View</button>
                        </div>
                    </div>
                ))}
            </div>
            {showEditModal && editingPost && (
                <EditModal
                    editingPost={editingPost}
                    onSubmitHandler={(editedPost) => onSubmitHandler(editedPost)}
                    onCancel={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};

export default ShowPosts;
