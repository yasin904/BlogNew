import React, { useEffect,useState } from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client';
import EditModal from './editModal';

const socket = socketIOClient('http://localhost:5000');

const ShowPosts = () => {
    const [posts, setPosts] = useState([]);
    const [editingPost,setEditingPost] = useState([null]);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/feed/get");
               
                setPosts(res.data.feed);


            } catch (err) {
                console.log(err);
            }


        };
        fetchData();

        socket.on('postDeleted', (deletedPostId) => {
            // Update state to remove the deleted post
            setPosts(posts.filter(post => post._id !== deletedPostId));
        });
    
        // Clean up Socket.IO connection
        return () => {
            socket.disconnect();
        };
        

        
    }, [posts]);

    const onDeleteHandler = async(postId)=>{
        try{

            await axios.delete(`http://localhost:5000/feed/delete/${postId}`);
            setPosts(posts.filter(post=>post._id !==postId));
            socket.emit('deletePost', postId);
            
        }
        catch(err){
            console.log(err)
        }


    }
    const onEditHandler = (postId, post) => {
        setEditingPost({ postId, ...post });
        setShowEditModal(true); 
    };

    const onSubmitHandler = async (editedPost) => {

        // if(!updatedPost.title || !updatedPost.author || !updatedPost.description){
        //     alert("all fields are required");
        //   return    
        // }
        try {
            // Send a PUT request to your backend API to update the post
            console.log(editedPost);

            // const postData = {
            //     title: updatedPost.title,
            //     author: updatedPost.author,
            //     description: updatedPost.description,
            //     // Add other properties as needed
            // };

            const response = await axios.put(`http://localhost:5000/feed/edit/${editingPost.postId}`, {
                title: editedPost.title,
            author: editedPost.author,
            description: editedPost.description,
            // Add other properties as needed
        });
            
            // Check if the request was successful
            if (response.status === 200) {
                // If successful, update the state with the updated post
                setPosts(posts.map(post => (post._id === editingPost.postId ? response.data.post : post)));
                // Close the edit modal
                setShowEditModal(false);
                // Reset the editingPost state
                setEditingPost(null);
            } else {
                // Handle error if the request was not successful
                console.error('Failed to update post:', response.data);
            }
        } catch (err) {
            console.error('Error updating post:', err);
        }
    }
    

    return (
        <div className='p-4  flex flex-col gap-2 bg-purple-500 text-white'>
            <h2 className='text-2xl font-bold  '>Posts</h2>

            {posts.length === 0 && <h4 className='text-xl font-bold'>No Posts to Show</h4>}

<div className=' flex flex-wrap gap-20'>
            {posts.map((item, i) =>
                <div key={i} className='border-2 bg-white text-black p-2 rounded-xl m-auto w-[400px]'>
                    <div className='h-80'>
                        <img src={item.img} alt='post' className=' h-full w-full object-hover rounded-xl' />
                    </div>
                    <h4 className=' text-xl font-bold'>{item.title}</h4>
                    <h4 className=' text-xl font-medium'>{item.author}</h4>
                    <p>{item.description}</p>
                    <p>{new Date(item.createdAt).toUTCString()}</p>
                    <div className=' flex gap-4'>
                    <button onClick={()=>onDeleteHandler(item._id)} className=' p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1'>Delete</button>
                    <button onClick={()=>onEditHandler(item._id,item)} className=' p-2 bg-red-400 text-white rounded-md col-span-2 space-x-1'>Edit</button>
                    </div>
                </div>
            )}

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
}

export default ShowPosts;

