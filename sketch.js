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
.   edges() without this.r. if/else
        make sure this works with many particles before adding this.r
.   create particles in circle using polar coordinates, r=42, map [0 ➜ 2π]
.   connect all particles with lines using nested loops
        for (const p of particles) {
            for (const other of particles) {
*   spring force method
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
let VERTICES = 6 // the number of vertices in our circle
let RADIUS = 42 // the radius of the circle
let angle = 0 // the angle we're currently at
let DELTA_ANGLE // what is the rate that our angle is
// changing at?

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    console.log("🐳")

    DELTA_ANGLE = 2*PI/VERTICES

    for (let i = 0; i < VERTICES; i++) {
        let x = // the x coordinate of our particle
            RADIUS*cos(angle)+width/2
        let y = // the y coordinate of our particle
            RADIUS*sin(angle)+height/2
        let c = color(map(angle, 0, 2*PI, 0, 360)%360, 80, 80)
        let p = new Particle(x, y, c)
        particles.push(p)
        angle += DELTA_ANGLE
    }
}

function draw() {
    background(234, 34, 24)
    stroke(0, 0, 100, 70)
    fill(0, 0, 100)
    for (let p of particles) {
        p.applyForce(gravity(0.1))
        p.edges()
        // let's connect everyone with springs!
        for (let other of particles) {
            // if other != p...
            if (other !== p) {
                // ...we should connect everything.
                stroke(0, 0, 100)
                line(p.pos.x, p.pos.y, other.pos.x, other.pos.y)
                // we should also draw a line between these particles
                p.applyForce(springForce(p, other, 150, 0.05))
            }
        }
        // p.applyForce(gravity(0.01))
    }

    // let's show and update everyone!
    particles.forEach(function(p) {
        p.show()
        p.update()
    })

}

function gravity(strength) {
    return new p5.Vector(0, strength)
}

// let's exert a spring force on our particles!
function springForce(a, b, restLength, k) {
    // Fₛ = x*k where x is the distance between the 2 objects minus the
    // rest length, k is the spring constant, and Fₛ is the spring force.
    let x = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y) - restLength
    let spring_force = p5.Vector.sub(a.pos, b.pos)
    spring_force.setMag(-k*x)
    return spring_force
}

class Banana {
    constructor(x, y) {
        this.sheet = loadImage("banana.png")
        this.pos = new p5.Vector(x, y)
        this.vel = p5.Vector.random2D()
        this.acc = new p5.Vector(0, 0)
        this.broke = false
    }

    show() {
        if (!this.broke) {
            image(this.sheet, this.pos.x, this.pos.y)
        }
    }

    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.setMag(0)
    }

    applyForce(f) {
        // F = ma. A banana is much heavier than 1 pound, but for the sake
        // of our animation, we should really assume everything is 1 pound,
        // so a = F.
        this.acc.add(f)
    }

    edges() {
        // right
        if (this.pos.x > width) {
            this.vel.x *= -1
            this.pos.x = width
            this.broke = true
        }
        // left
        else if (this.pos.x < 0) {
            this.pos.x = 0
            this.vel.x *= -1
            this.broke = true
        }
        // bottom (positive y's are downwards). bounce harder on bottom
        else if (this.pos.y > height) {
            this.vel.y *= -1.15
            this.pos.y = height
            this.broke = true
        }
        // top
        else if (this.pos.y < 0) {
            this.vel.y *= -1
            this.pos.y = 0
            this.broke = true
        }
    }
}

// a simple line that disappears over time
class Line {
    constructor(x1, y1, x2, y2, c) {
        this.a = new p5.Vector(x1, y1)
        this.b = new p5.Vector(x2, y2)
        this.c = c
        this.lifetime = 100
        this.disappearRate = 6
        this.bananas = []
        for (let i = 0; i < 3; i++) {
            // let's lerp with a random t! (this is the first time I've ever
            // used lerp in this project)
            let pos = p5.Vector.lerp(this.a, this.b, random(0, 1))
            this.bananas.push(new Banana(pos.x, pos.y))
        }
    }

    show() {
        for (let b of this.bananas) {
            b.show()
        }


        stroke(hue(this.c), saturation(this.c), brightness(this.c), this.lifetime)
        line(this.a.x, this.a.y, this.b.x, this.b.y)
    }

    update() {
        this.lifetime -= this.disappearRate

        for (let b of this.bananas) {
            b.applyForce(gravity(0.01))
            b.update()
            b.edges()
        }
    }
}

// a simple particle
class Particle {
    constructor(x, y, c) {
        this.pos = new p5.Vector(x, y)
        this.vel = p5.Vector.random2D()
        this.acc = new p5.Vector(0, 0)
        this.r = 5
        this.c = c
        this.right_line = null
        this.left_line = null
        this.top_line = null
        this.bottom_line = null
    }

    show() {


        // we also need to draw our edges
        if (this.right_line) {
            this.right_line.show()
        }
        if (this.left_line) {
            this.left_line.show()
        }
        if (this.top_line) {
            this.top_line.show()
        }
        if (this.bottom_line) {
            this.bottom_line.show()
        }

        fill(this.c)
        noStroke()

        // the third argument is diameter
        circle(this.pos.x, this.pos.y, this.r*2)
    }

    update() {
        this.vel.add(this.acc)
        this.vel.limit(15)
        this.pos.add(this.vel)
        this.acc.mult(0)

        if (this.right_line) {
            this.right_line.update()
        }
        if (this.left_line) {
            this.left_line.update()
        }
        if (this.top_line) {
            this.top_line.update()
        }
        if (this.bottom_line) {
            this.bottom_line.update()
        }
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
            this.right_line = new Line(width, 0, width, height, this.c)
        }
        // left
        else if (this.pos.x - this.r < 0) {
            this.pos.x = this.r
            this.vel.x *= -1
            this.left_line = new Line(0, 0, 0, height, this.c)
        }
        // bottom (positive y's are downwards). bounce harder on bottom
        else if (this.pos.y + this.r > height) {
            this.vel.y *= -1.15
            this.pos.y = height - this.r
            this.bottom_line = new Line(0, height, width, height, this.c)
        }
        // top
        else if (this.pos.y - this.r < 0) {
            this.vel.y *= -1
            this.pos.y = this.r
            this.top_line = new Line(0, 0, width, 0, this.c)
        }
    }
}
