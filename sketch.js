/*
@author Cody
@date 2021-10-26

Trying to recreate Simon's polygon spring demo, but with comments

patterns used
    loop all, then loop other
    gravityForce method

🔧 step by step 🔧
    particle class inside sketch.js
    particles with applyForce, update, render, dampen (scaleVelocity)
        test generating random particles across the screen with initial y
        velocity ➜ apply gravity
    edges() without this.r. if/else
        make sure this works with many particles before adding this.r
    create particles in circle using polar coordinates, r=42, map [0 ➜ 2π]
    connect all particles with lines using nested loops
        for (const p of particles) {
            for (const other of particles) {
    spring force method
        if (p !== other)
            p.applyForce(springForce(p, other, RL=150, K=0.05))

TODO
    🌟 limit velocity
    add mouseClicked to set particles[0]'s pos
    compare to x-parasite!
    figure out why things stick to the floor
    🌟 add this.r to edges()
    add 3D?
 */

let font
let p

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    console.log("🐳")
    
    p = new Particle(width/2, height/2)
}

function draw() {
    background(234, 34, 24)
    stroke(0, 0, 100, 70)
    noStroke()
    p.show()
}

// a simple particle
class Particle {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y)
        this.vel = p5.Vector.random2D()
        this.acc = new p5.Vector(0, 0)
        this.r = 5
    }

    show() {
        circle(this.pos.x, this.pos.y, this.r*2)
    }
}
