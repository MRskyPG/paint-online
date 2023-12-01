const canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
const color = document.querySelector('#color');
const lineWidth = document.querySelector('#lineWidth');
const clearButton = document.querySelector("#clearButton");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//for current socket
let pos = {
    x: 0,
    y: 0,
}

//for other sockets
let startx = 0;
let starty= 0;

//options
let setColor = "black";
let setLineWidth = 5;

//current socket
const socket = io();

//drawing

document.addEventListener('mousedown', (e) => {
    document.addEventListener('mousemove', draw);
    reposition(e);

})


document.addEventListener('mouseup', ()=> {
    document.removeEventListener('mousemove', draw);
})
//stop drawing


document.addEventListener('change', () => {
    setColor = color.value;
})

document.addEventListener('change', () => {
    setLineWidth = lineWidth.value;
})

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear canvas', {cvsWidth: canvas.width, cvsHeight: canvas.height});
})


//accept
socket.on('start drawing', (obj)=>{
    //step 3: recv from server and draw (look at step 2 in server.js)
    draw_for_sockets(obj);
})

socket.on('clear canvas', (obj) => {
    ctx.clearRect(0,0, obj.cvsWidth, obj.cvsHeight);
})

socket.on('update user count', (count) => {
    document.getElementById('userCount').innerText = count;
});

function reposition(e) {
    pos.x = e.pageX - canvas.offsetLeft;
    pos.y = e.pageY - canvas.offsetTop;
}

function draw(e) {

    ctx.beginPath();

    //properties
    ctx.lineCap = "round";
    ctx.lineWidth = setLineWidth;
    ctx.strokeStyle = setColor;

    //positions
    startx = pos.x;
    starty = pos.y;

    ctx.moveTo(pos.x, pos.y);
    reposition(e);
    ctx.lineTo(pos.x, pos.y);
    //step 1: send to server
    socket.emit('start drawing', {sx: startx, sy: starty, fx: pos.x, fy: pos.y, linewdth: ctx.lineWidth, style: ctx.strokeStyle});
    //drawing
    ctx.stroke();
    ctx.closePath();
}

function draw_for_sockets(obj) {
    ctx.beginPath();
    //properties
    ctx.lineCap = "round";
    ctx.lineWidth = obj.linewdth;
    ctx.strokeStyle = obj.style;

    ctx.moveTo(obj.sx, obj.sy);
    ctx.lineTo(obj.fx, obj.fy);
    //drawing
    ctx.stroke();
    ctx.closePath();
}


