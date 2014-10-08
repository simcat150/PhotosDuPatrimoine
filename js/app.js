var lat=47.5
var lon=-71.214153
var zoom=6

var mwjs = MediaWikiJS({baseURL: 'https://commons.wikimedia.org', apiPath: '/w/api.php'});

var map = L.map('map').setView([lat, lon], zoom);


L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
		
	//style des markers
	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};
	
	var geojsonMarkerOptions2 = {
		radius: 8,
		fillColor: "#0d96e5",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	}
	
	var geojsonMarkerOptions3 = {
		radius: 8,
		fillColor: "#0de51c",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	}
	
	var geojsonMarkerOptions4 = {
		radius: 8,
		fillColor: "#fcf400",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	}

	// Contenu des popups 
	function onEachFeature(feature, layer) {   
		
		var nom = feature.properties.Nom;
		var categorie = feature.properties.Categorie;
		var region = feature.properties.Region;
		var image = feature.properties.URL_image;
		var url = feature.properties.URL_RPCQ;
		var droits = feature.properties.Droits_image;
		var coord = feature.geometry.coordinates
		  
		layer.bindPopup($('<a href="#" data-reveal-id="myModal">'+nom+'</a>').click(function(){
			if (image.length>0){
				document.getElementById('rpcq').innerHTML = '<h1>'+nom+'</h1><p>'+categorie+'<br>'+region+'</p>Photo du RPCQ :<hr><a href="'+url+'"><img src="'+image+'" style="max-width:90%;"></a><br><span class="copyright">'+droits+'</span><a class="close-reveal-modal">&#215;</a>';
			}else{
				document.getElementById('rpcq').innerHTML = '<h1>'+nom+'</h1><p>'+categorie+'<br>'+region+'</p><a class="close-reveal-modal">&#215;</a>';
			}

    getWikimedia(nom, coord);
		getFlickr(nom, coord);
		getFoursquare(nom, coord);
		})[0]);
		
	}	

// Loader en ajax chacun des 4 fichiers	

	// 1
	$.getJSON("FichiersGeoJSON/GeoJSON_MCC_IP_CI.json", function(data) {

		 var geojsonLayer = new L.GeoJSON(data, { 
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions);
			},
			 onEachFeature: onEachFeature

		});	
		var nom = 'Immeubles patrimoniaux cités';	
		map.addLayer(geojsonLayer);	
		ajoutlayer(geojsonLayer, nom);
	});
	

	// 2
	$.getJSON("FichiersGeoJSON/GeoJSON_MCC_IP_CL.json", function(data) {
		
		var geojsonLayer2 = new L.GeoJSON(data, { 
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions2);
			},
			 onEachFeature: onEachFeature

		});	
		var nom = 'Immeubles patrimoniaux classés';
	//	map.addLayer(geojsonLayer2);			
		ajoutlayer(geojsonLayer2, nom);
	});
	
	// 3
	$.getJSON("FichiersGeoJSON/GeoJSON_MCC_SP_CI.json", function(data) {
		
		var geojsonLayer3 = new L.GeoJSON(data, { 
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions3);
			},
			 onEachFeature: onEachFeature

		});	
		var nom = 'Sites patrimoniaux cités';
	//	map.addLayer(geojsonLayer3);			
		ajoutlayer(geojsonLayer3, nom);
	});
	
	// 4
	$.getJSON("FichiersGeoJSON/GeoJSON_MCC_SP_CL.json", function(data) {
		
		var geojsonLayer4 = new L.GeoJSON(data, { 
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions4);
			},
			 onEachFeature: onEachFeature

		});	
		var nom = 'Sites patrimoniaux déclarés';
	//	map.addLayer(geojsonLayer4);			
		ajoutlayer(geojsonLayer4, nom);
	});
	
	//Préparer l'ajout des layers au control
	gjLayerTab=new Array();
	i=0;
	function ajoutlayer(gjLayer, nom){
		
		if (i<3){
			gjLayerTab[nom]=gjLayer;
			//alert (gjLayerTab[0]);
			i++;
		}
		else{
			gjLayerTab[nom]=gjLayer;
			ajoutcontrol(gjLayerTab);
		}
		
	};
	
	//Ajout des layers au control
	function ajoutcontrol(gjLayerTab){	
		
		
		var layerControl = L.control.layers(null,gjLayerTab);
        map.addControl(layerControl);
	}
	
	
	// Usermarker
	map.on("locationfound", function(location) {
		//if (!marker)
			marker = L.userMarker(location.latlng,{pulsing:true}).addTo(map);

		marker.setLatLng(location.latlng);
		marker.setAccuracy(2000);
	});
	map.locate({
		watch: false,
		locate: true,
		setView: true,
		enableHighAccuracy: false
	});


// Récupere les données sur wikimedia
function getWikimedia(nom, coord){
  mwjs.send({action: 'query', list: 'allimages', aiprefix: nom, aiprop: "url|extmetadata" }, function (data) {
    var images  = data.query.allimages;
    var div = $("#wikimedia");
    if(images.length > 0){
      div.html("<h1>Wikimedia</h1> <hr/>");
      images.forEach(function(image){
        div.append("<h2>"+image.name+"</h2>");
        div.append('<img src="'+image.url+'" style="width:50%" ><br/>');
        div.append(image.extmetadata.Artist.value +' '+ image.extmetadata.DateTimeOriginal.value +' <a href="'+image.extmetadata.LicenseUrl.value+'">'+image.extmetadata.License.value+'</a>');
      });
    }
    else
      $("#wikimedia").html("");
      
  });
}

function getFlickr (nom, coord){
  // TODO Ici appeler Flickr
  //document.getElementById('flickr').innerHTML = '<br>Photos de Flickr: '+nom+'<hr>';	
  //$.getJSON("http://api.flickr.com/services/rest/?method=flickr.test.echo&name=", function(data) {
  //	alert (data);
  //});
}

function getFoursquare (nom, coord){

  // TODO Ici appeler Foursquare	
  /*$.getJSON("https://api.foursquare.com/v2/venues/search?ll="+coord+"&radius=10&intent=checkin&client_id=ICI_METTRE_CLIENT_ID&client_secret=ICI_METTRE_CLIENT_SECRET&v=20120321", function(data) {

    for (var i=0;i<data.response.venues.length;i++){
    identifiant= data.response.venues[i].id;

    $.getJSON("https://api.foursquare.com/v2/venues/"+identifiant+"/photos?client_id=ICI_METTRE_CLIENT_ID&client_secret=ICI_METTRE_CLIENT_SECRET&v=20120321", function(data) {

    for (var b=0;b<data.response.photos.groups.length;b++){

  //	for (var c=0;c<data.response.photos.groups[b].items.length;c++){
  if(data.response.photos.groups[b].items.length>1){
  var images = data.response.photos.groups[b].items[1].url;
  var imagefs = imagefs+images;

  //}
  }

  document.getElementById('foursquare').innerHTML = '<br>Photos de Foursquare : '+nom+'<hr>'+imagefs+'';

  }		
  });

  };
  });*/
}
