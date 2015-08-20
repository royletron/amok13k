global.Char = function(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.renderer = new Renderer(CHAR_WIDTH, CHAR_HEIGHT, alpha);
  if(this.bg !== undefined)
  {
    this.renderer.context.fillStyle = '#'+this.bg;
    this.renderer.context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
  }
  this.renderer.context.fillStyle = '#'+this.color;
  this.renderer.context.textAlign = 'center';
  this.renderer.context.font = FONT;
  this.renderer.context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT -1);
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
};

global.Body = function(x, y, width, height, fixed) {
  this.x = x; this.y = y; this.width = width; this.height = height;
  this.fixed = fixed || false;
  this._lastposition = {x: x, y: y};
  this.velocity = {x: 0, y: 0};
  this.maxvelocity = {x: -1, y: -1};
  this.acceleration = {x: 0, y: 0};
  this.iscolliding = false;
  this.bounciness = 0.8;
  this.update = function(dt) {
    this._lastposition = {x: this.x, y: this.y};
    if(!this.fixed) {
      this.x += this.velocity.x * dt;
      this.y += this.velocity.y * dt;
    }
  };
  // this.impact = function
};

global.Physics = {
  _bodies: [],
  createBody: function(entity, x, y, width, height, fixed) {
    var body = new Body(x, y, width, height, fixed);
    this._bodies.push({body: body, entity: entity});
    return body;
  },
  update: function(dt) {
    this._bodies.forEach(function(item, idx){
      item.body.update(dt);
      item.entity.x = item.body.x;
      item.entity.y = item.body.y;
    });
  }
};

global.Room = function(type) {
  this.renderer = new Renderer(ROOM_WIDTH * CHAR_WIDTH, ROOM_HEIGHT * CHAR_HEIGHT, 1);
  this.type = type;
  type.stamp.stamp.stamp(this.renderer.context);
};

global.Renderer = function(width, height, alpha) {
  this._can = document.createElement('canvas');
  this._can.width = width;
  this._can.height = height;
  this.context = this._can.getContext('2d');
  this.context.globalAlpha = this.alpha = alpha || 1;
  this.whole = true;
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0, this.whole);
    toCanvas.drawImage(this._can, coords.x, coords.y);
  };
};

global.Sprite = function(x, y, renderer) {
  this.renderer = renderer;
  this.x = x;
  this.y = y;
  this.body = Physics.createBody(this, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  this.stamp = function(toCanvas) {
    this.renderer.stamp(toCanvas, this.x, this.y);
  };
};

global.Hero = function(x, y, type) {
  this.type = type;
  this.sprite = new Sprite(x, y, new Char(type.symbol, 'FF0000'));
  this.body = Physics.createBody(this.sprite, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  this.weapon = E.GetRandomWeapon(type.weapons);
  this.sprite.renderer.renderer.whole = false;
  this.body.velocity.x = H.GetRandom(type.speed.b * 100, type.speed.t * 100)/100;
  this.stamp = function(toCanvas) {
    this.sprite.stamp(toCanvas);
  };
  this.end = function() {
    console.log('hero left');
  }
}

global.Menu = function(title, width, height) {
  this.width = width;
  this.height = height;
  this.renderer = new Renderer(CHAR_WIDTH * this.width, CHAR_HEIGHT * this.height, 1);
  this.title = title;
  this.generate = function(){
    H.MakeBox(this.width, this.height, this.renderer.context);
    H.StampText(this.renderer.context, 2, 0, this.title, BOX, BOX_B);
  };
  this.generate();
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
};
