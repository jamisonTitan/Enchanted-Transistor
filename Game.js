let p, drawCircle, drawLine;
//for player movement
let up, down, left, right;
let speechBubble;
let scale = 20;
let selectedTile = { x : 0, y : 0 },
  selectedTileLast;
let cryos = 0;
let hotbar = [];
  let selectedHotbarItem = 0;
let levels = []
const menuButtons = [];
const objects = [];
  validxy = [];
    levels = [];
      text = '';
let inStatsMenu = false, levelEditMode = false,  noClip = false, inVendorMenu = false, inMainMenu = false;
let selectedVendorItem = 0, vendorInventory = [];
//vector objects
function Vec2( xx, yy ) {
  this.x = xx;
  this.y = yy;

  /* vector * scalar */
  this.mulS = function (value){ return new Vec2(this.x*value, this.y*value); }
  /* vector * vector */
  this.mulV = function(vec_) { return new Vec2(this.x * vec_.x, this.y * vec_.y); }
  /* vector / scalar */
  this.divS = function(value) { return new Vec2(this.x/value,this.y/value); }
  /* vector + scalar */
  this.addS = function(value) { return new Vec2(this.x+value,this.y+value); }
  /* vector + vector */
  this.addV = function(vec_) { return new Vec2(this.x+vec_.x,this.y+vec_.y); }
  /* vector - scalar */
  this.subS = function(value) { return new Vec2(this.x-value, this.y-value); }
  /* vector - vector */
  this.subV = function(vec_) { return new Vec2(this.x-vec_.x,this.y-vec_.y); }
  /* vector absolute */
  this.abs = function() { return new Vec2(Math.abs(this.x),Math.abs(this.y)); }
  /* dot product */
  this.dot = function(vec_) { return (this.x*vec_.x+this.y*vec_.y); }
  /* vector length */
  this.length = function() { return Math.sqrt(this.dot(this)); }
  /* vector length, squared */
  this.lengthSqr = function() { return this.dot(this); }
  /*
  vector linear interpolation
  interpolate between two vectors.
  value should be in 0.0f - 1.0f space
  */
  this.lerp = function(vec_, value) {
  return new Vec2(
  this.x+(vec_.x-this.x)*value,
  this.y+(vec_.y-this.y)*value
  );
  }
  /* normalize THIS vector */
  this.normalize = function() {
  let vlen = this.length();
  this.x = this.x/ vlen;
  this.y = this.y/ vlen;
  }
}

//   --HOTBAR FUNCTIONS--

const addElement =  ( type, text, parent ) => {xx
  //create element
  let element = document.createElement(type)
  element.className = 'newDiv'
  //create text on element
  let content = document.createTextNode(text);
  //element.class = 'hope'
  element.appendChild(content)
  //add click handler
  element.onClick = () => console.log("yayayaya")
  element.addEventListener('mouseover', () => console.log("yayayaya"))
  //add mouseOver handler
//  element.addEventListener('mouseover',mouseoverHandler);
  //append element to parent
}

//   --LEVEL LOADiNG FUNCTIONS--
const fillValidxy = () => {
  let canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = canvas.getBoundingClientRect().width,
  height = canvas.getBoundingClientRect().height;
  for (xx = 0;xx < width; xx += scale) {
    for (yy = 0; yy < height; yy += scale) {
      validxy.push( { x : (xx + scale) - scale, y : (yy + scale) - scale } );
    }
  }
}

const entity = ( x, y, id_, ctx ) => {
    let pos = new Vec2( x, y );
    let id = id_;
    let imgElement = document.getElementById(id);
    let width = imgElement.width
    let height = imgElement.height
    return {
      get id() {
        return id;
      },
      get pos() {
        return pos;
      },
      show() {
        ctx.drawImage(imgElement, pos.x, pos.y)
      },
      update(delta, velLast) {
        //hitbox for this object
        let rect2 = {x : pos.x, y: pos.y, width: scale, height: scale}
        //player hitbox
        let rect1 = {x : p.pos.x + ((p.velLast.x * delta) * 1.2) , y: p.pos.y + ((p.velLast.y * delta) * 1.2), width: 15, height: 15}
        //collision detection
        if(!noClip) {
         let colliding = (rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &
             rect1.y + rect1.height > rect2.y);
             if(colliding){
               removeObject( x, y, id );
               text = 'you got +35 cryos! succesful boi!';
               cryos += 35;
               let ctx = document.getElementById('canvas').getContext('2d');
               hotbar.push(hotbarItem('bow', ctx, hotbar.length));
             }
        }
      }
    }
  }

const tile = ( x, y, id_, ctx ) => {
  let pos = new Vec2(x, y);
  let id = id_;
  let texture =  document.getElementById('wood');
    switch(id) {
      case 'vendorWood':
        texture = document.getElementById('wood')
      break;
      case 'wood':
        texture = document.getElementById('wood')
      break;
      case 'stone':
        texture = document.getElementById('stone')
      break;
      case 'vendor':
        texture = document.getElementById('vendor')
      break;
    }
  return {
    get id() {
      return id;
    },
    get pos() {
      return pos;
    },
    update(delta, velLast) {
      //hitbox for this object
      let rect2 = {x : pos.x, y: pos.y, width: scale, height: scale}
      //player hitbox
      let rect1 = {x : p.pos.x + ((p.velLast.x * delta) * 1.2) , y: p.pos.y + ((p.velLast.y * delta) * 1.2), width: 15, height: 15}
      //collision detection
      if(!noClip) {
       let colliding = (rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y);
           if(colliding){
             switch( id ) {
             case 'vendorWood':
             //check if x is colliding
             if (rect1.x < rect2.x + rect2.width &&
                 rect1.x + rect1.width > rect2.x ) {
                   //add vel
                   p.pos = p.pos.addV(new Vec2( -p.velLast.x, 0 ));
                 }
              //check if y is colliding and handle vel accordingly
              if (rect1.y < rect2.y + rect2.height &&
              rect1.y + rect1.height > rect2.y) {
                p.pos = p.pos.addV(new Vec2( 0 ,-p.velLast.y ));
              }
              inVendorMenu = true;
             break;
             default:
              //check if x is colliding
              if (rect1.x < rect2.x + rect2.width &&
                  rect1.x + rect1.width > rect2.x ) {
                    //add vel
                    p.pos = p.pos.addV(new Vec2( -p.velLast.x, 0 ));
                  }
               //check if y is colliding and handle vel accordingly
               if (rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y) {
                 p.pos = p.pos.addV(new Vec2( 0 ,-p.velLast.y ));
               }
             break;
           }
         }
      }
    },
    show(ctx) {
      if(id !== 'empty') {
          ctx.drawImage(texture, pos.x, pos.y)
      }else {
        ctx.drawImage(texture, pos.x, pos.y)
      }
    }
  }
}

const loadChunk = ( rgbaArray ) => {
  //fetch canvas and graphics
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  //loop through pixel array
  for(let x = 0; x < 30; x++) {
    for(let y = 0; y < 20; y++) {
      if(rgbaArray[x][y] === 'rgba(0, 0, 0, 1)') {
        objects.push( tile( x * scale, y * scale, 'stone', ctx ))
      }else if(rgbaArray[x][y] === 'rgba(0, 255, 0, 1)') {
        objects.push( entity( x * scale, y * scale, 'cryos', ctx))
      }else if(rgbaArray[x][y] === 'rgba(255, 200, 0, 1)') {
        objects.push( tile( x * scale, y * scale, 'wood', ctx))
      }else if(rgbaArray[x][y] === 'rgba(255, 255, 0, 1)') {
        objects.push( tile( x * scale, y * scale, 'vendorWood', ctx))
      }else if(rgbaArray[x][y] === 'rgba(255, 0, 255, 1)') {
        objects.push( tile( x * scale, y * scale, 'vendor', ctx))
      }
    }
  }
}

const saveChunk = () => {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  //creat multidim array
  let level = new Array(canvas.width);
  for(let i = 0; i < canvas.height; i++){
    level[i] = new Array(canvas.width);
  }
  //loop through current game objects array and write it to level
  for(let x = 0; x < canvas.width; x++) {
    for(let y = 0; y < canvas.height; y++) {
      let pixel = ctx.getImageData(x, y, 1, 1).data
      let color = 'rgba(' + pixel[0] + ', ' + pixel[1] + ', '
       + pixel[2] + ', ' + (pixel[3] / 255) + ')';
         level[x][y] = color
    }
  }
  return level;
}

const getRGBA = img => {
  console.log(img.width, " ", img.height);
  //create canvas for img
  let tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  //get graphics context
  let context = tempCanvas.getContext('2d');
  //draw image on canvas
  context.drawImage(img, 0, 0);
  //create multidim array to store values
  let rgbaValues = new Array(img.width);
  for(let i = 0; i < img.width; i++){
    rgbaValues[i] = new Array(img.height);
  }
  //fill array with corresponding values
  for(let x = 0; x < img.width; x++) {
    for(let y = 0; y < img.height; y++) {
      let pixel = context.getImageData(x, y, 1, 1).data;
      let color = 'rgba(' + pixel[0] + ', ' + pixel[1] + ', '
       + pixel[2] + ', ' + (pixel[3] / 255) + ')';
       rgbaValues[x][y] = color;
    }
  }
  return rgbaValues;
}

const npc = ( xx, yy, id_, ctx ) => {
  let pos = new Vec2( x, y );
  let id = id_;
  let imgElement = document.getElementById(id);
  let width = imgElement.width
  let height = imgElement.height
  return {
    get id() {
      return id;
    },
    get pos() {
      return pos;
    },
    show() {
      ctx.drawImage(imgElement, pos.x, pos.y)
    },
    update(delta, velLast) {
      //hitbox for this object
      let rect2 = {x : pos.x, y: pos.y, width: scale, height: scale}
      //player hitbox
      let rect1 = {x : p.pos.x + ((p.velLast.x * delta) * 1.2) , y: p.pos.y + ((p.velLast.y * delta) * 1.2), width: 15, height: 15}
      //collision detection
      if(!noClip) {
       let colliding = (rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &
           rect1.y + rect1.height > rect2.y);
           if(colliding){

           }
      }
    }
  }
}


//  --LEVEL RENDERING AND UPDATING FUNCTIONS--

const drawImg = ( rgbaArray, xoff, yoff, scale, ctx ) => {
  //double for loop draw all the pixels
  for(let x = 0; x < rgbaArray[0].length; x++) {
    for(let y = 0; y < rgbaArray[0][0].length; y++) {
      ctx.fillStyle = rgbaArray[x][y];
      ctx.fillRect( (x * scale) + (xoff * scale), (y * scale) + (yoff * scale), scale, scale );
    }
  }
}

const loadImage = source => {
  return new Promise((resolve, reject) =>
  {
    let img = new Image();
    //success
    img.onload = () => {
      resolve(img);
    }
    //fail
    img.onerror = () => {
      let msg = "oh no we couldnt find image with url: " + source
      reject(new Error(msg));
    }
    img.src = source;
  });
}

const getMousePos = ( e, canvas ) => {
    let rect = canvas.getBoundingClientRect();
    return {
      x : e.clientX - rect.left,
      y : e.clientY - rect.top
    };
  }

const getClosestValidxy = ( x, y ) => {
    //get distance between all points in validxy and mouse pointes
    let currx = validxy[0].x,
     curry = validxy[0].y,
      distx = Math.abs ( x - currx  ),
        disty = Math.abs ( y - curry );
      for(let i = 0; i < validxy.length ; i++) {
        let  newDistx = Math.abs(x - validxy[i].x);
        let newDisty = Math.abs(y - validxy[i].y)
        if( newDistx < distx ) {
           distx = newDistx;
           currx = validxy[i].x;
         }
        if( newDisty < disty ) {
          disty = newDisty;
          curry = validxy[i].y;
         }
      }
      return { x : currx, y : curry };
  }

const drawBackground = ( src, ctx ) => {
      let img = document.getElementById(src);
      //draw img in tesselating grid
      for ( let x = 0; x < 600; x+= img.width ) {
         for ( let y = 0; y < 400; y+= img.height ) {
           ctx.drawImage(img, x, y);
     }
    }
  }

const menuButton = ( handler, text, xx, yy) => {
  let pos = new Vec2( xx, yy );
  let width = 75,
    height = 20;
  return {
    get pos() {
      return pos;
    },
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    get handler() {
      return handler;
    },
    show( ctx ) {
      ctx.fillStyle = '#aaAAaa';
      ctx.fillRect( pos.x, pos.y, width, height );
      ctx.fillStyle = '#000000';
      ctx.rect( pos.x, pos.y, width, height );
      ctx.stroke();
      ctx.font = "12px Arial";
      ctx.fillText( text, pos.x + 25, pos.y + 15);
    }
  }
}

const showStatsMenu = ( canvas, ctx ) => {
  ctx.fillStyle = '#616161'
  ctx.fillRect( 200, 80, 200, 240 );
  ctx.fillStyle = 'white';
  ctx.font = "12px Arial";
  let string = [ "-Stats-",
                "cryos: " + cryos,
                "strength",
                "Magic",
                "deception"];
  for( let i = 0; i < string.length; i++ ) {
    //if first one draw in center
    (i === 0) ? ctx.fillText( string[i] ,280, 120 + ( i * 20 ) ) :
    //if not draw in default position
    ctx.fillText( string[i] ,210, 120 + ( i * 20 ) );
  }
}

const showVendorMenu = (canvas, ctx) => {
  vendorInventory = [
    {id : "strength"},
    {id : "magic"},
    {id : "deception"}
  ]
  let img = document.getElementById('vendor-face')
  ctx.fillStyle = '#616161'
  ctx.fillRect( 100, 80, 400, 240 );
  ctx.drawImage( img, 110, 90 );
  ctx.fillStyle='white';
  ctx.font = "12px Arial";
  let string = [ "Hey there adventurer!, I sell weapons and shit But",
                "currently I lost my book of inventory so im",
                "afraid i cant sell you anything right now" ];
  //draw string
  for( let i = 0; i < string.length; i++ ) {
    ctx.fillText( string[i] ,210, 120 + ( i * 20 ) );
  }
  //show menu buttons
  menuButtons.forEach( btn => { btn.show(ctx); } )
  //draw vendors sellable items
  for( let i = 0; i < vendorInventory.length; i++ ) {
    let item = vendorInventory[i]
    let x = 230 + (i * 40);
    if(i === selectedVendorItem) {
      ctx.fillStyle = "#000000"
      ctx.fillRect( x - 1, 199, 32, 32);
    }
    switch( item.id ) {
      case "strength":
        ctx.fillStyle = "#FF5555"
      break;
      case "magic":
        ctx.fillStyle = "#55FF55"
      break;
      case  "deception":
        ctx.fillStyle = "#5555FF"
      break;
    }
    ctx.fillRect( x , 200, 30, 30);
  }
}

const updateVendorMenu = () => {
  //add menu buttons
  if ( menuButtons.length < 1 ) {
    let scale = 20;
    let startx = 250;
    let starty = 280;
    let text = ''
    let func;
    //exit button
    text = "exit"
    func = () => {
      //clear menuButtons array
      menuButtons.splice( 0, menuButtons.length );
      inVendorMenu = false;
     }
    menuButtons.push( menuButton(func, text, startx, starty) );
    //buy button
    text = "buy"
    func = () => {
      //buy whatever item is currently selected
    }
    menuButtons.push( menuButton(func, text, startx, starty - scale) );
  }

}

const showHotbar = (ctx) => {
  hotbar.forEach(obj => {obj.show();})
  //ctx.fillStyle = 'rgba(0, 200, 0, 0.5)'
  //ctx.fillRect(selectedTile.x, selectedTile.y, scale, scale);
}

const updateHotbar = () => {
  hotbar.forEach(obj => {obj.update();})
}
//   --PLAYER RELATED FUNCTIONS--

const player = ( x, y ) => {
  let pos = new Vec2(x, y);
  let vel = new Vec2(0, 0);
  let velLast = new Vec2(0,0);
  let speed = 200;
  return{
    get velLast(){
      return velLast;
    },
    get pos() {
      return pos;
    },
    set pos(temp) {
      pos = temp;
    },
    get inv() {
      return inv;
    },
    get up() {
      return up;
    },
    get down() {
      return down;
    },
    get left() {
      return left;
    },
    get right() {
      return right;
    },
    update(delta) {
      //update velocity accoring to player direction
        if(up){vel.y = -speed;}
        if(down){vel.y = speed}
        if(left){vel.x = -speed}
        if(right){vel.x = speed}
        //add velocity to position and reset velocity for next update
        vel = vel.mulS(delta);
        pos = pos.addV(vel);
        velLast = vel;
        vel = vel.mulS(0);

    },
    show(ctx) {
      ctx.fillStyle = "pink";
      ctx.fillRect(pos.x, pos.y, 15,15);
    }
  }
}

const hotbarItem = ( identification, ctx, number ) => {
  let pos = new Vec2(0,0);
  let cw =  document.getElementById('canvas').width;
  let ch = document.getElementById('canvas').height;
  pos.y = ch * 0.85;
  pos.x = (cw / 15) + hotbar.length * 30;
  let id = identification;
  let texture;
  let num = number;
  switch(id){
    case 'bow':
      texture = document.getElementById('bow');
    break;
  }
  return {
    get id() {
      return id;
    },
    get pos() {
      return pos;
    },
    show() {
      if(selectedHotbarItem === num) {
        ctx.fillStyle = 'white';
        ctx.fillRect(pos.x - 2, pos.y - 2, 24, 24);
      }else {
        ctx.fillStyle = 'black';
        ctx.fillRect(pos.x - 2, pos.y - 2, 24, 24);
      }
      ctx.drawImage(texture, pos.x, pos.y);
    },
    update() {
      //TODO
    }
  }
}

const removeObject = ( x, y, id ) => {
  //just get x y and id from obj
  let objectPositions = objects.map( obj => obj = { xx : obj.pos.x, yy : obj.pos.y, id : obj.id } )
  //loop through objects
  for(let i = 0; i < objectPositions.length; i++) {
    //check if obj is desired obj
    if( objectPositions[i].xx === x &&
      objectPositions[i].yy === y &&
      objectPositions[i].id === id  ) {
        //remove obj
        objects.splice( i, 1 );
      }
  }
}

$(document).ready( function() {
  //    --MAIN LOOP--
  fillValidxy();
  //returns current time in milliseconds
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let MAXFPS = 1/60,
      delta = 0,
      now,
      timeSinceLastFrame = timestamp();

  //render errything!
  const show = (delta, ctx) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,600,400);
    //draw background
    drawBackground('stone-bkg', ctx);

    if( !levelEditMode ) {
      p.show(ctx);
    }
    objects.forEach(tile => {
      tile.show(ctx);
    });
    showHotbar(ctx);
    if(inVendorMenu) {showVendorMenu( document.getElementById('canvas'), ctx )}
    if(inStatsMenu) {showStatsMenu(document.getElementById('canvas'), ctx )}
  }
  //update errything!
  const tick = ( delta ) => {
      if (!levelEditMode && !inVendorMenu && !inMainMenu) {p.update(delta);}
      objects.forEach(tile => {tile.update(delta, p.velLast)});
      updateHotbar();
      updateVendorMenu();
      //load next level if player exits current level
      if( p.pos.x < 0 || p.pos.x > 600 || p.pos.y < 0 || p.pos.y > 400 ) {
        p.pos.x = 300;
        p.pos.y = 200;
        //unload all current things onscreen
        objects.splice( 0, objects.length);
        //load next level
        loadChunk(levels[1]);
      }
  }

  const gameLoop = () => {
    //throttle frame rate
    now = timestamp();
    //limit delta to +1 per tick
    delta = delta + Math.min(1, (now - timeSinceLastFrame) / 1000) //duration in seconds
    //tick at MAXFPS if possible
    while(delta > MAXFPS) {
      delta = delta - MAXFPS;
      tick(MAXFPS);
    }
    //draw everything
    show(delta, ctx);
    timeSinceLastFrame = now;
    //start next frame
    requestAnimationFrame(gameLoop);
  }

    //--MOUSE HANDLERS--

  document.addEventListener('click', event => {
    let mousePosition = getMousePos(event, canvas);
    let mx = mousePosition.x;
    let my = mousePosition.y;
    //loop  through menu buttons
    menuButtons.forEach( btn => {
      //find if btn bounding rectangle has mouse x and y in it
      if( mx < ( btn.pos.x + btn.width ) && mx > btn.pos.x
          && my < ( btn.pos.y + btn.height) && my > btn.pos.y) {
            //call the buttons handler function
            btn.handler();
          }
    });
  })

  let flag = 0;
  window.addEventListener("mousedown", () => {
     flag = 1;

   });
  window.addEventListener("mousemove", event => {
    if(levelEditMode){
      if( flag === 1 ) {
        let mousePos = getMousePos(event, canvas);
        //add selected object at mouse position
        let tilePos = getClosestValidxy(mousePos.x, mousePos.y);
        let tempTile = tile(tilePos.x , tilePos.y, 'wall',  ctx);
        objects.push(tempTile);
      }
    }
  });
  window.addEventListener("mouseup", event => {
      flag = 0;
      if(levelEditMode){
        let mousePos = getMousePos(event, canvas);
        //add selected object at mouse position
        let tilePos = getClosestValidxy(mousePos.x, mousePos.y);
        let tempTile = tile(tilePos.x , tilePos.y, 'wall',  ctx);
        objects.push(tempTile);
      }
  });

   window.addEventListener('mousemove', event => {
     if(levelEditMode){
        let mousePos = getMousePos(event, canvas);
        //find selected tile and draw a bx around it
        let tilePos = getClosestValidxy(mousePos.x, mousePos.y);
        selectedTile = tilePos;
      }
    });
    //--KEY HANDLERS--
  window.addEventListener("keydown", (event) => {
    for(let i = 0; i < hotbar.length; i++){
      if(event.key  === (i + 1).toString()) {
        selectedHotbarItem = i;
      }
    }
    if(inVendorMenu) {
      for(let i = 0; i < vendorInventory.length; i++){
        if(event.key  === (i + 1).toString()) {
          console.log(selectedVendorItem);
          selectedVendorItem = i;
        }
      }
    }
    switch(event.key){
      case "w":
        up = true;
      break;
      case "s":
        down = true;
      break;
      case "a":
        left = true;
      break;
      case "d":
        right = true;
      break;
      case "Escape":
          inVendorMenu = false;
      break;
      case "i":
        (inStatsMenu) ? inStatsMenu = false : inStatsMenu = true;
      break;
    }
  });
  window.addEventListener("keyup", ( event ) => {
      switch(event.key){
        case "w":
          up = false;
        break;
        case "s":
          down = false;
        break;
        case "a":
          left = false;
        break;
        case "d":
          right = false;
        break;
        case "Escape":
            inVendorMenu = false;
        break;
      }
  });
  //Drawing functions
  drawLine = ( strtx, strty, endx, endy, color ) => {
    ctx.fillStyle = color;
    ctx.moveTo(strtx, strty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
  }

  drawCircle = ( x, y, color, size ) => {
    ctx.moveTo(x,y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.stroke;
  }

  //    --IMAGES--
  loadImage('level01.png')
  .then(img => {
    levels.push(getRGBA(img));
    loadChunk( levels[0] );
  })
  .catch(error => console.log(error));

  loadImage('level02.png')
  .then(img => {
    levels.push(getRGBA(img));
  })
  .catch(error => console.log(error));


  //start game
  p = player(300,200);
  requestAnimationFrame(gameLoop);
});
