let dogs = [];
let cat;

window.onload = function(){
    setup();
    clear();

    let dog = new Model();
    dog.getModel("dog");
    dog.setTranslate(0.0, -0.8, 1.5);

    for(let i = 0; i < 10; i++){
        let new_dog = new Model();
        new_dog.cloneFromModel(dog);

        let f = Math.random() * (0.5 - 0.3) + 0.3;
        let s = Math.random() * (0.2 - 0.4) + 0.4;
        new_dog.setScale(s, s, s);

        new_dog.setTranslate(
            Math.cos(i*40*Math.PI/180) * 3.0 * f,
            new_dog.model.position[1],
            Math.sin(i*40*Math.PI/180) * 3.0 * f
        );

        new_dog.model.factor = f;

        dogs.push(new_dog);
    }

    // dogs.forEach(function(d){
    //     d.drawModel();
    // });


    cat = new Model();
    cat.getModel("cat");
    cat.setScale(1.2, 1.2, 1.2);
    cat.setTranslate(0.0, 0.5, 0.0);
    //cat.drawModel();

    console.log(dogs)
    console.log(cat)

    animate();
}


let angle = 0;
function animate(){
    clear();

    cat.setRotateDelta(
        0.0,
        0.1,
        0.0
    );
    cat.drawModel();

    dogs.forEach(function(dog){
         dog.setRotateDelta(
             0.0,
             Math.random() * dog.model.factor,
             0.0
         );

        dog.setTranslate(
            Math.cos((angle / dog.model.factor) * Math.PI/180) * 5.0 * dog.model.factor,
            0.0,
            Math.sin((angle / dog.model.factor) *Math.PI/180) * 5.0 * dog.model.factor
        );

        dog.drawModel();
     });



    angle += 0.05;
    requestAnimationFrame(animate);
}

