/*global $, L*/

var gjLayerTab = [],
    layerCount = 0;
var lat = 47.5;
var lon = -71.214153;
var zoom = 6;

var flickerApiKey = "ed39a00efad587afc2cb3e249043ad67";

var licenses;
// Récupération des licences flickr
$.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key=" + flickerApiKey + "&format=json&nojsoncallback=1",
    function (data) {
        licenses = data.licenses;
    });

var mwjs = new MediaWikiJS({baseURL: 'https://commons.wikimedia.org', apiPath: '/w/api.php'});

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
};
	
var geojsonMarkerOptions3 = {
    radius: 8,
    fillColor: "#0de51c",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
	
var geojsonMarkerOptions4 = {
    radius: 8,
    fillColor: "#fcf400",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var geojsonMarkerOptions5 = {
    radius: 8,
    fillColor: "#db3c0c",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var geojsonMarkerOptions6 = {
    radius: 8,
    fillColor: "#dd2db4",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Récupere les données sur wikimedia
function getWikimedia(nom, coord) {
  var div = $("#wikimedia");
  div.html('<img src="img/loading-spokes.svg" alt="Loading icon" width=64 class="center-block"/>');
  div.append('<h3 class="text-center">Chargement...</h3>');
    mwjs.send({action: 'query', list: 'allimages', aiprefix: nom, aiprop: "url|extmetadata" }, function (data) {
        var images  = data.query.allimages;
        if (images.length > 0) {
            div.html("<h1>Wikimedia</h1> <hr/>");
            images.forEach(function (image) {
                var imgmeta = image.extmetadata;
                div.append("<h3>" + image.name + "</h3>");
                div.append('<img src="' + image.url + '" style="max-width:50%" ><br/>');
                div.append(imgmeta.Artist.value + ', ' + imgmeta.DateTimeOriginal.value + ' <a href="' + imgmeta.LicenseUrl.value + '">' + imgmeta.License.value + '</a>');
            });
        } else {
            div.html('<h3 class="text-center" >Aucune image disponible.</h3>');
        }
      
    });
    $("#tg-wikimedia").off("click");
}

function getFlickr(nom, coord) {
    var div = $("#flickr");
    div.html('<img src="img/loading-spokes.svg" alt="Loading icon" width=64 class="center-block"/>');
    div.append('<h3 class="text-center">Chargement...</h3>');
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickerApiKey + "&lat=" + coord[1] + "&lon=" + coord[0] + "&radius=0.05&format=json&nojsoncallback=1",
        function (data) {
            var photos = data.photos.photo;
            if (photos.length > 0) {
                div.html('<br><h1>Photos de Flickr: ' + nom + '</h1><hr>');
                photos.forEach(function (photo) {
                    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + flickerApiKey + "&photo_id=" + photo.id + "&format=json&nojsoncallback=1",
                        function (data) {
                            var phinfo = data.photo,
                                photourl = "https://farm" + phinfo.farm + ".staticflickr.com/" + phinfo.server + "/" + phinfo.id + "_" + phinfo.secret + ".jpg";
                            div.append("<h3>" + phinfo.title._content + "</h3>");
                            div.append('<img src="' + photourl + '" style="max-width:50%" ><br/>');
                        
                            // Autheur de la photo
                            var ownerName = "";
                            if (phinfo.owner.realname !== "") {
                                ownerName = phinfo.owner.realname;
                            } else {
                                ownerName = phinfo.owner.username;
                            }
                        
                            // Récupération de la licence
                            var license = licenses.license[phinfo.license];
                        
                            if (phinfo.license === 0) {
                                license.url = "#";
                            }

                            div.append(ownerName + ', ' + phinfo.dates.taken + ' <a href="' + license.url + '">' + license.name + '</a> ');
                        });
                });
            } else {
                div.html('<h3 class="text-center" >Aucune image disponible.</h3>');
            }
        });
    $("#tg-flickr").off("click");
}

function resetModal() {
    $("#rpcq").empty();
    $("#wikimedia").empty();
    $("#flickr").empty();
    $(".toggler").removeClass("active");
}

// Contenu des popups 
function onEachFeature(feature, layer) {
    var nom = feature.properties.nom_bien,
        categorie = feature.properties.categorie,
        classement = feature.properties.statut_juridique,
        region = feature.properties.region_admin,
        image = feature.properties.url_photo,
        url = feature.properties.url_rpcq,
        licence = feature.properties.licence_photo,
        auteur = feature.properties.auteur_photo,
        annee = feature.properties.date_licence_photo,
        detenteur = feature.properties.detenteur_photo,
        coord = feature.geometry.coordinates;

    layer.bindPopup($('<a href="#mymodal" data-toggle="modal">' + nom + '</a>').click(function () {
        resetModal();
        $('#info').html('<h1>' + nom + '</h1><a href="' + url + '">' + url + '</a><p>Catégorie : ' + categorie + '<br>Statut juridique : ' + classement + '<br>Région : ' + region + '</p>');
        if (image !== "NULL") {
            $('#rpcq').html('<img src="' + image + '" style="max-width:90%;"><br><span class="copyright">' + licence + annee + '</span>');
        } else {
            $("#rpcq").html('<h3 class="text-center" >Aucune image disponible.</h3>');
        }

        $("#tg-wikimedia").on("click", function () { getWikimedia(nom, coord); });
        $("#tg-flickr").on("click", function () { getFlickr(nom, coord); });
    })[0]);

}

//Ajout des layers au control
function ajoutcontrol(gjLayerTab) {
    var layerControl = L.control.layers(null, gjLayerTab);
    map.addControl(layerControl);
}
	
//Préparer l'ajout des layers au control
function ajoutlayer(gjLayer, nom) {
    if (layerCount < 5) {
        gjLayerTab[nom] = gjLayer;
        layerCount = layerCount + 1;
    } else {
        gjLayerTab[nom] = gjLayer;
        ajoutcontrol(gjLayerTab);
    }
}

		
// Usermarker
map.on("locationfound", function (location) {
    //if (!marker)
    var marker = L.userMarker(location.latlng, {pulsing: true}).addTo(map);

    marker.setLatLng(location.latlng);
    marker.setAccuracy(2000);
});
map.locate({
    watch: false,
    locate: true,
    setView: true,
    enableHighAccuracy: false
});


function getFoursquare(nom, coord) {

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
