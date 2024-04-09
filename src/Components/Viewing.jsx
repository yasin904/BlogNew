import React from 'react';
import {useParams} from 'react-router-dom';

const Viewing = () => {

    const {postId} = useParams();
  return (
    <div>Viewing PostID : {postId}</div>
  )
}

export default Viewing;