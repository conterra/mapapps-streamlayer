/*
 * Copyright (C) 2015 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    "dojo/_base/declare",
    "esri/InfoTemplate",
    "esri/layers/StreamLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "ct/mapping/map/EsriLayerFactory",
    "ct/mapping/map/EsriService",
    "ct/mapping/mapcontent/ServiceTypes",
    "ct/mapping/geometry",
    "ct/_Connect"
], function(declare, InfoTemplate, StreamLayer, SimpleMarkerSymbol, SimpleRenderer, EsriLayerFactory, EsriService, ServiceTypes, geometry, _Connect) {

    return declare([_Connect], {
        start: function(bundleContext) {

            var type = ServiceTypes.STREAM_LAYER = "STREAM_LAYER";

            EsriLayerFactory.globalServiceFactories[type] = {
                create: function(node, url, mapModel, mapState) {
                    return new EsriService({
                        mapModelNode: node,
                        createEsriLayer: function() {
                            var coordinateTransformerReference = bundleContext.getServiceReferences("ct.api.coordinatetransformer.CoordinateTransformer")[0];
                            var coordinateTransformer = bundleContext.getService(coordinateTransformerReference);
                            var eventServiceReference = bundleContext.getServiceReferences("ct.framework.api.EventService")[0];
                            var eventService = bundleContext.getService(eventServiceReference);
                            
                            var displayCount = node.get("displayCount");
                            var infoTemplate = node.get("infoTemplate");
                            var targetCRS = node.get("wkid");
                            var maximumTrackPoints = node.get("maximumTrackPoints");
                            if(maximumTrackPoints === 'undefined')maximumTrackPoints = 1;

                            var layer = new StreamLayer(url, {
                                purgeOptions: {displayCount: displayCount},
                                maximumTrackPoints: maximumTrackPoints,
                                socketDirection: "subscribe",
                                infoTemplate: new InfoTemplate(infoTemplate.title, infoTemplate.content)
                            });

                            // Set fullExtent to whole world with defined CRS
                            // TODO: Define bounding-box in service-configuration
                            var fullExtent = geometry.createExtent(-179.99, -89.99, 179.99, 89.99, 4326);

                            // Transform fullExtent to configured CRS or choose 4326 if not configured
                            if (!targetCRS) {
                                layer.fullExtent = fullExtent;
                            } else {
                                layer.fullExtent = coordinateTransformer.transform(fullExtent, targetCRS);
                            }

                            // Fire event for new features
                            this.connect(layer, "onMessage", function(message) {
                                eventService.postEvent("ct/map/streamlayer/OnMessage", {
                                    src: this,
                                    message: message
                                });
                            });
                            
                            this.addRenderer(layer, node.get("symbol"));
                            return layer;
                        },
                        addRenderer: function(layer, symbol) {
                            layer.setRenderer(new SimpleRenderer(new SimpleMarkerSymbol(symbol)));
                        }
                    });
                }
            };
        },
        stop: function() {
            this.disconnect();
            EsriLayerFactory.globalServiceFactories[ServiceTypes.STREAM_LAYER] = null;
            ServiceTypes.STREAM_LAYER = null;
        }
    });
});