# Streamlayer Bundle
The streamlayer bundle makes ArcGIS Service of type "STREAM_LAYER" usable in map.apps. After activating the bundle inside your app you can configure the service inside your map model as operational layer of type "STREAM_LAYER". For more details please review the sample app configuration.

A stream layer uses HTML5 websockets to connect to a webserver that emits geographic features continuously. For more information about esri streamlayer read here: https://developers.arcgis.com/javascript/jsapi/streamlayer-amd.html

### Sample App ###
http://www.mapapps.de/mapapps/resources/apps/downloads_streamlayer/index.html

### Note ###
This bundle requires your browser to support HTML5 web sockets. Therefore you should use at least Internet Explorer 10, Chrome 27, Firefox 27, Safari 7.1 or later.

Installation Guide
------------------
- First, you need to add the bundle "streamlayerservice" to your app.
- After that, add a StreamService to your MappingResourceRegistryFactory.
```
"MappingResourceRegistryFactory": {
  "_knownServices": {
    "services": [
      {
        "id": "satellite_streamlayer",
        "url": "wss://geoeventsample3.esri.com:8443/arcgis/ws/services/WorldSatellites/StreamServer/subscribe",
        "type": "STREAM_LAYER"
      }
    ]
  }
}
```
- Finally add the StreamLayer to the operational layers.
```
"operationalLayer": [
  {
    "title": "${service.satellite.title}",
    "enabled": true,
    "service": "satellite_streamlayer",
    "wkid": "3857",
    "displayCount": "1000",
    "infoTemplate": {
      "title": "Satellite Name: ${SatelliteName}",
      "content": "Timestamp: ${DateTimeStamp}<br>Altitude: ${AltitudeMeters}m<br>Heading: ${Heading}\u00B0"
    },
    "symbol": {
      "type": "esriPMS",
      "url": "resource('${app}:images/satellite.png')",
      "contentType": "image/png",
      "color": null,
      "width": 32,
      "height": 32,
      "angle": 0,
      "xoffset": 0,
      "yoffset": 0
    }
  }
]
```

### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
