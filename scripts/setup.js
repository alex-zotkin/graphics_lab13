let gl;
let program;
let vertexBuffer;
let indexBuffer;
let textureCoordsBuffer;

let camera;

function initShaders(){
    let fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    let vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Не удалсь установить шейдеры");
    }

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
}
function getShader(type,id) {
    let source = document.getElementById(id).innerHTML;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
function initBuffers() {
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    textureCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);
}


function clear(){
    gl.clearColor(0.106, 0.106, 0.115, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}

function setup(){
    let canvas = document.getElementById("canvas3D");
    try { gl = canvas.getContext("webgl2");}
    catch(e) {}
    if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }

    if(gl){
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        initBuffers();

        camera = new Camera();
    }
}