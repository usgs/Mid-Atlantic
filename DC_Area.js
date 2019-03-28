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
		  where: "FCODE= '83044' AND (STATE ='VA' OR STATE='DE' OR STATE='MD')",
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
	
	
// Count 
	link = $.ajax({
		url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0/query?where=FCODE+%3D+%2783044%27+AND+STATE+in+%28%27VA%27%2C+%27DE%27%2C+%27DC%27%2C%27MD%27%29&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=EDITSTATUS&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22EDITSTATUS%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22count%22%0D%0A++%7D%0D%0A%5D&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=html&__ncforminfo=r3LkqYjqFEbHVpCWR5wtkw_H47NFamSq8STnJ6PM0kAV_iNkHEUgPP0lXSGnOmUrwF8U-GZWRBDVIGvr2eU3EXwVxmfYXPzAE57hNvw0kG1d9RZfikKdg0gL3L2AtWcotxVYCnvaWkM_pQGokwABQgULyTb2Bmb1iISLpBFvIicTEplHc0Gm4G2pDThdAxEs5IH5S-qIoxe3GxytIbn1gtXqZG9T7CjgzzuVVvoJnv05nuMktdFEG2n7OOao0Kf-VbTa9e8yPRDxJmL9Sd2er87iXsO5LTp7xn8RVIN-nSiAOEHqh_N3FjiRuK-OfD4XpF7A1HGlAZR9Fl4QF9CLnTGzxtxdTHtm8GT1umhdHnwTMn8vBfd-KSzhZcALcpFOgLk6PN9nMCsJ0FElkTnbmeyTCz_lvfq26QL52Z-1n8HURWiAWHOfDwRJbDCRhPK1iOnqgLn6hY3rqBobxs61qRhcw2r2fjBbnuOcMXl6N27MQO8p4MMQ7wznFtjPp0WMoQK44R5XUPoTY0ZVm_FQZ_S_rKMacHCHD_yp-p1TtznqGrl-ijBFIJ2G8ku0KjfCvl_-kjdLC5XOpUGi2TC_mRUsDX1SHTK1wtN9DiL2zG6_iMs1NTQElQ%3D%3D"
	}); 
	function countStatus(link){
		return url
	};
	console.log(countStatus);

			
// Lines 96 - 98 Is your bounding box, for the area you wish to focus the map. 					 
var southWest = L.latLng(31.427153, -88.204519), // updated March 2019  
  northEast = L.latLng(47.021951, -68.569633),
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
}) .setView([38.005358, -79.154932], 6);

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
/*$("#finished").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS > 1"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});*/

/*$("#tobechecked").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS = 0"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});*/

/*$("#tobepeerreviwed").click(function(){
	var where =featureLayer.getWhere();
        var condition = " and EDITSTATUS = 1"
	if(!where.includes(condition)){
          $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
          $(this).find("i").attr('class', 'fa fa-eye-slash');
          featureLayer.setWhere(where + condition)
        } else {
	  featureLayer.setWhere(where.split(condition)[0])
	}
});*/
//Lines 216 - 224 This block of code controls the icons in the legend and allows users to turn them on and off and see only that layer. 
 /*$(".markers-legend").hover(function(){
   $(this).css('cursor', 'pointer');
   original = $(this).find("i").attr('class');
   $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
   $(this).find("i").attr('class', 'fa fa-eye-slash');
 }, function(){
   $(this).removeAttr('style');
   $(this).find('i').attr('class', original);
 })*/
 
//Alert Turned off all three layers 

