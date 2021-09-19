var canvas, ctx = false
var x = "black", y = 2;
var pixels = [];
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    pixels = [];
    for (var i = 0; i < 28*28; i++) pixels[i] = 0;
    var click = 0;
    var parar = 1;
    var canvas = document.querySelector("canvas");
    canvas.addEventListener("mousemove", function(e){
        if (e.buttons == 1 && parar == 1) {
        
            click = 1;
            canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
            canvas.getContext("2d").fillRect(e.offsetX, e.offsetY, 10, 10);
            x = Math.floor(e.offsetY * 0.1);
            y = Math.floor(e.offsetX * 0.1) + 1;
            for (var dy = 0; dy < 2; dy++){
                for (var dx = 0; dx < 2; dx++){
                    if ((x + dx < 28) && (y + dy < 28)){
                        pixels[(y+dy)+(x+dx)*28] = 1;
                    }
                }
            }
        } else {
            if (click == 1) {set_value(pixels); parar = 1}; 
            click = 0;
        }
    });
}

function set_value(pixels){
    var result = "[["
    for (var i = 0; i < 28; i++) {
        result += "["
        for (var j = 0; j < 28; j++) {
            result += pixels[i * 28 + j]
            if (j < 27) {
                result += ", "
            }
        }
        result += "]"
        if (i < 27) {
            result += ", "
        }
    }
    result += "]]"
    document.getElementById("pix").innerHTML = result;
}


function erase() {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
    for (var i = 0; i < 28*28; i++) pixels[i] = 0;
    set_value(pixels);
    init();
}

function postData() {
    var questionObj0 = {'questionNumber': 1, 'question': 'Convert 10110001 to decimal', 'answer': 177, 'userAnswer': 'blank'};
    console.log('holqaaaaaaaaaaaaaa')
    console.log(JSON.stringify(questionObj0));
    
    $.ajax({
        type: 'POST',
        url: "{{url_for('predict')}}",
        data: JSON.stringify(questionObj0),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    }).done(function(msg) {
        console.log(msg);
    });
}