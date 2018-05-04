// Model //
var graph = new joint.dia.Graph;

// Default link //
var link = new joint.dia.Link({
  attrs: {
      '.connection': { stroke: 'black', strokeWidth: '1' },
      '.marker-target': {
          stroke: 'black',
          strokeWidth: 2,
          fill: 'black',
          d: 'M 10 0 L 0 5 M 0 5 L 10 10'
      }
  },
  labels: [{ position: 0.5, attrs: { text: { text: ''}}}]
});

// View //
var paper = new joint.dia.Paper({
  el: document.getElementById('paper'),
  model: graph,
  width: 1000,
  height: 700,
  snapLinks: true,
  linkPinning: false,
  drawGrid: true,
  gridSize: 10,
  backgroundColor: 'white',
  interactive: true,
  // Elimina un elemento con double-click
  elementView: joint.dia.ElementView.extend({
      pointerdblclick: function(evt, x, y) {
          //this.model.remove();
      }
  }),
  defaultLink: link,
  highlighting: {
        'default': {
            name: 'stroke',
            options: {
                padding: 20,
            }
  }},
  validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      // Prevent linking from input ports.
      if (magnetS && magnetS.getAttribute('type') === 'input')
          return false;
      // Prevent linking from output ports to input ports within one element.
      if (cellViewS === cellViewT)
          return false;
      // Prevent loop linking & Prevent linking to input ports.
      return (magnetS !== magnetT);

      return magnetT && magnetT.getAttribute('type') === 'input';
  },
});
/////////////////////////////////

var draggableElementContainerGraph = new joint.dia.Graph;

var draggableElementContainerPaper = new joint.dia.Paper({
    el: document.getElementById('draggableElementContainerPaper'),
    drawGrid: true,
    gridSize: 10,
    width: 150,
    height: 700,
    model: draggableElementContainerGraph,
    interactive: false,
    background: {
        color: '#ecf8ec',
        opacity: 0.3
    }
});
///////////////////////////////////////////

// Connessione tra due elementi //
var connect = function(source, sourcePort, target, targetPort) {

    var link = new joint.dia.Link({
        source: {
            id: source.id,
            port: sourcePort
        },
        target: {
            id: target.id,
            port: targetPort
        }
    });

    link.addTo(graph).reparent();
};
/////////////////////////////////

// Selezione elementi grafico //
var previousCellView = null;
var selected = null;

paper.on('cell:pointerdown', function(cellView) {
    selected = cellView.model;

    $('#delete').prop('disabled', false);
    $('#modifica').prop('disabled', false);
    $('#textA').prop('disabled', false);

    //selected.
});

paper.on('element:pointerdown',
    function(elementView, evt, x, y) {
        //console.log('cell view ' + elementView.model.id + ' was clicked');
        elementView.highlight();
        //console.log("highlighted "+elementView.model.id);

        if(elementView != previousCellView && previousCellView != null){
            previousCellView.unhighlight();
            //console.log("unhighlighted "+previousCellView.model.id);
        }
        previousCellView = elementView;
    }
);

paper.on('link:pointerdblclick', function(linkView) {
  // NON FUNZIONA
    resetAll(this);

    var currentLink = linkView.model;
    currentLink.attr('line/stroke', 'orange')
    currentLink.label(0, {
        attrs: {
            body: {
                stroke: 'orange'
            }
        }
    })
});
///////////////////////////////////////////

// Click sul piano //
paper.on('blank:pointerdown',
    function(evt, x, y) {

      selected = null;
      $('#delete').prop('disabled', true);
      $('#modifica').prop('disabled', true);
      $('#textA').prop('disabled', true);
      $('#textA').val("");

        if(previousCellView != null){
            previousCellView.unhighlight();
            //console.log("unhighlighted "+previousCellView.model.id);
        }
    }
);
///////////////////////////////////////////

// Elementi del Robustness Diagramm //

joint.shapes.devs.CircleModel = joint.shapes.devs.Model.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle class="body"/></g><image> </image><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'devs.CircleModel',
        inPorts: [''],
        outPorts: [''],
        attrs: {
            '.body': {r: 50, cx: 50, stroke: 'none', fill: 'transparent'},
            //set text '.label': {text: $("#jsontext").val()},
            '.label': { text: '', fontSize: 11, fontWeight: 'normal', 'ref-x': .5, 'ref-y': .4 },
            'image': { 'ref-x': -15, 'ref-y': -15, ref: 'circle', width: 110, height: 110 },
        }

    }, joint.shapes.devs.Model.prototype.defaults)
});
joint.shapes.devs.CircleModelView = joint.shapes.devs.ModelView;
////////////////////////////////////////

// Costruisco i 4 elementi //
var cells = [];

// Actor
var Actor = new joint.shapes.devs.CircleModel({
  type: 'devs.CircleModel',
  position: {x: 35, y: 90},
  attrs: {
        text: {text: 'Actor'},
        image: { 'xlink:href': './img/Actor.png' },
        '.body': {stroke: 'none', fill: 'yellow'}
  },
  //linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
  inPorts: [''],
  //outPorts: [''],
  ports: {
      groups: {
          'in': {
                  position: {
                    args: {
                        dx: 22,
                        dy: -35
                  }
              },
              attrs: {
                  '.port-body': {
                      stroke: 'none',
                      fill: 'transparent',
                      r: 20,
                      cx: 19,
                  }

              }
          },
          //'out': {}
      }
  },
});
cells[0] = Actor;

// Boundary
var Boundary = new joint.shapes.devs.CircleModel({
  type: 'devs.CircleModel',
  position: {x: 35, y: 250},
  attrs: {
        text: {text: 'Boundary'},
        image: { 'xlink:href': './img/Boundary.png' },
        '.body': {stroke: 'none', fill: 'transparent'}
  },
  inPorts: [''],
  //outPorts: [''],
  ports: {
      groups: {
          'in': {
                  position: {
                    args: {
                        dx: 32,
                        dy: -39
                  }
              },
              attrs: {
                  '.port-body': {
                      stroke: 'none',
                      fill: 'transparent',
                      r: 23,
                      cx: 21.5,
                  }

              }
          },
          //'out': {}
      }
  },
});
cells[1] = Boundary;

// Control
var Control = new joint.shapes.devs.CircleModel({
  type: 'devs.CircleModel',
  position: {x: 35, y: 430},
  attrs: {
        text: {text: 'Control'},
        image: { 'xlink:href': './img/Control.png' },
        '.body': {stroke: 'none', fill: 'transparent'}
  },
  inPorts: [''],
  //outPorts: [''],
  ports: {
      groups: {
          'in': {
                  position: {
                    args: {
                        dx: 18,
                        dy: -36
                  }
              },
              attrs: {
                  '.port-body': {
                      stroke: 'none',
                      fill: 'red',
                      opacity: '0.5',
                      r: 23.8,
                      cx: 22,
                  }

              }
          },
          //'out': {}
      }
  },
});
cells[2] = Control;

// Entity
var Entity = new joint.shapes.devs.CircleModel({
  type: 'devs.CircleModel',
  position: {x: 35, y: 600},
  attrs: {
        text: {text: 'Entity'},
        image: { 'xlink:href': './img/Entity.png' },
        '.body': {stroke: 'none', fill: 'transparent'}
  },
  inPorts: [''],
  //outPorts: [''],
  ports: {
      groups: {
          'in': {
                  position: {
                    args: {
                        dx: 18,
                        dy: -39
                  }
              },
              attrs: {
                  '.port-body': {
                      stroke: 'none',
                      fill: 'transparent',
                      r: 24.3,
                      cx: 20,
                  }

              }
          },
          //'out': {}
      }
  },
});
cells[3] = Entity;

// Commento


// Aggiungo gli elementi alla draggable Area //
draggableElementContainerGraph.addCells(cells);
///////////////////////////////////////////

// Draggable Area //
draggableElementContainerPaper.on('cell:pointerdown', function(cellView, e, x, y) {
    $('body').append('<div id="flyPaper" style="position:relative;opacity:0.4;pointer-event:none;"></div>');
    var flyGraph = new joint.dia.Graph,
        flyPaper = new joint.dia.Paper({
            el: $('#flyPaper'),
            model: flyGraph,
            height: 100,
            width:110,
            interactive: false
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
            x: x - pos.x,
            y: y - pos.y
        };

    flyShape.position(15, 10);
    flyShape.prop = 1;
    flyGraph.addCell(flyShape);
    $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
    });
    $('body').on('mousemove.fly', function(e) {
        $("#flyPaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
    });
    $('body').on('mouseup.fly', function(e) {
        var x = e.pageX,
            y = e.pageY,
            target = paper.$el.offset();

        // Dropped over paper ?
        if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
            var s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            graph.addCell(s);
        }
       $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
    });
});
//////////////////////////////////

//// ZOOM //////////  //////////
var canvas = $('#paper');

var svgZoom = svgPanZoom('#paper svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.5,
  maxZoom: 3,
  zoomScaleSensitivity: 0.5
});

paper.on('cell:pointerdown', function(){
  svgZoom.disablePan();
});

paper.on('cell:pointerup', function(){
  svgZoom.enablePan();
});
////////// ////////// //////////

// BUTTON FUNCTION /////////////////////
$('#deleteAll').on('click', function() {
  graph.clear();
});

$('#delete').on('click', function() {
  if (selected)
    selected.remove();
});

$('#modifica').on('click', function() {
  if (selected) {
    selected.attr('text/text', $('#textA').val());
    $('#textA').val("");
  }
});

$('#esporta').on('click', function() {

    var JSONobj = graph.toJSON();
    var JSONstring = JSON.stringify(JSONobj);

    alert(JSONstring);
    //console.log(JSONstring);
});

$('#importa').on('click', function() {

    graph.fromJSON(JSONobj);

});
//////////////////////////////////////
