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

let mousePressed = false;
let currentMode;

const modes = {
  draw: 'draw',
}

const openNav = () => {
  document.getElementById("leftSidebar").style.width = "250px";
  document.getElementById("parent").style.marginRight = "250px";
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

let placesList = document.getElementById('placedObjectList');

function dropElement(e) {
  context.globalCompositeOperation = 'source-over';
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data); //getting the target image info through its id.
  var img = new fabric.Image(imag, { //initializing the fabric image.
    left: e.layerX -30,  //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 30,
    type: 'image',
    alt: imag.alt,
  //  layer: 1,
  });

  img.scaleToWidth(imag.width); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
  img.scaleToHeight(imag.height);
  img.minScaleLimit = 0.05;
  img.setControlsVisibility({
    mb: false,
    ml: false,
    mr: false,
    mt: false,
  });
  canvas.add(img);

  let listItem = document.createElement('li');
  listItem.innerText = img.alt;
  placesList.appendChild(listItem);
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

    });
  var maxScaleX = 1;
  var maxScaleY = 1;

  canvas.on('object:modified', function(e) {
    if(e.target.type === 'image'){
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
  });
  canvas.on('object:added', function (obj){
    if(obj.target.type === 'image'){
      //console.log(obj.target.getCenterPoint());
    }
  });




  //snapping to grid -> feels laggy.. maybe only for drawing
  // canvas.on('object:moving', function(options) {
  //   options.target.set({
  //     left: Math.round(options.target.left / grid) * grid,
  //     top: Math.round(options.target.top / grid) * grid
  //   });
  // });


}

let sortingAlgorithm = () => {
  for(var i = 0; i < canvas.getObjects().length; i++){
    if(canvas.item(i).type === 'path' || canvas.item(i).id === 'generatedLine'){
      while(i>0 && canvas.item(i-1).type === 'image'){
        canvas.moveTo(canvas.item(i), i-1)
        i = i-1;
      }
    }

  }
}

let generateLineBetweenObjects = () => {
  let distance = 0;
  //let points = [];
  let line2;
  let imageObjectsInCanvas = canvas.getObjects('image');
  for (let i = 0; i < imageObjectsInCanvas.length; i++) {
    for (let j = i+1; j < imageObjectsInCanvas.length; j++) {
      if (imageObjectsInCanvas[i] !== imageObjectsInCanvas[j]) {
        distance = imageObjectsInCanvas[i].getCenterPoint().distanceFrom(imageObjectsInCanvas[j].getCenterPoint());
        if (distance < 500) {
          //Line gets generated between the two objects from path -> looks better, also random curvature | randomaly doesn't generate fully
          imageObjectsInCanvas[i].setCoords();

          console.log(imageObjectsInCanvas[i])
          imageObjectsInCanvas[j].setCoords();

          line2 = new fabric.Path('M 200 250 Q 350 250 550 250 ', { fill: '', stroke: new fabric.Pattern({source: pathBrushImg, repeat: 'no-repeat'}), strokeWidth: 10, objectCaching: false, id:'generatedLine', selectable: false });
          line2.path[0][1] = imageObjectsInCanvas[i].getCenterPoint().x;
          line2.path[0][2] = imageObjectsInCanvas[i].getCenterPoint().y;
          line2.path[1][1] = getRandomValue(imageObjectsInCanvas[i].getCenterPoint().x, imageObjectsInCanvas[j].getCenterPoint().x);
          line2.path[1][2] = (imageObjectsInCanvas[j].getCenterPoint().y + imageObjectsInCanvas[j].getCenterPoint().y)/2 ;
          line2.path[1][3] = imageObjectsInCanvas[j].getCenterPoint().x;
          line2.path[1][4] = imageObjectsInCanvas[j].getCenterPoint().y;
          canvas.add(line2)

          // just a straight line between the two objects
          // let line = new fabric.Line([imageObjectsInCanvas[i].getCenterPoint().x, imageObjectsInCanvas[i].getCenterPoint().y, imageObjectsInCanvas[j].getCenterPoint().x, imageObjectsInCanvas[j].getCenterPoint().y], {
          //   strokeWidth: 20,
          //   id: 'generatedLine',
          //   objectCaching: false,
          //   selectable: false,
          // });
          // line.set('stroke', new fabric.Pattern({
          //   source: pathBrushImg,
          //   repeat: 'no-repeat',
          // }));
          // canvas.add(line);

          sortingAlgorithm();

        }
      }
      }
    }



  };

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
    img : '/assets/nature/tree1.png',id: "ele1", alt: 'Tree image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree2.png',id: "ele2", alt: 'Tree2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree3.png',id: "ele3", alt: 'Tree3 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree4.png',id: "ele4", alt: 'Tree4 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone1.png',id: "ele5", alt: 'Stone1 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone2.png',id: "ele6", alt: 'Stone2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone3.png',id: "ele7", alt: 'Stone3 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone4.png',id: "ele8", alt: 'Stone4 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/stone5.png',id: "ele9", alt: 'Stone5 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }
]
var imgArrayBuildings = [
  {
    img : '/assets/buildings/house1.png',id: "ele1", alt: 'house', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/house2.png',id: "ele2", alt: 'house', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/house3.png',id: "ele3",  alt: 'house', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/shop1.png',id: "ele4",  alt: 'shop', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
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
  canvas.setWidth(2000);
  canvas.setHeight(2000);
  canvas.calcOffset();
  let canvasURl = canvas.toDataURL(`png`,1);
  const createEl = document.createElement('a');
  createEl.href = canvasURl;

  createEl.download = 'createdMap.png';
  createEl.click();
  createEl.remove();
  //  canvas.svgViewportTransformation = true;
  //  let canvasURLSVG = canvas.toSVG({
  //    suppressPreamble: true,
  //    width: 2000,
  //     height: 2000
  //  });

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

