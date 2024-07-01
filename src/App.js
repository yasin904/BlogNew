import { useEffect } from "react";
import CreatePost from "./Components/createPost";
import openSocket from 'socket.io-client'
import   ShowPosts  from "./Components/ShowPosts";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Viewing from "./Components/Viewing";


const App = ()=>{
  useEffect(()=>{
    const socket = openSocket('http://localhost:5001')
    
    socket.on("Feed",(data)=>{

      console.log(data)
    });
    
    socket.on("deleted",(data)=>{

      console.log(data)

    });
    
  },[])



  return (
 
    <Router>
    <div>
    
    {/* <ShowPosts/>
    <CreatePost/> */}
    
    <Routes>
      <Route path="/" element={<CreatePost/>}/>
        <Route path="/show" element={<ShowPosts/>}/>
        <Route path="/post/:postId" element={<Viewing/>} />
      </Routes>
      
  
    </div>
     </Router>
    
    
  )



}
export default App;
