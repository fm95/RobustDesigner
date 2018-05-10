/*
* File: classi.js
* Version: 1.0
* Type: javascript
* Date: 2018-05-05
* Author: Lidia Alecci
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

// Model //
var graph = new joint.dia.Graph;

// View //
var paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    model: graph,
    width: 1000,
    height: 700,
    drawGrid: true,
    gridSize: 10,
    backgroundColor: 'white',
    interactive: true,
    highlighting: {
        'default': {
            name: 'stroke',
            options: {
                padding: 20,
            }
        }},

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
var uml = joint.shapes.uml;
var cells = [];

// Elementi UML //

// Interfaccia UML //
var Interfaccia = new uml.Interface({
      position: { x:10  , y: 30 },
      size: { width: 130, height: 120 },
      name: 'Interfaccia',
      attributes: ['- stato: tipo'],
      methods: ['+metodo(): tipo'],
      attrs: {
          '.uml-class-name-rect': {
              fill: '#feb662',
              stroke: '#ffffff',
              'stroke-width': 0.5
          },
          '.uml-class-attrs-rect, .uml-class-methods-rect': {
              fill: '#fdc886',
              stroke: '#fff',
              'stroke-width': 0.5
          },
          '.uml-class-attrs-text': {
              ref: '.uml-class-attrs-rect',
              'ref-y': 0.5,
              'y-alignment': 'middle'
          },
          '.uml-class-methods-text': {
              ref: '.uml-class-methods-rect',
              'ref-y': 0.5,
              'y-alignment': 'middle'
          }

      }
  });
cells[0] = Interfaccia;

// Classe Astratta  UML //
var ClasseAstratta = new uml.Abstract({
    position: { x:10  , y: 180 },
    size: { width: 130, height: 120 },
    name: 'Classe Astratta',
    attributes: [' - stato:tipo'],
    methods: ['+ metodo(): tipo'],
    attrs: {
        '.uml-class-name-rect': {
            fill: '#68ddd5',
            stroke: '#ffffff',
            'stroke-width': 0.5
        },
        '.uml-class-attrs-rect, .uml-class-methods-rect': {
            fill: '#9687fe',
            stroke: '#fff',
            'stroke-width': 0.5
        },
        '.uml-class-methods-text, .uml-class-attrs-text': {
            fill: '#fff'
        }
    }
});
cells[1] = ClasseAstratta;

var Class = new uml.Class({
  position: { x:10  , y: 330 },
  size: { width: 130, height: 120 },
    name: 'Classe',
    attributes: ['- stato: tipo'],
    methods: ['+ metodo(): tipo'],
    attrs: {
        '.uml-class-name-rect': {
            fill: '#ff8450',
            stroke: '#fff',
            'stroke-width': 0.5
        },
        '.uml-class-attrs-rect, .uml-class-methods-rect': {
            fill: '#fe976a',
            stroke: '#fff',
            'stroke-width': 0.5
        },
        '.uml-class-attrs-text': {
            'ref-y': 0.5,
            'y-alignment': 'middle'
        }
    }

});
cells[2] = Class;

// Aggiungo gli elementi alla draggable Area //
draggableElementContainerGraph.addCells(cells);
///////////////////////////////////////////


// Connessioni UML //

var Association = new joint.dia.Link({
    source: { x: 100, y:300 }, target: { x:100, y: 100 },
    attrs: {
        '.connection': { stroke: 'black', strokeWidth: '1' },
        '.marker-target': {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'black',
            d: 'M 10 0 L 0 5 M 0 5 L 10 10'
        }
    }
});

var Generalization = new uml.Generalization({ source: { x: 150, y:300 }, target: { x:150, y: 100 }});

var Aggregation = new uml.Aggregation({ source: { x: 200, y:300 }, target: { x:200, y: 100 }});

var Composition = new uml.Composition({ source: { x: 250, y:300 }, target: { x:250, y: 100 }});

var Implementation = new uml.Implementation({ source: { x: 300, y:300 }, target: { x:300, y: 100 }});

///////////////////////////////

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
/*
$('#importa').on('click', function() {

    graph.fromJSON(JSONobj);

});*/

$('#Associazione').on('click', function() {
    Association.addTo(graph);
});

$('#Generalizzazione').on('click', function() {
    Generalization.addTo(graph);
});

$('#Aggregazione').on('click', function() {
    Aggregation.addTo(graph);
});

$('#Composizione').on('click', function() {
    Composition.addTo(graph);
});

$('#Realizzazione').on('click', function() {
    Implementation.addTo(graph);
});




//////////////////////////////////////
