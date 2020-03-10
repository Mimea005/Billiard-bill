const canv = document.querySelector("canvas");
canv.width = window.innerWidth;
canv.height = window.innerHeight;
const ctx = canv.getContext("2d");

const gameConfig = {
    balls: 8,
    friction: .999,
    radius: 15
}

let oldRuntime = 0;
let renderList = [];

//SECTION definitions
class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a,b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static mult(a, b) {
        return new Vector2(a.x * b, a.y * b);
    }

    static dot(a, b) {
        return (a.x * b.x) + (a.y * b.y);
    }

    static div(a,b) {
        return new Vector2(a.x/b, a.y/b);
    }

    get abs () {
        return new Vector2(Math.abs(this.x), Math.abs(this.y))
    }

    get magnitude2 () {
        return this.x**2 + this.y**2;
    }

    get angle () {
        return (Math.atan2(this.x,this.y) * (180/Math.PI));
    }

    get sum () {
        return this.x + this.y;
    }

}

class Ball {
    pos = new Vector2(0,0);
    color = "#000000";
    velocity = new Vector2(0,0);
    mass = 0;
    kEnergy

    constructor(position, mass, color = "#000000") {
        this.pos = position;
        this.mass = mass;
        this.color = color;
    }

    update(dt) {
        this.pos = new Vector2(this.pos.x + this.velocity.x * (dt/1000), this.pos.y + this.velocity.y * (dt/1000))
        this.velocity = Vector2.mult(this.velocity, gameConfig.friction);
        this.kEnergy;
    }

    collide(other) {
        /*NOTE Step 1: Find unit normal and unit tangent vectors.
            the unit normal vector is a vector with a magnitude of 1
        */
        let normal = Vector2.sub(other.pos, this.pos);
        let uNormal = new Vector2(normal.x/normal.magnitude2, normal.y/normal.magnitude2)
        let uTangent = new Vector2(-uNormal.y, uNormal.x);

        let v1n = Vector2.dot(uNormal, this.velocity);
        let v1t = Vector2.dot(uTangent, this.velocity);

        let v2n = Vector2.dot(uNormal, other.velocity);
        let v2t = Vector2.dot(uTangent, other.velocity);

        v1n = (v1n * (this.mass - other.mass) + (2*other.mass*v2n)) / (this.mass + other.mass);
        v2n = (v2n * (other.mass - this.mass) + (2*this.mass*v1n)) / (this.mass + other.mass);

        v1n = Vector2.mult( uNormal, v1n);
        v1t = Vector2.mult(uTangent, v1t);
        this.velocity = Vector2.add(v1n,v1t);

        v2n = Vector2.mult(uNormal, v2n);
        v2t = Vector2.mult(uTangent, v2t);
        other.velocity = Vector2.add(v2n, v2t);
    }
}


function update(runtime) {
    requestAnimationFrame(update);

    let dTime = runtime - oldRuntime;
    oldRuntime = runtime;

    collisionCheck()

    for(ball of renderList) {
        ball.update(dTime);
    }
    draw();
}

function collisionCheck() {
    for(ball of renderList) {
        for(other of renderList) {
            if(other === ball) {continue};
            if(Math.pow(other.pos.x - ball.pos.x,2) + Math.pow(other.pos.y - ball.pos.y,2)<=Math.pow(gameConfig.radius*2,2)) {
                ball.collide(other);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0,0,canv.width,canv.height);

    for(ball of renderList) {
        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.arc(ball.pos.x, ball.pos.y,gameConfig.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
}

renderList[0] = new Ball(new Vector2(230, 230), 1);
renderList[1] = new Ball(new Vector2(300,230), 1, "#00ffff");
renderList[1].velocity = new Vector2(-10, 0);

requestAnimationFrame(update);