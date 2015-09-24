define([
    "dojo/_base/declare",
    "ct/_Connect",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/SpatialReference",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/Color",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/domReady!"
], function(declare, _Connect, SimpleFillSymbol, SimpleLineSymbol, SpatialReference, Polygon, Point, Graphic, Color, lang, on) {
    return declare([_Connect], {
        polygon: new Polygon({"rings": [[[-122.42, 47.55], [-122.42, 47.6], [-122.35, 47.6], [-122.35, 47.55], [-122.42, 47.55]]], "spatialReference": {"wkid": 4326}}),
        streamlayerNodeId: null,
        glasspaneNodeId: null,
        constructor: function(properties){
            this.streamlayerNodeId = properties.streamlayerNodeId;
            this.glasspaneNodeId = properties.glasspaneNodeId;
        },
        activate: function() {
            this.drawBoundingBox(this.polygon, this.glasspaneNodeId);
            this.startStreamListener(this.streamlayerNodeId);            
        },
        drawBoundingBox: function(polygon, glasspaneNode){
            var resultNode = this._mapModel.getGlassPaneLayer().findSubNodeById(glasspaneNode);
            var pointSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            var graphic = new Graphic(polygon, pointSymbol);
            resultNode.addGraphic(graphic);
        },
        startStreamListener: function(nodeId){
            var node = this._mapModel.getNodeById(nodeId);
            var esriLayer = this._esriMapReference.getEsriLayer(node);
            on(esriLayer, "message", lang.hitch(this, this.checkForContamination));
        },
        checkForContamination: function(message){
            var geometry = message[0].geometry;
            if (this.polygon.contains(new Point([geometry.x, geometry.y], new SpatialReference({wkid: geometry.spatialReference.wkid})))) {
                this.logService.warn("Bus " + message[0].attributes.RouteID + " in contamination area detected, heading " + message[0].attributes.Heading + "°!");
            }
        },
        destroy: function() {
            this.disconnectStreamLayer();
        }
    });
});