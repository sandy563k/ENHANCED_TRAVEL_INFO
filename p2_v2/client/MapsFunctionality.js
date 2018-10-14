
//this method initiates map on loading
function initMap() {
  var markerArray = [];

  // Instantiating a directions service.
  var directionsService = new google.maps.DirectionsService;
  // Creating a map and centering it on Manhattan.
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: 40.771, lng: -73.974 }
  });

  // Creating a renderer for directions and binding it to the map.
  var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });

  function renderDirections(map, response, request) {
    response.request.travelMode = google.maps.TravelMode.DRIVING;
    request.travelMode = google.maps.TravelMode.DRIVING;
    typecastRoutes(response.routes);
    directionsDisplay.setOptions({
      directions: {
        routes: response.routes,
        request: request
      },
      draggable: true,
      map: map
    });
  }

  // Instantiating an info window to hold step text.
  var stepDisplay = new google.maps.InfoWindow;

  // Listening to change events from the start and end lists.sending ajax request to Node js
  var onChangeHandler = function () {
    var startTime;
    var endTime;
    var req = {};
    req.origin = document.getElementById('start').value;
    req.destination = document.getElementById('end').value;
    req.travelMode = 'driving';
    startTime = Date.now();
    console.log('startTime:' + startTime);

    $.ajax({
      type: 'POST',
      data: JSON.stringify(req),
      contentType: 'application/json',
      url: 'http://localhost:3000/routes/',
      success: function (data) {
        console.log('success');
        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        // Route the directions and pass the response to a function to create
        // markers for each step.
        document.getElementById('warnings-panel').innerHTML =
          '<b>' + data.routes[0].warnings + '</b>';
        //   directionsDisplay.setDirections(typecastRoutes(data.routes));
        data.request = req;
        data.request.travelMode = google.maps.TravelMode.DRIVING;
        renderDirections(map, data, req);
        // directionsDisplay.setDirections(data);
        showSteps(data, markerArray, stepDisplay, map);
        endTime = Date.now();
        //window.alert('total time to fetch the data' +endTime-startTime);
        console.log('endTime:' + endTime);
        console.log('startTime:' + startTime);
        console.log('totalTime:' + (endTime - startTime));

      },

      error: function (XMLHttpRequest, textStatus, errorThrown) {
        window.alert('Directions request failed due to ' + status);
      }
    });


  };
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);
}

// For each step, placing a marker, and adding the text to the marker's infowindow.
function showSteps(directionResult, markerArray, stepDisplay, map) {
  var myRoute = directionResult.routes[0].legs[0];
  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
      stepDisplay, marker, myRoute.steps[i].html_instructions, map);
  }
}

// attaching InstructionText to marker to show up onclick
function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function () {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    var startTime;
    var endTime;
    startTime=Date.now();
    var req = {};
    req.lat = marker.getPosition().lat();
    req.lng = marker.getPosition().lng();
    console.log('lat:' + req.lat + ' ' + 'lng:' + req.lng);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(req),
      contentType: 'application/json',
      url: 'http://localhost:3000/routes/weather/',
      success: function (data) {
        endTime=Date.now();
        console.log('weather totalTime:'+(endTime-startTime));
        console.log('success');
        stepDisplay.setContent('<b>Direction Instructions: </b>'+text + '\n \n  <b>WeatherInfo</b>: ' + data);
        stepDisplay.open(map, marker);
      },

      error: function (XMLHttpRequest, textStatus, errorThrown) {
        stepDisplay.setContent(text + ' ' + 'weatherinfo NA');
        stepDisplay.open(map, marker);
      }


    });
  });
}



//typecasting routes to ensure server response compatibility with client  

function typecastRoutes(routes) {
  routes.forEach(function (route) {
    route.bounds = asBounds(route.bounds);
    route.overview_path = asPath(route.overview_polyline);

    route.legs.forEach(function (leg) {
      leg.start_location = asLatLng(leg.start_location);
      leg.end_location = asLatLng(leg.end_location);

      leg.steps.forEach(function (step) {
        step.start_location = asLatLng(step.start_location);
        step.end_location = asLatLng(step.end_location);
        step.path = asPath(step.polyline);
      });

    });
  });
}

function asBounds(boundsObject) {
  return new google.maps.LatLngBounds(asLatLng(boundsObject.southwest),
    asLatLng(boundsObject.northeast));
}

function asLatLng(latLngObject) {
  return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
}

function asPath(encodedPolyObject) {
  return google.maps.geometry.encoding.decodePath(encodedPolyObject.points);
}

















