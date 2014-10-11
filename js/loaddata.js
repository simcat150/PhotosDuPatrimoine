/*global $, L*/

// Loader en ajax chacun des 4 fichiers	

// 1
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_IP_CI_v3.json", function (data) {

    var geojsonLayer = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Immeubles patrimoniaux cités';
    map.addLayer(geojsonLayer);
    ajoutlayer(geojsonLayer, nom);
});


// 2
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_IP_CL_v5.json", function (data) {
    var geojsonLayer2 = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions2);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Immeubles patrimoniaux classés';
    ajoutlayer(geojsonLayer2, nom);
});

// 3
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_CI_v3.json", function (data) {
    var geojsonLayer3 = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions3);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Sites patrimoniaux cités';			
    ajoutlayer(geojsonLayer3, nom);
});

// 4
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_CL_v5.json", function (data) {

    var geojsonLayer4 = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions4);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Sites patrimoniaux classés';
    ajoutlayer(geojsonLayer4, nom);
});

// 5
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_D_LPC_v1.json", function (data) {

    var geojsonLayer5 = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions5);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Sites patrimoniaux déclarés par la loi';
    ajoutlayer(geojsonLayer5, nom);
});

// 6
$.getJSON("FichiersGeoJSON/Donnees_ouvertes_MCC_SP_D_v5.json", function (data) {

    var geojsonLayer6 = new L.GeoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions6);
        },
        onEachFeature: onEachFeature

    }),
        nom = 'Sites patrimoniaux déclarés';
    ajoutlayer(geojsonLayer6, nom);
});
