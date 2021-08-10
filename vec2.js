export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  addScalar(value) {
    this.x += value;
    this.y += value;
    return this;
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  subScalar(value) {
    this.x -= value;
    this.y -= value;
    return this;
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  multiplyScalar(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  copy(vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}
