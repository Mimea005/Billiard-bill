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