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

    get magnitude () {return Math.sqrt(this.x**2 + this.y**2)};

    get normalized () {return new Vector2(this.x/this.magnitude, this.y/this.magnitude)};

    get reversed () {return new Vector2(-this.x, -this.y)};

    get abs () {return new Vector2(Math.abs(this.x), Math.abs(this.y))};

    get angle () {return (Math.atan2(this.x,this.y) * (180/Math.PI))};

    
    set add(vector) {return Vector2.add(this, vector)};
    
    
    equals(vector) {
        if(this.x == vector.x && this.y == vector.y) {return true}
        else {return false}
    }
    
    static get zero () {return new Vector2(0,0)};

    static mult(vector, num) {
        return new Vector2(vector.x * num, vector.y * num);
    }
    
    static div(vector,b) {
        return new Vector2(vector.x/num, vector.y/num);
    }

    static add(vector1, vector2) {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static sub(vector1, vector2) {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    static dot(vector1, vector2) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y);
    }
}

class Ball {
    pos = Vector2.zero;
    color = "#000000";
    velocity = Vector2.zero;
    mass = 0;

    constructor(position, mass, color = "#000000") {
        this.pos = position;
        this.mass = mass;
        this.color = color;
    }

    update(dt) {
        this.pos = new Vector2(this.pos.x + this.velocity.x * (dt/1000), this.pos.y + this.velocity.y * (dt/1000))
        this.velocity = Vector2.mult(this.velocity, gameConfig.friction);
    }

    collide(other) {
        /*NOTE Step 1: Find unit normal and unit tangent vectors.
            the unit normal vector is a vector with a magnitude of 1
        */
       //Step 1: Find unit normal and unit tangent vectors
        let differance = Vector2.sub(other.pos, this.pos);
        let normal = differance.normalized;
        let tangent = new Vector2(-normal.y, normal.x);

        //Step 2: TODO
        let thisNormal = Vector2.dot(normal, this.velocity);
        let thisTangent = Vector2.dot(tangent, this.velocity);

        let otherNormal = Vector2.dot(normal, other.velocity);
        let otherTangent = Vector2.dot(tangent, other.velocity);

        //Step 3: TODO 
        thisNormal = (thisNormal * (this.mass - other.mass) + (2 * other.mass * otherNormal)) / (this.mass + other.mass);
        otherNormal = (otherNormal * (other.mass - this.mass) + (2 * this.mass * thisNormal)) / (this.mass + other.mass);

        //Step 4: TODO
        thisNormal = Vector2.mult( normal, thisNormal);
        thisTangent = Vector2.mult(tangent, thisTangent);
        this.velocity = Vector2.add(thisNormal, thisTangent);

        otherNormal = Vector2.mult(normal, otherNormal);
        otherTangent = Vector2.mult(tangent, otherTangent);
        other.velocity = Vector2.add(otherNormal, otherTangent);
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