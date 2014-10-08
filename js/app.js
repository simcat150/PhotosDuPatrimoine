var lat=47.5
var lon=-71.214153
var zoom=6

var flickerApiKey = "ed39a00efad587afc2cb3e249043ad67";
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
		
		var nom = feature.properties.nom_bien;
		var categorie = feature.properties.categorie;
		var classement = feature.properties.statut_juridique;
		var region = feature.properties.region_admin;
		var image = feature.properties.url_photo;
		var url = feature.properties.url_rpcq;
		var licence = feature.properties.licence_photo;
		var auteur = feature.properties.auteur_photo;
		var annee = feature.properties.date_licence_photo;
		var detenteur = feature.properties.detenteur_photo;
		var coord = feature.geometry.coordinates
		  
		layer.bindPopup($('<a href="#" data-reveal-id="myModal">'+nom+'</a>').click(function(){
			if (image.length>0){
				document.getElementById('rpcq').innerHTML = '<h1>'+nom+'</h1><a href="'+url+'">'+url+'</a><p>Catégorie : '+categorie+'<br>Statut juridique : '+classement+'<br>Région : '+region+'</p><h1>Photo du Répertoire du patrimoine culturel du Québec :</h1><hr><img src="'+image+'" style="max-width:90%;"><br><span class="copyright">'+licence+annee+'</span><a class="close-reveal-modal">&#215;</a>';
			}else{
				document.getElementById('rpcq').innerHTML = '<h1>'+nom+'</h1><a href="'+url+'">'+url+'</a><p>Catégorie : '+categorie+'<br>Statut juridique : '+classement+'<br>Région : '+region+'</p><a class="close-reveal-modal">&#215;</a>';
			}

    getWikimedia(nom, coord);
		getFlickr(nom, coord);
		getFoursquare(nom, coord);
		})[0]);
		
	}	

// Loader en ajax chacun des 4 fichiers	

	// 1
	$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_IP_CI_v3.json", function(data) {

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
	$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_IP_CL_v5.json", function(data) {
		
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
	$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_CI_v3.json", function(data) {
		
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
	$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_CL_v5.json", function(data) {
		
		var geojsonLayer4 = new L.GeoJSON(data, { 
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions4);
			},
			 onEachFeature: onEachFeature

		});	
		var nom = 'Sites patrimoniaux classés';
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
        div.append("<h3>"+image.name+"</h3>");
        div.append('<img src="'+image.url+'" style="width:50%" ><br/>');
        div.append(image.extmetadata.Artist.value +', '+ image.extmetadata.DateTimeOriginal.value +' <a href="'+image.extmetadata.LicenseUrl.value+'">'+image.extmetadata.License.value+'</a>');
      });
    }
    else
      $("#wikimedia").html("");
      
  });
}

function getFlickr (nom, coord){
  // TODO Ici appeler Flickr
  var div = $("#flickr");
  $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+flickerApiKey+"&lat="+coord[1]+"&lon="+coord[0]+"&radius=0.05&format=json&nojsoncallback=1", 
  function(data) {
    var photos = data.photos.photo;
    if(photos.length > 0){
      div.html('<br><h1>Photos de Flickr: '+nom+'</h1><hr>');	
      photos.forEach(function(photo){
        $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+flickerApiKey+"&photo_id="+photo.id+"&format=json&nojsoncallback=1", 
          function(data){
            div.append("<h3>"+data.photo.title._content+"</h3>");
            // div.append('<img src="'+data.photo.urls.url[0]._content+'" style="width:50%" ><br/>');
            console.log(data);
          });
      });
    }
    else
      div.html("");
  });
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
