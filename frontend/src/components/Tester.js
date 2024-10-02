import React, { useState } from 'react'

const Tester = () => {
    const [image, setImage] = useState([]);

    const imageHandler = (e) => {
        setImage([...e.target.files]);
        
    }
    console.log(image);
  return (
    <div>
          <input type='file' multiple  onChange={imageHandler}/>
    </div>
  )
}

export default Tester