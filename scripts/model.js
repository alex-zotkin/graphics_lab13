_texture_number = 0;

class Model {
    model = {
        scale: [1.0, 1.0, 1.0],
        position: [0.0, 0.0, 0.0],
        rotation: [0.0, 0.0, 0.0],
        factor: 1.0,

        vertexes : [0, 0, 0],
        faces : [],
        textures_coords: [],
        textures: {},

        vertexes_with_indexes : [],
    }

    constructor(){}

    getModel(model_name){
        let self = this;
        let obj_data;
        let materials = {};

        let all_text_coords = [0, 0];
        let texture_coords = [];

        $.ajax({
            url: "/models/"+ model_name + "/"+ model_name +".obj",
            method: 'get',
            dataType: 'text',
            async: false,
            success: function(data){
                obj_data = data.split(/\r?\n/);
            }
        });

        obj_data.forEach(function(line){
            line = line.trim().replace("  ", " ");

            if(line[0] === "v"){
                let v_line = line.split(" ").slice(1);

                if(line[1] === " "){
                    v_line.forEach(function(v){
                        self.model.vertexes.push(parseFloat(v));
                    });
                }

                else if(line[1] === "t"){
                    v_line.forEach(function(vt){
                        all_text_coords.push(parseFloat(vt));
                    });
                }
            }

            else if(line.slice(0, 6) === "usemtl"){
                self.model.faces.push([]);
                texture_coords.push([]);

                self.model.faces[self.model.faces.length - 1][0] =
                    materials[line.replace("usemtl ", "")];
            }

            else if(line[0] === "f"){
                let cur_face = [];
                let cur_texture_data = [];

                let f_line = line.split(" ").slice(1);

                f_line.forEach(function(f_group){
                    f_group = f_group.split("/");
                    let v_index = parseInt(f_group[0]);
                    let vt_index = parseInt(f_group[1]);
                    let vn_index = parseInt(f_group[2]);

                    if(cur_face.length < 3){
                        cur_face.push(v_index);
                        cur_texture_data.push(
                            all_text_coords[vt_index * 2],
                            all_text_coords[vt_index * 2 + 1]
                        );
                    }

                    if(cur_face.length === 3){
                        self.model.faces[self.model.faces.length - 1]
                            .push(cur_face[0], cur_face[1], cur_face[2]);

                        texture_coords[texture_coords.length - 1]
                            .push(cur_texture_data[0],
                                cur_texture_data[1],
                                cur_texture_data[2],
                                cur_texture_data[3],
                                cur_texture_data[4],
                                cur_texture_data[5]);

                        cur_face[1] = cur_face[2];
                        cur_face = cur_face.splice(0, 2);

                        cur_texture_data[2] = cur_texture_data[4];
                        cur_texture_data[3] = cur_texture_data[5];
                        cur_texture_data = cur_texture_data.splice(0, 4);
                    }
                });
            }

            else if(line.slice(0, 6) === "mtllib"){
                let materials_filename = line.replace("mtllib ", "");
                let materials_data;
                let material_name;

                $.ajax({
                    url: "/models/"+ model_name +"/" + materials_filename,
                    method: 'get',
                    dataType: 'text',
                    async: false,
                    success: function(data){
                        materials_data = data.split(/\r?\n/);
                    }
                });

                materials_data.forEach(function(material_line){
                    if(material_line.slice(0, 6) === "newmtl"){
                        material_name = material_line.replace("newmtl ", "");
                    }

                    else if(material_line.slice(0, 6) === "map_Kd"){
                        materials[material_name] = "/models/" + model_name + "/" + material_line.replace("map_Kd ", "");
                    }
                })
            }
        });

        this.model.textures_coords = texture_coords;


        for(let i = 0; i < this.model.faces.length; i++){
            this.model.vertexes_with_indexes.push([]);

            this.model.faces[i].forEach(function (face, index){
                if(index !== 0){
                    self.model.vertexes_with_indexes[self.model.vertexes_with_indexes.length - 1].push(
                        self.model.vertexes[face * 3],
                        self.model.vertexes[face * 3 + 1],
                        self.model.vertexes[face * 3 + 2],
                    );
                }
            });
        }
    }

    setTexture(texture_src, texture_coords){
        let a_textCoords = gl.getAttribLocation(program, 'a_textCoords');
        gl.enableVertexAttribArray(a_textCoords);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_textCoords, 2, gl.FLOAT, false, 0, 0);

        if(texture_src in this.model.textures){
            let text = this.model.textures[texture_src];

            let u_sampler = gl.getUniformLocation(program, "u_sampler");
            gl.uniform1i(u_sampler, text.texture_number );

            gl.activeTexture(gl.TEXTURE0 + text.texture_number);
            gl.bindTexture(gl.TEXTURE_2D, text.texture);
        }

        else {
            let image = new Image();
            image.src = texture_src;

            let u_sampler = gl.getUniformLocation(program, "u_sampler");
            gl.uniform1i(u_sampler, _texture_number);

            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);

            this.model.textures[texture_src] = {
                texture: texture,
                texture_number: _texture_number
            }

            gl.activeTexture(gl.TEXTURE0 + _texture_number);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            _texture_number++;
        }

    }

    drawModel(){
        initBuffers();
        let a_position = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(a_position);

        setScaleToShader(this.model.scale);
        setTranslateToShader(this.model.position);
        setRotateToShader(this.model.rotation);

        for(let i = 0; i < this.model.faces.length; i++){
            let texture_src = this.model.faces[i][0];
            let texture_coords = this.model.textures_coords[i];
            let vertexes = this.model.vertexes_with_indexes[i];

            this.setTexture(texture_src, texture_coords);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false,  0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, vertexes.length);
        }
    }

    cloneFromModel(obj){
        this.model = Object.assign({}, obj.model);
    }

    setTranslate(x, y, z){
        this.model.position = [x, y, z];
    }

    setTranslateDelta(delta_x, delta_y, delta_z){
        let x = this.model.position[0] + delta_x;
        let y = this.model.position[1] + delta_y;
        let z = this.model.position[2] + delta_z;

        this.setTranslate(x, y, z);
    }

    setScale(x, y, z){
        this.model.scale = [x, y, z];
    }

    setScaleDelta(delta_x, delta_y, delta_z){
        let x = this.model.scale[0] + delta_x;
        let y = this.model.scale[1] + delta_y;
        let z = this.model.scale[2] + delta_z;

        this.setScale(x, y, z);
    }

    setRotate(angle_x, angle_y, angle_z){
        this.model.rotation = [angle_x, angle_y, angle_z];
    }

    setRotateDelta(delta_angle_x, delta_angle_y, delta_angle_z){
        let angle_x = this.model.rotation[0] + delta_angle_x;
        let angle_y = this.model.rotation[1] + delta_angle_y;
        let angle_z = this.model.rotation[2] + delta_angle_z;

        this.setRotate(angle_x, angle_y, angle_z);
    }
}





