let penguins = [];
let girl;

window.onload = function(){
    setup();
    clear();

    let penguin = new Model();
    penguin.getModel("penguin");
    penguin.setTranslate(0.0, -0.8, 1.5);
    // penguin.drawModel();
    // penguins.push(penguin);

    for(let i = 0; i < 10; i++){
        let new_penguin = new Model();
        new_penguin.cloneFromModel(penguin);

        let f = Math.random() * (2.5 - 0.3) + 0.3;
        let s = Math.random() * (0.6 - 0.3) + 0.3;
        new_penguin.setScale(s, s, s);

        new_penguin.setTranslate(
            Math.cos(i*40*Math.PI/180) * 1.5 * f,
            new_penguin.model.position[1],
            Math.sin(i*40*Math.PI/180) * 1.5 * f
        );

        new_penguin.model.factor = f;

        penguins.push(new_penguin);
    }

    penguins.forEach(function(p){
        p.drawModel();
    });


    girl = new Model();
    girl.getModel("girl");
    girl.setScale(1.2, 1.2, 1.2);
    girl.setTranslate(0.0, -0.8, 0.0);
    girl.drawModel();

    animate();
}


let angle = 0;
function animate(){
    clear();

    penguins.forEach(function(penguin){
         penguin.setRotateDelta(
             0.0,
             Math.random() * penguin.model.factor,
             0.0
         );

        penguin.setTranslate(
            Math.cos((angle / penguin.model.factor) * Math.PI/180) * 1.5 * penguin.model.factor,
            0.0,
            Math.sin((angle / penguin.model.factor) *Math.PI/180) * 1.5 * penguin.model.factor
        );

        penguin.drawModel();
     });

    girl.setRotateDelta(
        0.0,
        0.5,
        0.0
    );
   girl.drawModel();

    angle += 0.5;
    requestAnimationFrame(animate);
}

