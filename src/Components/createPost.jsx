import React from "react";
import axios from 'axios';




const CreatePost = () => {
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [description, setDescription] = React.useState('');
  

  const onSubmitHandler=async ()=>{
    console.log(title,author,description)
    if(!title || !author || !description){
      alert("all fields are required");
    return    
  }

  

  try{

    const res = await axios.post("http://localhost:5000/feed/create",{
      title,
      author,
      description
    });

    console.log(res)

    if(res.data.message === "Book already exists in our system"){
      alert("book already exists in our system");
    }
    console.log("post added successfully")
    console.log(res)

   

  }catch(err){

    console.log(err)

  }
  setTitle("");
  setAuthor("");
  setDescription("");
 
  }

  const onCancelHandler = ()=>{
    if(title || author || description){
    setTitle("");
    setAuthor("");
    setDescription("");
    }
  }
  return (
    <div className="bg-purple-200 p-8 rounded-xl border-[1px] border-black flex flex-col gap-8">
      <h3 className="text-2xl font-bold text-center">Create Post</h3>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8 bg-purple-200 p-4 rounded-xl w-[1260px] mx-auto ">
        <div className=" flex flex-col gap-2 col-span-2 md:col-span-1">
          <label className="font-bold">Title</label>
          <input
            value={title}
            type="text"
            className="border-[1px] border-black rounded-md p-2"
            onChange={(e)=>setTitle(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
          <label className="font-bold">Author</label>
          <input
            value={author}
            type="text"
            className="border-[1px] border-black rounded-md p-2"
            onChange={(e)=>setAuthor(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
          <label className="font-bold">Description</label>
          <input
            value={description}
            type="text"
            className="border-[1px] h-20 border-black rounded-md p-2"
            onChange={(e)=>setDescription(e.target.value)}
          ></input>
        </div>
       
      </div>
      <div className="flex flex-row gap-2 justify-center" >
         <button onClick={onSubmitHandler} className="p-2 bg-black text-white rounded-md col-span-2 ">Submit</button>
         <button onClick={onCancelHandler} className="p-2 bg-black text-white rounded-md col-span-2 ">Cancel</button>
      </div>
    </div>
  );
};

export default CreatePost;
