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




function Tile(game, x, y, frame)
{
  console.log('Tile ctor', arguments);
  Draggable.call(this, game, x, y, 'tiles', frame);

}

Tile.constructor = Tile;
Tile.prototype = Object.create(Draggable.prototype);

Tile.prototype.onClick = function onClick(draggable, pointer)
{
  this.currentPointer = pointer;
  if(this.dragged)
  {
    // Stop dragging

    var target = { x: Math.floor((this.x + 45) / 90) * 90,
                   y: Math.floor((this.y + 45) / 90) * 90
                   };
    this.game.add.tween(this).to(target, 250).start();

    confirmDrop(target, function(confirmed){
      if (confirmed) {
        console.log("Dropped", tile);
        tile.inputEnabled = false;
      } 
    }, this);


  }
  else
  {
    // Start dragging
    console.log("Grabbed", this);
    this.fixedToCamera = false;
  }
  this.dragged = !this.dragged;

  function confirmDrop(target, callback) {

    var confirm = tile.game.add.button(target.x + 45, target.y - 45, 'tiles', confirm, this, 23, 23, 23);
    var decline = tile.game.add.button(target.x - 135, target.y - 45, 'tiles', decline, this, 22, 22, 22);

    function confirm() {
      confirm.destroy();
      decline.destroy();
      callback(true);
    }

    function decline() {
      confirm.destroy();
      decline.destroy();
      callback(false);
    }
  }
}

Tile.prototype.update = function update()
{
  if(this.dragged && this.currentPointer)
  {
    // console.log(this.currentPointer.worldX, this.currentPointer.worldY);
    this.x = this.currentPointer.worldX;
    this.y = this.currentPointer.worldY;


  }
}
