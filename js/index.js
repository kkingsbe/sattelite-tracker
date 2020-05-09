var map, markers = []

function createMap() {
  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4
    })
  })
  let featureLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })
  featureLayer.set("name", "featurelayer")
  map.addLayer(featureLayer)
}

//Returns the feature layer
function getFeatureLayer() {
  let layers = map.getLayers().array_
  for(let layer of layers) if(layer.get("name") == "featurelayer") return layer
}

//Returns true if the given marker exists
function markerExists(name) {
  for(let marker of markers) if(marker.values_.name == name) return true
}

//Returns the given marker
function getMarker(name) {
  let featureLayer = getFeatureLayer()
  for(let marker of featureLayer.getSource().getFeatures()) if(marker.values_.name == name) return marker
  return false
}

/* description: First checks to see if the satellite has already been drawn. If it has, then it just updates its position, and if it hasn't, it creates a marker of its position
 * parameters: name{string}: The name of the satellite that you would like to draw
 */
function drawSatellite(name) {
  if(markerExists(name)) {
    updateSatellite(name)
    return
  }

  //If we have gotten to this point, the satellite has not yet been drawn
  //console.log("Making new marker")
  let pos = getCurrentLatLong(name)

  let featureLayer = getFeatureLayer()

  //console.log(featureLayer)
  let marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([pos.long, pos.lat])),
    name: name
  })
  marker.style = {
    label : name,
    pointRadius: 10,
    fillColor: "#ffcc66",
    fillOpacity: 0.8,
    strokeColor: "#cc6633",
    strokeWidth: 2,
    strokeOpacity: 0.8
  }
  markers.push(marker)
  featureLayer.getSource().addFeature(marker)
}

/* description: Runs drawSatellite() for every satellite in the dataset
 */
function drawAllSatellites() {
  tleArr.forEach(tle => {
    try{
      drawSatellite(tle.name)
    } catch {}
  })
}

/* description: Updates the position of an existing satellite marker
 * parameters: name{string}: The name of the satellite that you would like to draw
 */
function updateSatellite(name) {
  //If we have gotten to this point, the satellite has not yet been drawn
  let pos = getCurrentLatLong(name)
  //console.log(pos)
  let featureLayer = getFeatureLayer()
  let marker = getMarker(name)
  featureLayer.getSource().removeFeature(marker)
  marker.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([pos.long, pos.lat])))
  marker.style = {
    label : name,
    pointRadius: 10,
    fillColor: "#ffcc66",
    fillOpacity: 0.8,
    strokeColor: "#cc6633",
    strokeWidth: 2,
    strokeOpacity: 0.8
  }
  featureLayer.getSource().addFeature(marker)
}

createMap()

setInterval(() => {
  //drawSatellite("ISS (ZARYA)")
  drawAllSatellites()
}, 1000)