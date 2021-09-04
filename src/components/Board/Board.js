import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

import './style.css';


export const Board = (size, color) => {
    const socket = io.connect("http://127.0.0.1:5000");
    const [drawing,setDrawing] = useState(false);
    const [ctx, setCTX] = useState();
    const canvasRef = useRef(null);


    useEffect(() => {
        console.log("Hello");
        socket.on("canvas-data", function(data){
            console.log("canvas-data", data);
            var interval = setInterval(function(){
                if(drawing) return;
                setDrawing(true);
                clearInterval(interval);
                var image = new Image();
                var canvas = document.querySelector('#board');
                image.onload = function() {
                    canvas.getContext('2d').drawImage(image, 0, 0);

                    setDrawing(false);
                };
                image.src = data;
            }, 200)
        })

    }, [socket, drawing])


    useEffect(() => {
        socket.emit("canvas-data", "lol");
        var canvas = document.querySelector('#board');
        setCTX(canvas.getContext('2d'))
        var cctx = ctx;

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX //- canvasRef.current.offsetLeft;
            mouse.y = e.pageY //- canvasRef.current.offsetTop;
            
        }, false);


        /* Drawing on Paint App */
        // cctx.lineWidth = 5;
        // cctx.lineJoin = 'round';
        // cctx.lineCap = 'round';
        // cctx.strokeStyle = color;

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var onPaint = function() {
            cctx.beginPath();
            cctx.moveTo(last_mouse.x, last_mouse.y);
            cctx.lineTo(mouse.x, mouse.y);
            cctx.closePath();
            cctx.stroke();
            console.log("onPaint");

            setTimeout(()=> {
                var base64ImageData = canvas.toDataURL("image/png");
                console.log("Sending canvas data");
                socket.emit("canvas-data", base64ImageData);
                }, 1000);

            return(()=> {
                clearTimeout();
            })
            
        // }
        };
        
    },[ctx, color, size, socket]);



    return(
        <div class="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
            </div>
    )
}