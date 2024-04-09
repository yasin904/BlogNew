import React, { useState } from 'react';

const EditModal = ({ editingPost, onSubmitHandler, onCancel }) => {
    
    const [editedPost, setEditedPost] = useState({
        title: editingPost.title || '',
        author: editingPost.author || '',
        description: editingPost.description || ''
    });

    
    const handleTitleChange = (e) => {
        setEditedPost({
            ...editedPost,
            title: e.target.value
        });
    };

    
    const handleAuthorChange = (e) => {
        setEditedPost({
            ...editedPost,
            author: e.target.value
        });
    };

    
    const handleDescriptionChange = (e) => {
        setEditedPost({
            ...editedPost,
            description: e.target.value
        });
    };

    return (
        <div className="fixed top-0  w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75 z-50" aria-label="Edit Post Modal" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg p-6 style={{ width: '100%', height: '100%' }}">
                <div className=" flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-black">Title</h2>
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input id="title" value={editedPost.title} type="text" className="border-[1px] border-black rounded-md p-2 text-black" onChange={handleTitleChange} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Author</h2>
                        <label htmlFor="author" className="sr-only">Author</label>
                        <input id="author" value={editedPost.author} type="text" className="border-[1px] border-black rounded-md p-2 text-black" onChange={handleAuthorChange} />
                    </div>
                    <div>
                        <h2 className=" text-xl font-bold text-black">Description</h2>
                        <label htmlFor="description" className="sr-only">Description</label>
                        <textarea id="description" value={editedPost.description} type="text" className="border-[1px] h-20 border-black rounded-md p-2 text-black" onChange={handleDescriptionChange} />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={() => onSubmitHandler(editedPost)} className="px-4 py-2 bg-purple-500 text-white rounded-lg mr-2">Save</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EditModal;
