# Streamlayer Bundle
The streamlayer bundle makes ArcGIS Service of type "STREAM_LAYER" usable in map.apps. After activating the bundle inside your app you can configure the service inside your map model as operational layer of type "STREAM_LAYER". For more details please review the sample app configuration.

A stream layer uses HTML5 websockets to connect to a webserver that emits geographic features continuously. For more information about esri streamlayer read here: https://developers.arcgis.com/javascript/jsapi/streamlayer-amd.html

### Note ###
This bundle requires your browser to support HTML5 web sockets. Therefore you should use at least Internet Explorer 10, Chrome 27, Firefox 27, Safari 7.1 or later.

### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`

### Sample App ###
http://www.mapapps.de/mapapps/resources/apps/downloads_streamlayer/index.html
