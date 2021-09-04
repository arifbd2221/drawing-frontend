import React, { useState } from 'react';
import { Board } from '../../components/Board/Board';

import './style.css';


export const Container = () => {

    const [size, setSize] = useState(5);
    const [color, setColor] = useState();


    const handleSizeChange = event => {
        console.log(event.target.value);
        setSize(event.target.value);
    }

    const handleColorChange = event => {
        console.log(event.target.value);
        setColor(event.target.value);
    }


    return (
        <div className="container">
            <div class="tools-section">
                <div className="color-picker-container">
                    Select Brush Color : &nbsp; 
                    <input type="color" value={color} onChange={handleColorChange}/>
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp; 
                    <select value={size} onChange={handleSizeChange}>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>

            </div>

            <div class="board-container">
                <Board color={color} size={size}></Board>
            </div>
        </div>
    )
}