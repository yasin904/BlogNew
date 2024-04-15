import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Viewing = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/feed/view/${postId}`);
                setPost(response.data.post);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4  flex flex-col gap-2 bg-purple-500 text-white'>
            <h2 className='text-2xl font-bold'>Post</h2>

            {!post && <h4 className='text-xl font-bold'>No Post to Show</h4>}

            {post && (
                <div className='border-2 bg-white text-black p-2 rounded-xl m-auto w-[400px]'>
                    <div className='h-80'>
                        <img src={post.img} alt='post' className='h-full w-full object-cover rounded-xl' />
                    </div>
                    <h4 className='text-xl font-bold'>{post.title}</h4>
                    <h4 className='text-xl font-medium'>{post.author}</h4>
                    <p>{post.description}</p>
                    <p>{new Date(post.createdAt).toUTCString()}</p>
                </div>
            )}
        </div>
    );
};

export default Viewing;
