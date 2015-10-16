function Draggable(game, x, y, key, frame)
{
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.inputEnabled = true;
  this.fixedToCamera = true;
  this.anchor.setTo(0.5);
  this.events.onInputDown.add(this.onClick, this, 0);
  this.dragged = false;
}

Draggable.constructor = Draggable;
Draggable.prototype = Object.create(Phaser.Sprite.prototype);

Draggable.prototype.onClick = function onClick(draggable, pointer)
{
  this.currentPointer = pointer;
  if(this.dragged)
  {
    // Stop dragging
    console.log("Dropped", this);

    var target = { x: Math.floor((this.x + 45) / 90) * 90,
                   y: Math.floor((this.y + 45) / 90) * 90
                 };
    this.game.add.tween(this).to(target, 250).start();
  }
  else
  {
    // Start dragging
    console.log("Grabbed", this);
    this.fixedToCamera = false;
  }
  this.dragged = !this.dragged;
}

Draggable.prototype.update = function update()
{
  if(this.dragged && this.currentPointer)
  {
    // console.log(this.currentPointer.worldX, this.currentPointer.worldY);
    this.x = this.currentPointer.worldX;
    this.y = this.currentPointer.worldY;


  }
}




function Tile(game, x, y, frame)
{
  console.log('Tile ctor', arguments);
  Draggable.call(this, game, x, y, 'tiles', frame);

}

Tile.constructor = Tile;
Tile.prototype = Object.create(Draggable.prototype);

function Meatball(game, x, y)
{
  Draggable.call(this, game, x, y, 'meeple', 0);
}
Meatball.constructor = Meatball;
Meatball.prototype = Object.create(Draggable.prototype);