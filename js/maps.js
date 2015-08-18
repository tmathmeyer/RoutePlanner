// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

function initialize() {

  var markers = {};
  var pins = [];
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(48.2902, -122.2631),
      new google.maps.LatLng(47.2474, -122.1759));
  map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    if (isPinEditPhase()) {
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        name: XXH(event.latLng.A + "" + event.latLng.F, 0xDEAD ).toString(16),
        isPassenger: true,
        icon: 'img/person.png'
      })
      markers[marker.name] = marker;
      displayMarker(marker);
    }
  });

  drawPolyLine = function(f, t) {
    var a = getMarkers(f);
    var b = getMarkers(t);

    regPin(f, t, new google.maps.Polyline({
      path: [
        a.position,
        b.position
      ],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })).setMap(map);
  }

  regPin = function(f, t, pin) {
    pins[f+""+t] = pin;
    return pin;
  }

  clearAllPins = function() {
    pins.forEach(function(each){
      each.setMap(null);
    });
    pins = [];
  }

  getMarkers = function(name_huh) {
    if (name_huh == null) {
      return markers;
    }
    return markers[name_huh];
  }

  setMarker = function(name, marker) {
    markers[name] = marker;
  }

  deletePin = function(name) {
    markers[name].setMap(null);
    delete markers[name];

    $("#pinElement-"+name).remove();
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
