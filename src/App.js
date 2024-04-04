import { useEffect } from "react";
import CreatePost from "./Components/createPost";
import openSocket from 'socket.io-client'
import   ShowPosts  from "./Components/ShowPosts";

const App = ()=>{
  useEffect(()=>{
    const socket = openSocket('http://localhost:5000')
    
    socket.on("Feed",(data)=>{

      console.log(data)
    });
    
    socket.on("deleted",(data)=>{

      console.log(data)

    });
    
  },[])



  return (
 
    <div>
    <CreatePost/>
    <ShowPosts/>
    </div>
    
    
  )



}
export default App;
