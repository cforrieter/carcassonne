rotate = {
  right: function(){
    switch(this.type){
      case 'B':
      case 'C':
      case 'X':
        return;
    }

    var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
    this.typeLeft = x;
    this.typeTop = y;
    this.typeRight = z;
    this.typeBottom = w;
  },

  left: function(){
    switch(this.type){
      case 'B':
      case 'C':
      case 'X':
        return;
    }

    var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
    this.typeLeft = z;
    this.typeTop = w;
    this.typeRight = x;
    this.typeBottom = y;
  }
};
