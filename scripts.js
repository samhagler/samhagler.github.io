



var fireworks = []
var gravity;
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB);
  stroke(255);
  strokeWeight(3);
  gravity = createVector(0,0.2);
  fireworks.push(new Firework());
  resizeCanvasToCoverPage();


}

// p5.js draw function
function draw() {
  clear();  // Transparent background
  if (random(1) < 0.1){
    fireworks.push(new Firework());
  }
  for (var i = fireworks.length-1; i >=0 ; i--){
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()){
        fireworks.splice(i,1);
    }
  }

}

function resizeCanvasToCoverPage() {
    let totalHeight = document.body.scrollHeight;
    let totalWidth = document.body.scrollWidth;
    resizeCanvas(totalWidth, totalHeight);
  }
window.addEventListener("resize", resizeCanvasToCoverPage);

function Particle(x,y, hue, firework){
    this.hue = hue;
    let sign = random([-1,1]);
    let sign2 = random([-1,1]);
    this.pos = createVector(x,y);
    this.lifespan = 255;
    if (firework){
        this.vel = createVector(random(10)*sign,random(10)*sign2);
    }
    else{
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2,10));
    }
    this.acc = createVector(0,0);
    this.applyForce = function(force){
        this.acc.add(force);
    }

    this.done = function(){
        if (this.lifespan < 0){
            return true;
        }
        else{
            return false;
        }
    }

    this.update = function(){
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if (!firework){
            this.vel.mult(0.95);
            this.lifespan -= 2;
        }

    }

    this.show = function(){
        if (!firework){
            strokeWeight(2);
            stroke(hue, 255,255,this.lifespan);
        }
        else{
            strokeWeight(4);
            stroke(hue,255255);
        }
        point(this.pos.x, this.pos.y);

    }
}

function Firework(){
    this.hue = random(255);
    this.firework = new Particle(mouseX, mouseY, this.hue,  true);
    this.creationTime = millis();
    this.exploded = false;
    this.particles = [];

    this.done = function() {
        if (this.exploded && this.particles.length === 0){
            return true;
        }else {
            return false;
        }
    }

    this.update = function(){
        if (!this.exploded){
        this.firework.applyForce(gravity);
        this.firework.update();
        this.lifetime = millis() - this.creationTime;
        if (this.lifetime > random(500,1000)){
            this.exploded = true;
            this.explode();
        }
    }
        for (var i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].applyForce(gravity);
            this.particles[i].update();
            if (this.particles[i].done()){
                this.particles.splice(i,1);
            }
        }
    }


    this.explode = function(){
        for (var i = 0; i < 100; i++) {
            var p = new Particle(this.firework.pos.x, this.firework.pos.y,this.hue, false);
            this.particles.push(p);
        }
    }
    this.show = function(){
        if (!this.exploded){
        this.firework.show();}
        for (var i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].show();
        }
    }

}