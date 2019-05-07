//the base maps
/*  These are the different basemaps that are being used to render this mapping application. Currently, there are only two base maps for the challenge map,  USGS Topo and the USGS Imagery, The last basemap only loads at zoom level 14 through 19 in order to help ensure that there is imagery for every level that a user could zoom into. */

var imageryTopo = L.tileLayer.wms('http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?', {
  minZoom: '0',
  maxZoom: '16',
  layers: '0',
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer">USGS</a>'
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  minZoom : '0', 
  maxZoom : '16',	
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});
// lines 38-44 Are layer groups for the three layers of points that are apart of this challenge map 
var national = L.layerGroup([imageryTopo,nationalMap]);
var usda = L.layerGroup([nationalMap, imageryTopo]);

var needsChecked = 0;
var needsReviewed = 0;
var finshed = 0;
/* Lines 47 - 91 This is the feature lay group for the clustering of the points.
Note: Line 46  and 47 are important in this block of code. Line 46 is where the endpoint api goes. And Lines 47 is the query for the feature type you are hoping to focus on */


/*var featureLayer = new L.esri.FeatureLayer({
          chunkedLoading: true,
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
		  where: "FCODE= '83044' AND STATE ='NY'",
          pointToLayer: function(feature, latlng) {
            if(feature.properties.EDITSTATUS === 0){ 
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-exclamation fa-2x',
                      shape: 'square',
                      markerColor:'red',
                      prefix: 'fa'
                   }),
               });
            } else if (feature.properties.EDITSTATUS === 1){
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-times fa-2x',
                      markerColor:'green-light',
                      shape: 'square',
                      prefix: 'fa'
                   }),
               });
            } else {
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-check fa-2x',
                      shape: 'square',
                      markerColor:'yellow',
                      prefix: 'fa'
                   }),
               });
            }
          },
          onEachFeature: function(feature, layer){
            if(feature.properties.EDITSTATUS === 0){ 
              needsChecked++;
              $('#tobecheckedCounter').text(" (" + needsChecked + " points)");
            } else if (feature.properties.EDITSTATUS === 1){
              needsReviewed++;
              $('#tobepeerreviwedCounter').text(" (" + needsReviewed + " points)");
            } else {
              finshed++;
              $('#finishedCounter').text(" (" + finshed  + " points)")
            }
            layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          }
        });*/
	
// Lines 96 - 98 Is your bounding box, for the area you wish to focus the map. 					 
var southWest = L.latLng(31.427153, -88.204519), // updated March 2019  
  northEast = L.latLng(47.021951, -68.569633),
  bounds = L.latLngBounds(southWest, northEast);

  // Checkboxes 

  var uneditedpts = L.esri.featureLayer({
    url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "EDITSTATUS = 0 AND FCODE = '83044' AND STATE='NY'",
            pointToLayer: function(feature, latlng) {
              if(feature.properties.EDITSTATUS === 0){ 
                return L.marker(latlng, {
                    icon: L.ExtraMarkers.icon({
                        icon: 'fa-exclamation fa-2x',
                        shape: 'square',
                        markerColor:'red',
                        prefix: 'fa'}), 
                    },
                )};  
    },      onEachFeature: function(feature, layer){
          feature.properties.EDITSTATUS === 0 
          needsChecked++;
          $('#tobecheckedCounter').text(" (" + needsChecked + " points)");
      layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
    }        
  }); 
  
  
  var peerreviewpts = L.esri.featureLayer({
    url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
  where: "EDITSTATUS = 1 AND FCODE = '83044' AND STATE='NY'",
          pointToLayer: function(feature, latlng) {
            if(feature.properties.EDITSTATUS === 1){ 
              return L.marker(latlng, {
                icon: L.ExtraMarkers.icon({
                    icon: 'fa-times fa-2x',
                    markerColor:'green-light',
                    shape: 'square',
                    prefix: 'fa'}), 
          },
      )};
    },  onEachFeature: function(feature, layer){
        feature.properties.EDITSTATUS === 1
        needsReviewed++;
        $('#tobepeerreviwedCounter').text(" (" + needsReviewed + " points)");
      layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
    }
  }); 
  
  var finishedpts = L.esri.featureLayer({
    url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "FCODE = '83044' AND STATE='NY' AND (EDITSTATUS = 2 OR EDITSTATUS = 3 OR EDITSTATUS = 4)",
          pointToLayer: function(feature, latlng) {
              return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                  icon: 'fa-check fa-2x',
                  shape: 'square',
                  markerColor:'yellow',
                  prefix: 'fa'}),
              },
            )},
            onEachFeature: function(feature, layer){
              finshed++;
              $('#finishedCounter').text(" (" + finshed  + " points)")
              layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>'); 
    } 
  });
  
  var unedited = L.layerGroup([uneditedpts]);
  var peerreview = L.layerGroup([peerreviewpts]);
  var finished = L.layerGroup([finishedpts]);

  var overlay = {
   "Unedited": unedited, 
   "Peer Review": peerreview, 
   "Finished": finished
  }

/*featureLayer.addTo(map);*/ 


//Line 137 - 142 Is the variable that houses the basemap names. Two lines are commented out that reflect the two basemaps that are not currently being used for this challenge map. 
var basemaps = {
  "The Nationap Map + Aerial Imagery": imageryTopo,
  /*"The National Map Base Layer": nationalMap,*/
  // "USDA NAIP": usdaNAIP,
};

var map = L.map('map',{
	layers: [national,unedited,peerreview,finished],
	'maxBounds': bounds 
}) .setView([38.005358, -79.154932], 6);

// custom zoom layer so as not to push past a certian level 

map.zoomControl.setPosition('bottomright')

L.control.layers(basemaps, overlay, {
  position: 'topright'
}).addTo(map);
