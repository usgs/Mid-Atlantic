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
var featureLayer = L.esri.clusteredFeatureLayer({
          chunkedLoading: true,
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
		  where: "FCODE= '74034' and STATE ='TX'",
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
        });
// Lines 96 - 98 Is your bounding box, for the area you wish to focus the map. 					 
var southWest = L.latLng(25.8373770, -106.6456460), 
  northEast = L.latLng(36.5007040, -93.5082920),
  bounds = L.latLngBounds(southWest, northEast);

/*
Lines 100 - 117 Are commented out; but consist of zoom controls for the other basemaps not used in this specific basema
var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 0,
  'maxZoom': 13,
  'maxBounds': bounds
}).setView([40.63, -77.84], 7);

var basemap = L.map('basemap',{
	layers: [usdaNAIP],
	'zoomControl': false,
	'minZoom': 14, 
	'maxZoom':19, 
	'maxBounds': bounds
}) .setView([40.63, -77.84], 7);
/* Lines 120 - 125 The map variable creates a container for the code, that also involves the two basemaps that are being used in the application.
*/

var map = L.map('map',{
	layers: [national,usda],
	'maxBounds': bounds 
}) .setView([40.63, -77.84], 6);

featureLayer.addTo(map); 

//zoom custom position
/*
Lines 127 - 133 These commented out lines are old code from the previous map challenge; this code is being kept for historical information
L.control.zoom({
  position: 'topright'
}).addTo(map);
*/ 
// custom zoom layer so as not to push past a certian level 
map.zoomControl.setPosition('bottomright')
//Line 137 - 142 Is the variable that houses the basemap names. Two lines are commented out that reflect the two basemaps that are not currently being used for this challenge map. 
var basemaps = {
  "The National Map Base Layer": nationalMap,
  "The Nationap Map + Aerial Imagery": imageryTopo,
  // "USDA NAIP": usdaNAIP,
 // "The National Map Imagery": imagery2 
};
// Lines 144 - 146 These lines create a button on the web map that allows a user to select which basemap they want to use. 
L.control.layers(basemaps, null, {
  position: 'topright'
}).addTo(map);
/*
Lines 147 - 178 These lines are commented out and are old code for data, basemaps layers and pointing to the layer being used. 
$("#finished").click(function(){
	var where =featureLayer.getWhere();
	if(!where.includes("and EDITSTATUS > 1")){
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
		featureLayer.setWhere(featureLayer.getWhere().split(" and EDITSTATUS > 1")[0])
	}
	}); */
/*
      $.getJSON("./data/finished.json", function(data) {
        finished = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-check fa-2x',
                shape: 'square',
                markerColor: 'green-light',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(finished)
      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-check');
// Lines 180 - 214 This block of code is for the different point groups and the number associated with that grouping of points per the endpoint API. 
$("#finished").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS > 1"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});

$("#tobechecked").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS = 0"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});

$("#tobepeerreviwed").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS = 1"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});
//Lines 216 - 224 This block of code controls the icons in the legend and allows users to turn them on and off and see only that layer. 
 $(".markers-legend").hover(function(){
   $(this).css('cursor', 'pointer');
   original = $(this).find("i").attr('class');
   $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
   $(this).find("i").attr('class', 'fa fa-eye-slash');
 }, function(){
   $(this).removeAttr('style');
   $(this).find('i').attr('class', original);
 })
