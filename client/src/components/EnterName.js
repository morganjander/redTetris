import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles/Join.css'

export default function EnterName(props) {
    const [name, setName] = useState('')

    useEffect(() => {
        if(props.location.state)
            alert(props.location.state)
       
    }, [props])
    
    return (
        <div className="joinOuterContainer">
           <div className="center">
                <h1 className="heading">Red Tetris</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={e => setName(e.target.value)}/></div>
                <Link  className="button1" style={{"textDecoration": "none"}}
                    onClick={e => 
                        (!name ? e.preventDefault() : null)}
                        to={`/join?name=${name}`}>
                        <button>Enter</button>
                </Link>
            </div>
        </div>
    )
}
