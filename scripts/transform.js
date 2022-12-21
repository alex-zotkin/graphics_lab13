function setScaleToShader(scaleArr){
    let scale_mat = mat4.create();
    mat4.scale(scale_mat, scale_mat, scaleArr);
    let u_scale = gl.getUniformLocation(program, "u_scale");
    gl.uniformMatrix4fv(u_scale,false, scale_mat);
}

function setTranslateToShader(translateArr){
    let translate_mat = mat4.create();
    mat4.translate(translate_mat, translate_mat, translateArr);
    let u_translate = gl.getUniformLocation(program, "u_translate");
    gl.uniformMatrix4fv(u_translate,false, translate_mat);
}

function setRotateToShader(rotateArr){
    let rotate_mat = mat4.create();
    mat4.rotate(rotate_mat, rotate_mat, rotateArr[0] * Math.PI / 180, [1.0, 0.0, 0.0]);
    mat4.rotate(rotate_mat, rotate_mat, rotateArr[1] * Math.PI / 180, [0.0, 1.0, 0.0]);
    mat4.rotate(rotate_mat, rotate_mat, rotateArr[2] * Math.PI / 180, [0.0, 0.0, 1.0]);
    let u_rotate = gl.getUniformLocation(program, "u_rotate");
    gl.uniformMatrix4fv(u_rotate,false, rotate_mat);
}