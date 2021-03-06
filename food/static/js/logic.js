// Creating map object
var map = L.map("map", {
  center: [37.2758953, -104.6528618],
  zoom: 5
});
//need to remove this before deployment
const API_KEY = "pk.eyJ1IjoibnN3ZWhsaSIsImEiOiJjazVnMnc2ZHowM244M2pxbTFlYWhzMXVwIn0.0CxW_QdppTZUjpTaUh8-dQ"

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

//Connecting to the endpoint
var url = "/api/data/access";
d3.json(url, function (data) {
  console.log(data)

  searchid = "1011";


  function findFIPS(d) {

    return d.FIPS.toString() == searchid;
  }


  results = data.filter(findFIPS);

  console.log("TEST");
  console.log(results[0].County);

});


//connecting to the counties geojson data
var link = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";


d3.json(link, function (data) {
  console.log(data)
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function (feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "grey",
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function (event) {
          map.fitBounds(event.target.getBounds());
          console.log(feature.id)
        }
      });
      // Giving each feature a pop-up with information pertinent to it

      countyName = feature.properties.NAME
      layer.bindPopup("<h1>" + countyName + "</h1> <hr> <h2>" + "Testing" + "</h2>");

    }
  }).addTo(map);
});

