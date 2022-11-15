//fabric.maxCacheSideLimit = 11000;
var webglBackend = new fabric.WebglFilterBackend();
fabric.filterBackend = webglBackend;
var canvas = new fabric.Canvas('canvas', {
  backgroundColor: '#fff',
  selection: false,
  stroke: 'green',
  strokeWidth: 50,
  preserveObjectStacking: true,
  enableRetinaScaling: true,
  imageSmoothingEnabled: false
});

let undoButton = document.getElementById('undo');
let redoButton = document.getElementById('redo');
save();
var state;
var undo = [];
var redo = [];
function save(){
  redo = [];
  redoButton.disabled = true;
  if(state){
    undo.push(state);
    undoButton.disabled = false;
  }
  state = JSON.stringify(canvas);
}
function replay(playStack,saveStack, buttonsOn, buttonsOff){
  saveStack.push(state);
  state = playStack.pop();
  var on = buttonsOn;
  var off = buttonsOff;
  on.disabled = true;
  off.disabled = true;
  canvas.clear()
  canvas.loadFromJSON(state, function(){
    let objects = canvas.getObjects();
    for(let i = 0; i < objects.length; i++){
    if(objects[i].type === 'image' ) {
      let imagePathArray = objects[i].src.split('/');
      if (imagePathArray[imagePathArray.length - 2] === 'buildings') {
        objects[i].setControlsVisibility({
          mb: false,
          ml: false,
          mr: false,
          mt: false,
        });
        objects[i].alt = 'building';
      }
    }
      else if(objects[i].type = 'path' && objects[i].strokeLineCap === 'butt'){

        objects[i].selectable = false;
        objects[i].hoverCursor = 'default';
        objects[i].hasControls = false;
        objects[i].lockMovementX = true;
        objects[i].lockMovementY = true;
        objects[i].id = 'generatedLine';
      }
    }
    canvas.renderAll();
    on.disabled = false;
    if(playStack.length){
      off.disabled = false;
    }
  });
}



let mousePressed = false;
let currentMode;
// let viewTransFormPre = canvas.viewportTransform;

const modes = {
  draw: 'draw',
}

const openNav = () => {
  document.getElementById("leftSidebar").style.width = "250px"
  document.getElementById("parent").style.marginRight = "250px"
}
const closeNav = () => {
  document.getElementById("leftSidebar").style.width = "0";
  document.getElementById("parent").style.marginRight= "0";
}

const selectedObject = {
  house : 'house',
  nature : 'nature',
  barriers : 'barriers',
  cityObject : 'cityObject',
  otherBuilding : 'otherBuilding',
  other: 'other'
}


var context = document.getElementById('canvas').getContext('2d');

// Zwischen den verschiedenen Kategorien wechseln

const changeSelectableCategory = (object) => {
  if(object === selectedObject.house){
    generateImage(selectedObject.house);
    closeNav();

  } else if(object === selectedObject.nature){
    generateImage(selectedObject.nature);
    closeNav();


  } else if(object === selectedObject.barriers){
    generateImage(selectedObject.barriers);
    closeNav();


  } else if(object === selectedObject.cityObject){
    generateImage(selectedObject.cityObject);
    closeNav();

  } else if(object === selectedObject.otherBuilding){
    generateImage(selectedObject.otherBuilding);
    closeNav();

  } else if(object === selectedObject.other){
    generateImage(selectedObject.other);
    closeNav();

  }
}

// Pen mode wechseln

//Brushs
var grassBrushImg = new Image();
grassBrushImg.objectCaching = false;
grassBrushImg.src = '/assets/tiles/grass02.png';
grassBrushImg.alt = 'grassBrush';
var grassPatternBrush = new fabric.PatternBrush(canvas);
grassPatternBrush.source = grassBrushImg;

var pathBrushImg = new Image();
pathBrushImg.alt = 'pathBrush';
pathBrushImg.objectCaching = false;
pathBrushImg.src = '/assets/tiles/dirt02.png';
// pathBrushImg.objectCaching = false;
var pathPatternBrush = new fabric.PatternBrush(canvas);
pathPatternBrush.source = pathBrushImg;

var waterBrushImg = new Image();
waterBrushImg.objectCaching = false;
waterBrushImg.alt = 'waterBrush';
waterBrushImg.src = '/assets/tiles/waterTile.png';
var waterPatternBrush = new fabric.PatternBrush(canvas);
waterPatternBrush.source = waterBrushImg;


var penSlider = document.getElementById("penSlider");

penSlider.onchange = function() {
  canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
}

let currentBrush;
const togglePen = (mode, activeBrush) => {
  if(mode === modes.draw){
    if(currentBrush !== activeBrush){

      if(activeBrush === 'grass') {

        currentBrush = 'grass';
        canvas.freeDrawingBrush = grassPatternBrush;
        canvas.freeDrawingBrush.width = parseInt(penSlider.value, 10) || 1;
        canvas.isDrawingMode = true;
      } else if(activeBrush === 'path') {

          currentBrush = 'path';
          canvas.freeDrawingBrush = pathPatternBrush;
          canvas.freeDrawingBrush.width = parseInt(penSlider.value, 10) || 1;
          canvas.isDrawingMode = true;
      } else if(activeBrush === 'water'){
        currentBrush = 'water';
        canvas.freeDrawingBrush = waterPatternBrush;
        canvas.freeDrawingBrush.width = parseInt(penSlider.value, 10) || 1;
        canvas.isDrawingMode = true;
      }
    } else{
      currentBrush = undefined;
      canvas.isDrawingMode = false;
    }
  }


}
const fillCanvas = (backgroundColor) => {
  if(backgroundColor === 'path') {
    canvas.setBackgroundColor({source: pathBrushImg.src, repeat: 'repeat'}, canvas.renderAll.bind(canvas)
    );
    } else if(backgroundColor === 'grass') {
    canvas.setBackgroundColor({source: grassBrushImg.src, repeat: 'repeat'}, canvas.renderAll.bind(canvas));
  }
}
// Bilder Droppen können

function allowDrop(e) {
  e.preventDefault();
}
// called on ondragstart
function dragElement(e) {
  e.dataTransfer.setData("id", e.target.id); //transfer the "data" i.e. id of the target dragged.
}


let placeCircle = () => {
  let circle = new fabric.Circle({
    radius: 10,
    fill: '#C2B280',
    left: canvas.width/2,
    top: canvas.height/2,
    selectable: true,
    hasControls: false,
    lockMovementX: false,
    lockMovementY: false,
    id: 'numberedCircle',
    snapped: false,
  });
  canvas.add(circle);
  canvas.renderAll();
}

let createNewCircle = (elem) => {
  let newLeft;
  let newTop;
  let elemName = elem.getSrc().split('/')[5];
  if(elemName === 'house1.png'){
    newLeft = elem.left +60;
    newTop = elem.top +40;
  } else if(elemName === 'house2.png'){
    newLeft = elem.left +60;
    newTop = elem.top +40;
  } else if(elemName === 'house3.png'){
    newLeft = elem.left +26;
    newTop = elem.top +75;
  } else if(elemName === 'shop1.png'){
    newLeft = elem.left +100;
    newTop = elem.top +100;
  }
  let circle = new fabric.Circle({
    radius: 10,
    fill: '#ff0000',
    left: newLeft,
    top: newTop
  });
  return circle;

}
let placesList = document.getElementById('placedObjectList');

function dropElement(e) {
  context.globalCompositeOperation = 'source-over';
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data); //getting the target image i nfo through its id.
  var img = new fabric.Image(imag, { //initializing the fabric image.
    left: e.layerX -30,  //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 30,
    type: 'image',
    alt: imag.alt,
  //  layer: 1,
  });
  if(img.getSrc().split('/')[5] === 'shop1.png'){
    img.scaleToWidth(imag.width*2); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
    img.scaleToHeight(imag.height*2);
  } else{
    img.scaleToWidth(imag.width); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
    img.scaleToHeight(imag.height);
  }


  img.minScaleLimit = 0.05;
  img.setControlsVisibility({
    mb: false,
    ml: false,
    mr: false,
    mt: false,
  });
  let circle = createNewCircle(img);
  let group = new fabric.Group([img, circle],
      {
        originX: 'center',
        originY: 'center',
        left: img.left,
        top: img.top,
        // snappedTo: false,
        // snapID: null,

      });
  group.setControlsVisibility({
    mb: false,
    ml: false,
    mr: false,
    mt: false,
  });
  group.name = 'houseGroup';
  canvas.add(group);

  // let listItem = document.createElement('li');
  // listItem.innerText = img.alt;
  // placesList.appendChild(listItem);
  save();
}



const deleteSelected = (ctx) => {
  canvas.remove(ctx);
  for(let i= 0; i < placesList.children.length; i++){
    if(placesList.children[i].innerText === ctx.alt){
      placesList.children[i].remove();
      break;
    }
  }

}

let lastPath = null;
const setEvent = (canvas) => {
  canvas.on('mouse:move', (event) => {
    if(mousePressed && currentMode === modes.draw){
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
    if(this.panning) {
      var e = event.e;
      var zoom = canvas.getZoom();
      var vpt = canvas.viewportTransform;
      if (zoom < 0.4) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
          vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
          vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
      }
      canvas.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  });
  canvas.on('mouse:up', (event) => {
    mousePressed = false;
    canvas.setViewportTransform(canvas.viewportTransform);
    this.panning = false;

  });
  canvas.on('mouse:down', (event) => {
    mousePressed = true;
    var evt = event.e;
    if(evt.altKey === true){
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
      this.panning = true;
    }
  });
  canvas.on('mouse:wheel', (opt) => {
    // For zoom-to-cursor


    // ---------------
    // Wheel speed/resolution adjustment
    // ---------------
    let delta = 0
    let wheelDelta = opt.e.wheelDelta
    let deltaY = opt.e.deltaY
    // CHROME WIN/MAC | SAFARI 7 MAC | OPERA WIN/MAC | EDGE
    if (wheelDelta) {
      delta = -wheelDelta / 120
    }
    // FIREFOX WIN / MAC | IE
    if(deltaY) {
      deltaY > 0 ? delta = 1 : delta = -1
    }

    let pointer = canvas.getPointer(opt.e)
    let zoom = canvas.getZoom() - delta / 10

    // limit zoom in
    if (zoom > 3) zoom = 3

    // limit zoom out and reset canvas to dead-center
    if (zoom < 0.3) {
      zoom = 0.3
      this.reset(canvas)
    }

    canvas.zoomToPoint({
      x: opt.e.offsetX,
      y: opt.e.offsetY
    }, zoom)

    opt.e.preventDefault()
    opt.e.stopPropagation()

    canvas.renderAll()
    canvas.calcOffset()
  });


  canvas.on('path:created', function (e) {
    var path = e.path;
    path.selectable = false;
    path.objectCaching = false;
    path.hoverCursor = 'default';
    //This is a fucking sorting algorithm for the path and images! and it took almost 4 hours to figure out how to do it!
    sortingAlgorithm();
    save();
    });
  var maxScaleX = 2;
  var maxScaleY = 2;

  canvas.on('object:modified', function(e) {
    if(e.target.id === 'numberedCircle'){

    }
    else if(e.target.item(0).type === 'image' && e.target.name === 'houseGroup'){
      if(e.target.scaleX > maxScaleX){
        e.target.scaleX = maxScaleX;
        e.target.left = this.lastGoodLeft;
        e.target.top = this.lastGoodTop;
      }
      if(e.target.scaleY > maxScaleY){
        e.target.scaleY = maxScaleY;
        e.target.left = this.lastGoodLeft;
        e.target.top = this.lastGoodTop;
      }
      this.lastGoodTop = e.target.top;
      this.lastGoodLeft = e.target.left;

    }
    save();
  });
  canvas.on('object:added', function (obj){
    //save();
  });
  // canvas.on('object:rotating', function (obj){
  //   if(obj.target.name === 'houseGroup'){
  //     var ang = obj.target.angle % 360;
  //     if(ang < 270) {
  //       if(ang > 180){
  //         ang = obj.target.angle % 180;
  //       } else if(ang > 90){
  //         ang = obj.target.angle % 90;
  //       }
  //     }
  //     if(obj.target.snappedTo && obj.target.snapID !== null){
  //
  //       let item = canvas.item(obj.target.snapID);
  //       item.setAngle(ang);
  //     }
  //
  //   }
  // });
//snapzone

  //TODO: Group the circle with text for Legende
  var snapzone = 50;
  canvas.on('object:moving', function (e) {
    let houseGroupArray = canvas.getObjects().filter(obj => obj.name === 'houseGroup');

    if (e.target.id === 'numberedCircle') {
      var circleMiddlePoints = e.target.getCenterPoint();
      for (let i = 0; i <houseGroupArray.length; i++) {
        let houseGroup = houseGroupArray[i];
        var houseGroupMiddlePoints = houseGroup.getCenterPoint();
        if (Math.round(circleMiddlePoints.x) > Math.round(houseGroupMiddlePoints.x) - snapzone && Math.round(circleMiddlePoints.x) <  Math.round(houseGroupMiddlePoints.x) + snapzone
        && Math.round(circleMiddlePoints.y) > Math.round(houseGroupMiddlePoints.y) - snapzone && Math.round(circleMiddlePoints.y) <  Math.round(houseGroupMiddlePoints.y) + snapzone) {
          e.target.set({
            left: houseGroup.oCoords.tl.x ,
            top: houseGroup.oCoords.tl.y
          }).setCoords();

        sortingAlgorithm();
        // houseGroup.snappedTo = true;
        // houseGroup.snapID = getZIndex(e.target);
        }
        // houseGroup.snappedTo = false;
      }
    }
  });

}



let sortingAlgorithm = () => {
  for(var i = 0; i < canvas.getObjects().length; i++){
    if(canvas.item(i).type === 'path' || canvas.item(i).id === 'generatedLine'){
      while(i>0 && (canvas.item(i-1).name === 'houseGroup' || canvas.item(i-1).id === 'numberedCircle')){
        canvas.moveTo(canvas.item(i), i-1)
        i = i-1;
      }
    } else if(canvas.item(i).name === 'houseGroup'){
      while(i>0 && canvas.item(i-1).id === 'numberedCircle'){
        canvas.moveTo(canvas.item(i), i-1)
        i = i-1;
      }
    }

  }
}
let intersectionAvoider = (path) => {
  let imageInCanvas = canvas.getObjects().filter((obj) => obj.name === 'houseGroup');

  for(let i = 0; i < imageInCanvas.length; i++){
    console.log(path.intersectsWithObject(imageInCanvas[i]));
  }
}


let generateLineBetweenObjects = () => {
  removeGeneratedLines();
  let distance = 0;
  //let points = [];
  let line2;
  let imageObjectsInCanvas = canvas.getObjects().filter(obj => obj.name === 'houseGroup');
  for (let i = 0; i < imageObjectsInCanvas.length; i++) {
    for (let j = i+1; j < imageObjectsInCanvas.length; j++) {
      if ((imageObjectsInCanvas[i].item(0).alt === 'building' && imageObjectsInCanvas[j].item(0).alt === 'building') && (imageObjectsInCanvas[i].item(0) !== imageObjectsInCanvas[j].item(0))) {
        distance = imageObjectsInCanvas[i].item(0).getCenterPoint().distanceFrom(imageObjectsInCanvas[j].item(0).getCenterPoint());

        if (distance < 500) {
          //Line gets generated between the two objects from path -> looks better, also random curvature | randomaly doesn't generate fully
          imageObjectsInCanvas[i].item(0).setCoords();
          imageObjectsInCanvas[j].item(0).setCoords();
          let pathWidth = (iScaleX, jScaleX) => {
            if(iScaleX > jScaleX){
              return 12 * 10**(iScaleX);
            } else {
              return 12 * 10**(jScaleX);
            }
          }

          //console.log(imageObjectsInCanvas[i].getPointByOrigin('center', 'top').x)
          line2 = new fabric.Path(
              'M -500 -500 Q 0 0 0 0 ',
              { fill: '',
                stroke: new fabric.Pattern({source: pathBrushImg, repeat: 'no-repeat'}),
                strokeWidth: 10,
                objectCaching: false,
                id:'generatedLine',
                selectable: false,
                hoverCursor: 'default',
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
              });

          var matrix1Start = imageObjectsInCanvas[i].item(1).calcTransformMatrix();
          var matrix2Start = imageObjectsInCanvas[j].item(1).calcTransformMatrix();
          var finalValues1 = fabric.util.qrDecompose(matrix1Start);
          var finalValues2 = fabric.util.qrDecompose(matrix2Start);
          line2.path[0][1] = finalValues1.translateX;
          line2.path[0][2] = finalValues1.translateY;
          line2.path[1][1] = getRandomValue(imageObjectsInCanvas[i].getPointByOrigin('center', 'center').x, imageObjectsInCanvas[j].getPointByOrigin('center', 'center').x);
          line2.path[1][2] = (imageObjectsInCanvas[i].getPointByOrigin('center', 'center').y + imageObjectsInCanvas[j].getPointByOrigin('center', 'center').y)/2 ;
          line2.path[1][3] = finalValues2.translateX;
          line2.path[1][4] = finalValues2.translateY;
          fabric.Polyline.prototype._setPositionDimensions.call(line2, {});

         // intersectionAvoider(line2);

          canvas.add(line2);
          sortingAlgorithm();
          save();
        }
      }
      }
    }



  };


let removeGeneratedLines = () => {
  let objectsInCanvas = canvas.getObjects();
  for (let i = 0; i < objectsInCanvas.length; i++) {
    if (objectsInCanvas[i].id === 'generatedLine') {
      canvas.remove(objectsInCanvas[i]);
    }
  }
}

function getRandomValue(valueX, valueY) {
    if(valueX < valueY){
      let min = Math.ceil(valueX);
      let max = Math.floor(valueY);
      return Math.floor(Math.random() * (max - min) + min);
    } else{
      let min = Math.ceil(valueY);
      let max = Math.floor(valueX);
      return Math.floor(Math.random() * (max - min) + min);
    }

}

var imgArrayNature = [
  {
    img : '/assets/nature/tree1.png',id: "ele1", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree2.png',id: "ele2", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree3.png',id: "ele3", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree4.png',id: "ele4", alt: 'nature', class:'img',draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone1.png',id: "ele5", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone2.png',id: "ele6", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone3.png',id: "ele7", alt: 'nature', class:'img',draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone4.png',id: "ele8", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone5.png',id: "ele9", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/skeleton1.png',id: "ele10", alt:'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/skeleton2.png',id: "ele11", alt:'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/skeleton3.png',id: "ele12", alt: 'nature', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }

]
var imgArrayBuildings = [
  {
    img : '/assets/buildings/house1.png',id: "ele1", alt: 'building', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/house2.png',id: "ele2", alt: 'building', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/house3.png',id: "ele3",  alt: 'building', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/shop1.png',id: "ele4",  alt: 'building', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }
]

let generateImage = (obj) => {
  let htmlOutput = "";
  var div = document.getElementById('imgFiller');
  if(obj === selectedObject.nature){
    for(var i = 0; i < imgArrayNature.length; i++){
      var imageElement = '<img src="#SRC", alt="#ALT", id="#ID", class="#CLASS", draggable="#DRAGGABLE", ondragstart="#ONDRAGSTART" />';
      htmlOutput += imageElement.replace("#SRC", imgArrayNature[i].img).replace("#ALT", imgArrayNature[i].alt).replace("#ID", imgArrayNature[i].id).replace("#CLASS", imgArrayNature[i].class).replace("#DRAGGABLE", imgArrayNature[i].draggable).replace("#ONDRAGSTART", imgArrayNature[i].ondragstart);
    }
    div.innerHTML = htmlOutput;
  } else if(obj === selectedObject.house){
    for(var i = 0; i < imgArrayBuildings.length; i++){
      var imageElement = '<img src="#SRC", alt="#ALT", id="#ID", class="#CLASS", draggable="#DRAGGABLE", ondragstart="#ONDRAGSTART" />';
      htmlOutput += imageElement.replace("#SRC", imgArrayBuildings[i].img).replace("#ALT", imgArrayBuildings[i].alt).replace("#ID", imgArrayBuildings[i].id).replace("#CLASS", imgArrayBuildings[i].class).replace("#DRAGGABLE", imgArrayBuildings[i].draggable).replace("#ONDRAGSTART", imgArrayBuildings[i].ondragstart);
    }
    div.innerHTML = htmlOutput;
  }
}

setEvent(canvas);




let saveCanvasAsImg = () => {
  canvas.setWidth(1000);
  canvas.setHeight(1000);
  canvas.imageSmoothingEnabled = false;
  let oldZoom = canvas.getZoom();

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.calcOffset();


  let canvasURl = canvas.toDataURL({
    format: 'jpeg',
    quality: 1,
    multiplier: 4,
    enableRetinaScaling: true
  });
  const createEl = document.createElement('a');
  createEl.href = canvasURl;

  createEl.download = 'createdMap.jpeg';
  createEl.click();
  createEl.remove();
  //  canvas.svgViewportTransformation = true;
  //  let canvasURLSVG = canvas.toSVG({
  //    suppressPreamble: true,
  //    width: 2000,
  //     height: 2000
  //  });
  canvas.imageSmoothingEnabled = true;
  canvas.setWidth(700);
  canvas.setHeight(700);
  canvas.calcOffset();
}

let getZIndex = (obj) => {
  return canvas.getObjects().indexOf(obj);
}

// let gridCalculation = (grid) => {
//   for (var i = 0; i < ((canvas.width) / grid); i++) {
//     var line1 = new fabric.Line([i * grid, 0, i * grid, canvas.height], {stroke: '#ccc', selectable: false});
//     var line2 = new fabric.Line([0, i * grid, canvas.width, i * grid], {stroke: '#ccc', selectable: false,});
//     canvas.add(line1);
//     canvas.add(line2);
//     canvas.sendToBack(line1);
//     canvas.sendToBack(line2);
//   }
// }
// gridCalculation(20);

