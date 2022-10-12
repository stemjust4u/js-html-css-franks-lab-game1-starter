/* 
Game is a Tutorial from https://www.youtube.com/c/Frankslaboratory

Declaring Variables
Older method - var
BKM - Prefer const, otherwise if variable changes us let
     Minimize the variable's scope.
Variables defined with let cannot be Re-declared. With var you can redeclare
Variables defined with let must be Declared before use.
Variables defined with let have Block Scope.

Before ES6 (2015), JavaScript had only Global Scope and Function Scope.
ES6 introduced two important new JavaScript keywords: let and const.
These two keywords provide Block Scope in JavaScript.
Variables declared inside a { } block cannot be accessed from outside the block:


the 'this' keyword refers to an object.
Which object depends on how this is being invoked (used or called).
    In an object method, this refers to the object.
    Alone, this refers to the global object.
    In a function, this refers to the global object.
    In a function, in strict mode, this is undefined.
    In an event, this refers to the element that received the event.
    Methods like call(), apply(), and bind() can refer this to any object. 
    
the 'new' keyword - 
    It creates a new object. The type of this object is simply object.
    It sets this new object's internal, inaccessible, [[prototype]] (i.e. __proto__) property to be the constructor function's external, accessible, prototype object (every function object automatically has a prototype property).
    It makes the this variable point to the newly created object.
    It executes the constructor function, using the newly created object whenever this is mentioned.
    It returns the newly created object, unless the constructor function returns a non-null object reference. In this case, that object reference is returned instead.
    
*/

window.addEventListener('load', function(){
    // load event fires when the whole page has been loaded, including all dependent resources such as stylesheets and images. Image needs to be fully loaded before running js code that depends on it.
    const canvas = document.getElementById('canvas1'); // variable for canvas
    const ctx = canvas.getContext('2d'); // Drawing context is a built in object that allows to daw and animate colors, shapes and other graphics on HTML canvas. Can pass it 2d or webgl for 3D.
    canvas.width = 500;
    canvas.height = 500;

    // Handle inputs. 
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => { // using e as variable to collect key information. could console log e by itself for all info.
                                    // Have to use => arrow function so js can remember what keys were pressed
                                    // Special feature of arrow function is that 'this' keyword inside arrow function always represents the object in which the arrow function is defined.
                                    // Arrow functions don't have their own bindings to 'this'
                                    // It knows it was defined in constructor(game) and reference 'this.game'.
                                    // This allows it to access this.game.keys and push keys inside the list
                                    // The handling of this is different in arrow functions compared to regular functions.
                                    // In short, with arrow functions there are no binding of this.
                                    // In regular functions the this keyword represented the object that called the function, which could be the window, the document, a button or whatever.
                                    // With arrow functions the this keyword always represents the object that defined the arrow function.
                  
                if ((   (e.key === 'ArrowUp') ||
                    (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){  // Only want to add the key if it doesn't already exists in the array
                    this.game.keys.push(e.key);
                } else if ( e.key === ' '){
                    this.game.player.shootTop();
                }
                // console.log(this.game.keys);
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1){ // .indexOf() will return the first index the key is found. or -1 if it is not there
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1); //If the key that is being released exists in the array then remove it
                }
                // console.log(this.game.keys);
            });
        }
    }
    class Projectile {
        constructor(game, x, y){ // pass game and player x,y location for projectile starting location
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        draw(context) {
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Particle {

    }
    // Player will need access to game details so game object is passed as an argument.
    class Player {
        constructor(game){
            this.game = game; // convert game object into class property on player class. this keyword refers to an object. It is not a copy but a reference to the game.
                              // When changes in game are made they will be immediately visible from the .game reference inside the player class.
            this.width = 120; // Made the player sprite sheet the same size as drawn in game as bkm.
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0; // initialize at 0. vertical movement
            this.maxSpeed = 3;
            this.projectiles = [];
        }
        update(){
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            // handle projectiles. For each element in the array call update method from Projectile class
            this.projectiles.forEach(projectile => {
                projectile.update();  // updates x location
            });
            // .filter() method creates a new array with all elements that pass the test implemented by the provided function
            // we want all elements to have marked for deletion properties set. filter out elements set to true  
            // since .filter creates a new array it will override teh original with the new filtered one.
            // So now when a projectile is marked for deletion it will get removed from projectiles array
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        // draw the player
        draw(context){  // pass context argument to specify which canvas element to draw on in case the game has multiples
            context.fillStyle = 'black';
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
        shootTop(){
            if (this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
                //console.log(this.projectiles);
            }
            
        }


    }
    class Enemy {  // Parent class (super)
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 -0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
        }
        update(){
            this.x += this.speedX;
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }

    }
    class Angler1 extends Enemy { // Child class (sub)
        constructor(game){
            super(game);  // Will merge the Super/parent class Enemy with Angler1. otherwise Angler1 would over-write the Enemy/parent constructor
            this.width = 228 * 0.2;
            this.height = 169 * 0.2;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
        }
    }
    class Layer {

    }
    class Background {

    }
    class UI {
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
        draw(context){
            context.save(); // can use save/restore to do different settings for a portion of code, like shadow below
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // score
            context.fillText('Score: ' + this.game.score, 20, 40);
            // ammo
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            // timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100);
            // game over messages
            if (this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore){
                    message1 = 'You Win!';
                    message2 = 'Well done!';
                } else {
                    message1 = 'You Lose!';
                    message2 = 'Try again!';
                }
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
            }
            context.restore(); // will restore from most previously saved .. used above
        }

    }
    class Game {
        constructor(width, height){ // pass width and height of canvas and convert to class properties -> this.width, etc
            // this will make sure the width and height of the game match the size of the canvas element.
            this.width = width;
            this.height = height;
            this.player = new Player(this); // new keyword will look for a class with Player name and run its constructor method to create one js object/instance of it.
                                        // The Player class needs 'game' as an argument so we pass it 'this' keyword. 'this' refers to the entire game object.
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            // keys list is created in Game class and updated in InputHandler
            this.keys = [];  // Latest key pressed is available anywhere in the game
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500; // 500ms
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 10;
            this.gameTime = 0;
            this.timeLimit = 15000;
        }
        update(deltaTime){
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.player.update();
            if (this.ammoTimer > this.ammoInterval){
                    if (this.ammo < this.maxAmmo) this.ammo++;
                    this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                })
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.player.draw(context);  // Player.draw expects 'context' so have to pass it as an argument.
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
        }
        addEnemy(){
            this.enemies.push(new Angler1(this));
            //console.log(this.enemies); // confirm enemies being deleted from array
        }
        checkCollision(rect1, rect2){
            return (    rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.height + rect1.y > rect2.y)
        }
    }

    const game = new Game(canvas.width, canvas.height); // Game constructor expects width/height of canvas.
    let lastTime = 0;

    // animation loop
    function animate(timeStamp){  // timeStamp is automatically passed as special feature from requestAnimationFrame
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime); // can run to see deltaTime is 16.6ms. 1000ms/16.6ms = 60fps
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas/screen between frames
        game.update(deltaTime);
        game.draw(ctx); // pass it the canvas to draw on -> ctx from initial variable declarations
        // Pass the parent function animate to create an endless animation loop
        requestAnimationFrame(animate); // Tells the browser an animation is being requested and request the browser call a specified function to update an animation before the next repaint.
        // requestAnimationFrame also automatically passes a timestamp argument to the function it calls. ie 'animate'
    }
    animate(0); // passing 0 as the initial time stamp. animate function then calls itself over and over.
});


// OOP - will wrap variables and functions in objects. js is a prototype based OOP which means it doesn't have classes but instead has prototypes. But can use modern js syntax that introduced classes as so called syntactical sugar (mimics classes from other programming languages). But at its core it's prototype based inheritance.
// Classes have to be specified in specific order. js can not use the class until it is defined in the code.
// Encapsulation - the bundling of data and the methods that act on that data in objects. Access to that data from outside can be restricted.
// Constructor is a special method on js class. When called later using the new keyword, constructor will create one new blank js object and assign it properties and values based on the blueprint inside. It will run once when we instantiate the class using the new keyword.
// Objects in js are reference data types which means that unlike primitive data types they are dynamic.
// Inheritance - if property/method is not found in child it will look in parent