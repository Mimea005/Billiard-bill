class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {return Math.sqrt(this.x**2+this.y**2)};
    
    get normalized() {return new Vector(this.x / this.magnitude, this.y / this.magnitude)};
    
    get reversed() {return new Vector(-this.x, -this.y)};

    equals(vector) {
        if (this.x == vector.x && this.y == vector.y) {
            return true;
        } else {
            return false;
        }
    }

    static get zero() {return new Vector(0, 0)};

    static mul(vector, num) {
        return new Vector(vector.x * num, vector.y * num);
    }
    
    static div(vector, num) {
        return new Vector(vector.x / num, vector.y / num);
    }

    static dot(vector1, vector2) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y);
    }

    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    static distance(vector1, vector2) {
        return new Vector(vector2.x - vector1.x, vector2.y - vector1.y);
    }
}