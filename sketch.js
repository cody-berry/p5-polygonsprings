/*
@author Cody
@date 2021-10-26

Trying to recreate Simon's polygon spring demo, but with comments

patterns used
    loop all, then loop other
    gravityForce method

🔧 step by step 🔧
.   particle class inside sketch.js
.   particles with applyForce, update, render, dampen (scaleVelocity)
        test generating random particles across the screen with initial y
        velocity ➜ apply gravity
*   edges() without this.r. if/else
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
let particles = []

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    console.log("🐳")

    for (let i = 0; i < 100; i++) {
        let p = new Particle(random(width), random(height))
        particles.push(p)
    }
}

function draw() {
    background(234, 34, 24)
    stroke(0, 0, 100, 70)
    noStroke()
    for (let p of particles) {
        p.show()
        p.update()
        p.applyForce(gravity(0.1))
        p.edges()
    }
}

function gravity(strength) {
    return new p5.Vector(0, strength)
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
        // the third argument is diameter
        circle(this.pos.x, this.pos.y, this.r*2)
    }

    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    applyForce(force) {
        // in this world, m = 1.
        // F = ma, and because m is 1, F = a, or more importantly, a = F.
        this.acc.add(force)
    }

    // bounces off the edges
    edges() {
        // right
        if (this.pos.x + this.r > width) {
            this.vel.x *= -1
            this.pos.x = width - this.r
        }
        // left
        else if (this.pos.x - this.r < 0) {
            this.pos.x = this.r
            this.vel.x *= -1
        }
        // bottom (positive y's are downwards). bounce harder on bottom
        else if (this.pos.y + this.r > height) {
            this.vel.y *= -1.5
            this.pos.y = height - this.r
        }
        // top
        else if (this.pos.y - this.r < 0) {
            this.vel.y *= -1
            this.pos.y = this.r
        }
    }
}
