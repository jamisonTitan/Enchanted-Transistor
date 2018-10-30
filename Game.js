//player
let p;
let cryos = 0, strength = 0, deception = 0, magic = 0, luck = Math.floor(Math.random() * 3);
//for player movement
let up, down, left, right;
let scale = 20;
let selectedTile = { x : 0, y : 0 },
  selectedTileLast;
let hotbar = [];
  let selectedHotbarItem = 0;
    let lastButtonsPressed = '';
const menuButtons = [];
const objects = [],
  possibleTilePositions = [],
    levels = [],
      levelsVisited = [];
let currentLevel = 0;
let inFrogMenu = false, frogInteractionCounter = 0;
let npcText = [];
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

//   --LEVEL LOADiNG FUNCTIONS--
const fillPossibleTileSpots = () => {
  let canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = canvas.getBoundingClientRect().width,
  height = canvas.getBoundingClientRect().height;
  for (xx = 0;xx < width; xx += scale) {
    for (yy = 0; yy < height; yy += scale) {
      possibleTilePositions.push( { x : (xx + scale) - scale, y : (yy + scale) - scale } );
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
               cryos += 15;
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
        ctx.drawImage(texture, pos.x, pos.y)
    }
  }
}

const loadLevel = ( rgbaArray ) => {
  //fetch canvas and graphics
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  //loop through pixel array
  for(let x = 0; x < 30; x++) {
    for(let y = 0; y < 20; y++) {
      switch(rgbaArray[x][y]){
      case 'rgba(0, 0, 0, 1)':
        objects.push( tile( x * scale, y * scale, 'stone', ctx ) );
      break;
      case 'rgba(0, 255, 0, 1)':
        objects.push( entity( x * scale, y * scale, 'cryos', ctx) );
      break;
      case 'rgba(255, 200, 0, 1)':
        objects.push( tile( x * scale, y * scale, 'wood', ctx) );
      break;
      case 'rgba(255, 255, 0, 1)':
        objects.push( tile( x * scale, y * scale, 'vendorWood', ctx) );
      break;
      case 'rgba(255, 0, 255, 1)':
        objects.push( tile( x * scale, y * scale, 'vendor', ctx) );
      break;
      case 'rgba(100, 200, 100, 1)':
          objects.push( frog( x * scale, y * scale, 'frog', ctx) );
      break;
      }
    }
  }
}

const getRGBA = img => {
  let tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  let context = tempCanvas.getContext('2d');
  context.drawImage(img, 0, 0);
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

//  --LEVEL RENDERING AND UPDATING FUNCTIONS--

const drawImg = ( rgbaArray, xoff, yoff, scale, ctx ) => {
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

const getClosestPossibleTilePosition = ( x, y ) => {
    //get distance between all points in possibleTilePositions and mouse pointes
    let currx = possibleTilePositions[0].x,
     curry = possibleTilePositions[0].y,
      distx = Math.abs ( x - currx  ),
        disty = Math.abs ( y - curry );
      for(let i = 0; i < possibleTilePositions.length ; i++) {
        let  newDistx = Math.abs(x - possibleTilePositions[i].x);
        let newDisty = Math.abs(y - possibleTilePositions[i].y)
        if( newDistx < distx ) {
           distx = newDistx;
           currx = possibleTilePositions[i].x;
         }
        if( newDisty < disty ) {
          disty = newDisty;
          curry = possibleTilePositions[i].y;
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
    set handler(temp) {
      handler = temp;
    },
    show( ctx ) {
      ctx.fillStyle = '#aaAAaa';
      ctx.fillRect( pos.x, pos.y, width, height );
      ctx.fillStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect( pos.x, pos.y, width, height );
      ctx.font = "12px Roboto Condensed";
      ctx.fillText( text, pos.x + 25, pos.y + 15);
    }
  }
}

const showStatsMenu = ( canvas, ctx ) => {
  ctx.fillStyle = '#70645a '
  ctx.fillRect( 200, 80, 200, 240 );
  ctx.fillStyle = 'white';
  let string = ["-Stats-",
                "cryos: " + cryos,
                "strength: " + strength,
                "Magic: " + magic,
                "deception: " + deception,
                "Luck: " + luck
              ];
  for( let i = 0; i < string.length; i++ ) {
    //if first one draw in center
    if(i === 0) {
      ctx.font = "20px Roboto Condensed";
      ctx.fillText( string[i] ,270, 120 + ( i * 20 ) )
    }else {
      //draw in default position
      ctx.font = "12px Roboto Condensed";
      ctx.fillText( string[i] ,210, 120 + ( i * 20 ) );
    }
  }
}


const frog = ( x, y, id_, ctx ) => {
  let pos = new Vec2( x, y );
  let id = id_;
  let imgElement = document.getElementById("frog-small");
  let width = imgElement.width
    ,height = imgElement.height;
  let wantsToInteract = true;
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
               wantsToInteract = false;
               frogInteractionCounter = 0;
               lastButtonsPressed = ''
               inFrogMenu = true;
             }
      }
    }
  }
}

const showFrogMenu = ( canvas, ctx ) => {
  let img = document.getElementById('frog-large');
  ctx.fillStyle = '#70645a ';
  ctx.fillRect( 100, 80, 400, 240 );
  ctx.fillStyle = "black";
  ctx.fillRect(110, 90, 90, 90);
  ctx.fillStyle = "white";
  ctx.drawImage(img, 100, 100);
  for(let btn of menuButtons){ btn.show(ctx); };
    for( let i = 0; i < npcText.length; i++ ) {
      ctx.fillText( npcText[i] ,210, 120 + ( i * 15 ) );
    }
}

let yscale = 35, xscale = 80;
let startx = 200;
let starty = 240;
let text = '';
let func
const updateFrogMenu = () => {
  switch( frogInteractionCounter ) {
    case 0:
      if( menuButtons < 1 ) {
          npcText = ["hi  im a frog nice to meet you friendo",
            "I like flies and shit",
            'say, what you doin down here?',
            "-A. (Lie "+deception+"/deception + luck)Im here to meet frogs",
            "-B. I dont know, i pretty much just woke up here",
            "-C. (magic "+magic+"/ magic)I'm practicing spells, want to see?",
            "-D. to do"
          ]
          text = "- A -"
          func = () => {
                frogInteractionCounter += 1;
                lastButtonsPressed += 'A';
                menuButtons.splice(0, menuButtons.length);

            }
          menuButtons.push( menuButton(func, text, startx, starty) );
          text = "- C -"
          func = () => {
                frogInteractionCounter += 1;
                lastButtonsPressed += 'C';
                menuButtons.splice(0, menuButtons.length);
                c = false;
           }
          menuButtons.push( menuButton(func, text, startx, starty + yscale));
          text = "- B -"
          func = () => {
              frogInteractionCounter += 1;
              lastButtonsPressed += 'B';
              menuButtons.splice(0, menuButtons.length);
              b = false;
           }
          menuButtons.push( menuButton(func, text, startx + xscale, starty) );
          text = "- D -"
          func = () => {
              frogInteractionCounter += 1;
              lastButtonsPressed += 'D';
              menuButtons.splice(0, menuButtons.length);
              d = false;
           }
          menuButtons.push( menuButton(func, text, startx + xscale, starty + yscale) );
        }
        break;
        case 1:
          switch(lastButtonsPressed) {
            case 'A':
              if(menuButtons.length < 1){
                npcText = ["oh well thats quite prime tidy",
                  "My name is ezreal orange the third and I",
                  'will let it be known around the frogs of ',
                  "this cave that you are a friend",
                  "A. Thank you, that's very nice of you",
                  "B. I am awesome so spread the word far",
                  "   my tiny friend"
                ];
                text = "- A -"
                func = () => {
                    frogInteractionCounter += 1;
                    lastButtonsPressed += 'A';
                    menuButtons.splice(0, menuButtons.length);
                  }
              menuButtons.push( menuButton(func, text, startx, starty));
                text = "- B -"
                func = () => {
                  frogInteractionCounter += 1;
                  lastButtonsPressed += 'B';
                  menuButtons.splice(0, menuButtons.length);
                 }
                menuButtons.push( menuButton(func, text, startx + xscale, starty) );
            }
            break;
            case 'B':
            if(menuButtons.length < 1){
              let tempText;
              (cryos > 0) ? tempText = "lie" : tempText = "truth";
              npcText = ["Oh thats not prime tidy at all",
                "quite sorry about this friend but because",
                'of your precarious situation Im gonna ask',
                "you to kindly donate all your cryos to me",
                "A. ("+tempText+") I don't have any cryos on me",
                "B. (Strength + luck("+strength+")/ 3) Fight me froggo!"]
                text = "- A -"
                func = () => {
                    frogInteractionCounter += 1;
                    lastButtonsPressed += 'A'
                    menuButtons.splice(0, menuButtons.length);
                  }
              menuButtons.push( menuButton(func, text, startx, starty));
                text = "- B -"
                func = () => {
                  frogInteractionCounter += 1;
                  lastButtonsPressed += 'B';
                  menuButtons.splice(0, menuButtons.length);
                 }
                menuButtons.push( menuButton(func, text, startx + xscale, starty) );
              }
            break;
            case 'C':
              if(menuButtons.length < 1){
                npcText = ["you pressed {C] blah blah",
                  "blah",
                  'afsaahbjflhnagdlsnsanagdiusbosa',
                  "agdihdaohgohoiehnwnwaifo",
                  "godshnaionshaoingadoinodi"];
                }
            break;
            case 'D':
              if(menuButtons.length < 1) {
              npcText = ["you pressed {D] blah blah",
                "blah",
                'afsaahbjflhnagdlsnsanagdiusbosa',
                "agdihdaohgohoiehnwnwaifo",
                "godshnaionshaoingadoinodi"];
              }
            break;
          }
          break;
          case 2:
            switch(lastButtonsPressed) {
              case 'AA':
              if(menuButtons.length < 1) {
                npcText = ["You are quite welcome,",
                  "goodbye now",
                  "",
                  "",
                  "-A. goodbye"
                  ]
                    text = "- A -"
                    func = () => {
                        frogInteractionCounter = 0;
                        inFrogMenu = false;
                        menuButtons.splice(0, menuButtons.length);
                        }
                    menuButtons.push( menuButton(func, text, startx, starty) );
                  }
              break;
              case 'AB':
                if(menuButtons.length < 1) {
                  npcText = ["Well I guess I'll also have to tell",
                    "them about your apparent arrogance.",
                    '',
                    "",
                    "A.....okay"];
                    text = "- A -"
                    func = () => {
                        frogInteractionCounter = 0;
                        inFrogMenu = false;
                        menuButtons.splice(0, menuButtons.length);
                        }
                    menuButtons.push( menuButton(func, text, startx, starty) );
                  }
              break;
              case 'BA':
                if(menuButtons.length < 1) {
                  if(cryos > 1) {
                    npcText = ["Don't try to play those games with me.",
                      "you dissapoint me human .",
                      "",
                      '(you stand helplessly as the frog takes your cryos)',
                      "A.....okay"];
                      text = "- A -"
                      func = () => {
                            cryos = 1;
                            frogInteractionCounter += 1;
                            inFrogMenu = false;
                            menuButtons.splice(0, menuButtons.length);
                          }
                      menuButtons.push( menuButton(func, text, startx, starty) );

                }else {
                      npcText = ["Oh it seems you actually don't have any.",
                        "you dissapoint me human .",
                        "",
                        '(The frog hops away menacingly)',
                        "A.....okay"];
                        text = "- A -"
                        func = () => {
                              menuButtons.splice(0, menuButtons.length);
                              frogInteractionCounter = 0;
                              inFrogMenu = false;
                            }
                    menuButtons.push( menuButton(func, text, startx, starty) );
                  }
                }
              break;
              case 'BB':
                if(menuButtons.length < 1) {
                let chance = Math.random() * (strength + luck);
                  if(chance > 3){
                  npcText = ["Oh it seems you actually don't have any.",
                    "you dissapoint me human .",
                    "",
                    '(The frog hops away in annoyance)',
                    "A.....okay"];
                    text = "- A -"
                    func = () => {
                          menuButtons.splice(0, menuButtons.length);
                          frogInteractionCounter = 0;
                          inFrogMenu = false;
                        }
                      menuButtons.push( menuButton(func, text, startx, starty) );
                } else {
                    npcText = ["Don't try to play those games with me.",
                      "you dissapoint me human .",
                      "",
                      '(you stand helplessly as the frog takes your cryos)',
                      "A.....okay"];
                      text = "- A -"
                      func = () => {
                            cryos = 1;
                            frogInteractionCounter += 1;
                            inFrogMenu = false;
                            menuButtons.splice(0, menuButtons.length);
                          }
                      menuButtons.push( menuButton(func, text, startx, starty) );
                    }
                }
              break;
        }
        case 3:
          switch(lastButtonsPressed) {

          }
        break;
  }
}


const logAllObjects = () => {
  let id;
  for(let obj of objects){
    id = obj.id;
    switch( id ) {
    case "vendor":
      console.log('%c' + oid, 'color: purple; font-weight: bold');
    break;
    case "frog":
      console.log('%c' + id, 'color: #aaFFaa; font-weight: bold');
    break;
    case "stone":
      console.log('%c' + id, 'color: #616161;');
    break;
    case "wood":
      co
    default:
      console.log(id);
    break;
    }
   }
}

const showVendorMenu = (canvas, ctx) => {
  let img = document.getElementById('vendor-face')
  ctx.fillStyle = '#70645a';
  ctx.fillRect( 100, 80, 400, 240 );
  ctx.drawImage( img, 110, 90 );
  ctx.fillStyle='white';
  ctx.font = "12px Roboto Condensed";
  ctx.fillText("your cryos: " + cryos, 110, 315)
  for( let i = 0; i < npcText.length; i++ ) {
    ctx.fillText( npcText[i] ,210, 120 + ( i * 20 ) );
  }
  for(let btn of menuButtons){ btn.show(ctx); }
  //draw vendors sellable items
  for( let i = 0; i < vendorInventory.length; i++ ) {
    let item = vendorInventory[i]
    let itemImg;
    let x = 230 + (i * 40);
    if(i === selectedVendorItem) {
      ctx.fillStyle = "#000000"
      ctx.fillRect( x - 2, 198, 34, 34);
    }
    switch( item.id ) {
      case "strength":
        ctx.fillStyle = "#FF5555";
        itemImg = document.getElementById("shield");
      break;
      case "magic":
        ctx.fillStyle = "#55FF55";
        itemImg = document.getElementById("potion")
      break;
      case  "deception":
      itemImg = document.getElementById("cloak")
        ctx.fillStyle = "#5555FF"
      break;
    }
    ctx.fillRect( x , 200, 30, 30);
    ctx.drawImage(itemImg, x, 200);
  }
  let desc = [];
  //draw description of selected items
  switch(selectedVendorItem) {
    case 0:
      desc = ["Shield emblem", "gives +3 Strength", "cost: 30cryos"]
    break;
    case 1:
      desc = ["Potion emblem", "gives +3 magic", "cost: 30cryos"]
    break;
    case 2:
      desc = ["cloak emblem", "gives +3 deception", "cost: 30cryos"]
    break;
  }
  ctx.fillStyle = "#eeddee"
  for (let i = 0; i < desc.length; i++) {
    ctx.fillText( desc[i], 350, 220 + ( i * 20 ) )
  }
}

const updateVendorMenu = () => {
  //add menu buttonso
  if ( menuButtons.length < 1 ) {
      npcText = [ "I used to be an adventurer like you. But then",
                    "i got old and crippled. I still sell things to ",
                    "idiots like you though so why dont you buy summin",
                    "    [press number keys to cycle through items]"
                  ];
      vendorInventory = [
        {id : "strength"},
        {id : "magic"},
        {id : "deception"}
      ]
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
      if( cryos >= 30 ) {
        vendorInventory.splice(selectedVendorItem, 1);
        cryos -= 30;
        npcText = ["Thanks for the purchase foolish child,",
                      "         don't come back!",
                      "press [i] to open the stats menu"];
        switch( selectedVendorItem ) {
          case 0:
            strength += 3;
          break;
          case 1:
            magic += 3;
          break;
          case 2:
            deception += 3;
          break;
        }
      }else{
            npcText = ["You don't have enough cryos foolish child,",
                          "Find some of those greeen crystally shit",
                          "on the ground and come back!"];
      }
    }
    menuButtons.push( menuButton(func, text, startx, starty - scale) );
  }

}
//TODO fix this wtf makes no sense how sleep deprived were you
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

const message = ( text, func, ctx) => {

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
  let objectPositions =
    objects.map( obj => obj = { xx : obj.pos.x, yy : obj.pos.y, id : obj.id } )
  //loop through objects
  for(let i = 0; i < objectPositions.length; i++) {
    //check if obj is desired obj
    if( objectPositions[i].xx === x &&
      objectPositions[i].yy === y &&
      objectPositions[i].id === id  ) {
        objects.splice( i, 1 );
      }
  }
}

$(document).ready( function() {
  fillPossibleTileSpots();
  //    --MAIN LOOP--
  //returns current time in milliseconds
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  //render errything!
  const show = (delta, ctx) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,600,400);
    //draw background
    drawBackground('stone-bkg', ctx);

    if( !levelEditMode ) {p.show(ctx);}

    for (let tile of objects){tile.show(ctx);}
    showHotbar(ctx);
    if( inVendorMenu )  showVendorMenu( canvas, ctx );
    if( inStatsMenu )  showStatsMenu( canvas, ctx );
    if( inFrogMenu )  showFrogMenu( canvas, ctx );
  }
  //update errything!
  let MAXFPS = 0.02, /* 0.02 = 1/60 */
      delta = 0,
      now,
      timeSinceLastFrame = timestamp();
  const tick = ( delta ) => {
      if (!levelEditMode && !inVendorMenu && !inMainMenu) {p.update(delta);}
      for( let tile of objects ){tile.update(delta, p.velLast)}
      updateHotbar();
      if( inVendorMenu ) updateVendorMenu();
      if( inFrogMenu ) updateFrogMenu();
      //load next level if player exits current level
      if( p.pos.x < 0 || p.pos.x > 600 || p.pos.y < 0 || p.pos.y > 400 ) {
        p.pos.x = 300;
        p.pos.y = 200;
        //delete all current things onscreen
        objects.splice( 0, objects.length);
        //load next level
        currentLevel += 1;
        loadLevel(levels[currentLevel]);
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
    for(let btn of menuButtons){
      //find if btn bounding rectangle has mouse x and y in it
      if( mx < ( btn.pos.x + btn.width + 15 ) && mx > btn.pos.x
          && my < ( btn.pos.y + btn.height) && my > btn.pos.y) {
            //call the buttons handler function
            btn.handler();
          }
    }
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
        let tilePos = getClosestPossibleTilePosition(mousePos.x, mousePos.y);
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
        let tilePos = getClosestPossibleTilePosition(mousePos.x, mousePos.y);
        let tempTile = tile(tilePos.x , tilePos.y, 'wall',  ctx);
        objects.push(tempTile);
      }
  });

   window.addEventListener('mousemove', event => {
     if(levelEditMode){
        let mousePos = getMousePos(event, canvas);
        //find selected tile and draw a bx around it
        let tilePos = getClosestPossibleTilePosition(mousePos.x, mousePos.y);
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
            inFrogMenu = false;
        break;
      }
  });

  //    --IMAGES--
  loadImage('level01.png')
  .then(img => {
    levels.push(getRGBA(img));
    levelsVisited.push(levels[0]);
    loadLevel( levels[0] );
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
