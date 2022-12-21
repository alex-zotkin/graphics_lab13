class Camera {
    _position = [0.0, 0.0, 0.0];
    _rotation = [0.0, 0.0, 0.0];

    _mvMatrix =  mat4.create();
    _pMatrix = mat4.create();

    constructor() {
        mat4.perspective(this._pMatrix, 1.04, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
        let u_pMatrix = gl.getUniformLocation(program, "u_pMatrix");
        gl.uniformMatrix4fv(u_pMatrix,false, this._pMatrix);

        this.Translate(0.0, 0.0, -8.0);
        this.checkEvents();
    }

    Redraw(){
        mat4.identity(this._mvMatrix);

        mat4.translate(this._mvMatrix, this._mvMatrix, this._position);

        mat4.rotate(this._mvMatrix, this._mvMatrix, this._rotation[0] * Math.PI / 180, [1.0, 0.0, 0.0]);
        mat4.rotate(this._mvMatrix, this._mvMatrix, this._rotation[1] * Math.PI / 180, [0.0, 1.0, 0.0]);
        mat4.rotate(this._mvMatrix, this._mvMatrix, this._rotation[2] * Math.PI / 180, [0.0, 0.0, 1.0]);

        let u_mvMatrix = gl.getUniformLocation(program, "u_mvMatrix");
        gl.uniformMatrix4fv(u_mvMatrix, false, this._mvMatrix);
    }

    Translate(x, y, z){
        this._position = [x, y, z];
        this.Redraw();
    }

    TranslateDelta(delta_x, delta_y, delta_z){
        let x = this._position[0] + delta_x;
        let y = this._position[1] + delta_y;
        let z = this._position[2] + delta_z;

        this.Translate(x, y, z);
    }

    Rotate(angle_x, angle_y, angle_z){
        this._rotation = [angle_x, angle_y, angle_z];
        this.Redraw();
    }

    RotateDelta(delta_angle_x, delta_angle_y, delta_angle_z){
        let angle_x = this._rotation[0] + delta_angle_x;
        let angle_y = this._rotation[1] + delta_angle_y;
        let angle_z = this._rotation[2] + delta_angle_z;
        this.Rotate(angle_x, angle_y, angle_z);
    }





    _mouseLastPosition = {
        x: 0,
        y: 0
    }

    checkEvents(){
        self = this;
        $(window).on('mousewheel', function(e){
            if(e.originalEvent.wheelDelta > 0) {
                self.TranslateDelta(0.0, 0.0, 0.3);
            }
            else{
                self.TranslateDelta(0.0, 0.0, -0.3);
            }
        });


        let mousedown = false;
        $(window).on("mousedown", function(e) {
            mousedown = true;
            self._mouseLastPosition = {
                x: e.clientX,
                y: e.clientY
            }
        });

        $(window).on("mousemove", function(e){
            if(mousedown){
                let factor = 6 / gl.viewportHeight;
                let delta_x = factor * (e.clientX - self._mouseLastPosition.x);
                let delta_y = factor * (e.clientY - self._mouseLastPosition.y);

                if (e.which === 1) {
                    self.RotateDelta(delta_y * 30, delta_x * 30 ,0.0);
                }

                else if (e.which === 3) {
                    self.TranslateDelta(delta_x, -1 * delta_y, 0.0);
                }

                self._mouseLastPosition = {
                    x: e.clientX,
                    y: e.clientY
                }
            }
        })

        $(window).on("mouseup", function() {
            mousedown = false;
        });
    }
}



