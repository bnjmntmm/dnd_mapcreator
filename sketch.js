fabric.maxCacheSideLimit = 11000;
var canvas = new fabric.Canvas('canvas', {
  backgroundColor: '#fff',
  selection: false,
  stroke: 'green',
  strokeWidth: 50,
  preserveObjectStacking: true,
});

let mousePressed = false;
let currentMode;
let lastPosX;
let lastPosY;
let panning;

const modes = {
  draw: 'draw',
}

const openNav = () => {
  document.getElementById("leftSidebar").style.width = "250px";
  document.getElementById("parent").style.marginLeft = "250px";
}
const closeNav = () => {
  document.getElementById("leftSidebar").style.width = "0";
  document.getElementById("parent").style.marginLeft= "0";
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
grassBrushImg.src = '/assets/tiles/grass01.png';
var grassPatternBrush = new fabric.PatternBrush(canvas);
grassPatternBrush.source = grassBrushImg;




const togglePen = (mode) => {
  if(mode === modes.draw){
    if(currentMode === modes.draw){
      currentMode = '';
      canvas.isDrawingMode = false;

    }else{
      context.globalCompositeOperation = 'destination-over';
      canvas.freeDrawingBrush = grassPatternBrush;
      canvas.freeDrawingBrush.width = parseInt('50');
      currentMode = modes.draw;

    }
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

function dropElement(e) {
  context.globalCompositeOperation = 'source-over';
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data); //getting the target image info through its id.
  var img = new fabric.Image(imag, { //initializing the fabric image.
    left: e.layerX - 80,  //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 40,
  //  layer: 1,
  });
  img.scaleToWidth(imag.width); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
  img.scaleToHeight(imag.height);
  canvas.add(img);

}

const deleteSelected = (ctx) => {
  canvas.remove(ctx);
}

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
  canvas.on('mouse:wheel', (event) => {
    var delta = event.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    canvas.zoomToPoint({x: event.e.offsetX, y: event.e.offsetY}, zoom);
    event.e.preventDefault();
    event.e.stopPropagation();
    var vpt = canvas.viewportTransform;
    if (zoom < 0.4) {
      vpt[4] = 200 - 1000 * zoom / 2;
      vpt[5] = 200 - 1000 * zoom / 2;
    } else {
      if (vpt[4] >= 0) {
        vpt[4] = 0;
      } else if (vpt[4] < canvas.width - 1000 * zoom) {
        vpt[4] = canvas.width - 1000 * zoom;
      }
      if (vpt[5] >= 0) {
        vpt[5] = 0;
      } else if (vpt[5] < canvas.height - 1000 * zoom) {
        vpt[5] = canvas.height - 1000 * zoom;
      }
    }

  });

  canvas.on('path:created', function (e) {
    var path = e.path;
    path.selectable = false;
    path.hoverCursor = 'default';
    canvas.sendToBack(path);
  });
  //snapping to grid -> feels laggy.. maybe only for drawing
  // canvas.on('object:moving', function(options) {
  //   options.target.set({
  //     left: Math.round(options.target.left / grid) * grid,
  //     top: Math.round(options.target.top / grid) * grid
  //   });
  // });
  //

}

var imgArrayNature = [
  {
    img : '/assets/nature/tree1.png',id: "ele1", alt: 'Tree image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree2.png',id: "ele2", alt: 'Tree2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }
]
var imgArrayBuildings = [
  {
    img : '/assets/buildings/House_1.png',id: "ele1", alt: 'House image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/House_2.png',id: "ele2", alt: 'House2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/House_3.png',id: "ele3", alt: 'House3 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/Shop_1.png',id: "ele4", alt: 'Shop image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
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
  let canvasURl = canvas.toDataURL();
  const createEl = document.createElement('a');
  createEl.href = canvasURl;

  createEl.download = 'createdMap.png';
  createEl.click();
  createEl.remove();
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

