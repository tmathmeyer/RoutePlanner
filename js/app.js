var setPanelContent = function(content) {
  console.log("setPanelContent not initialized");
}
var deletePin = function(name) {
  console.log("deletePin(name) not initialized");
}
var isPinEditPhase = function() {
  return false;
}

$("document").ready(function(){
  var panelDom = $("#information-panel");
  setPanelContent = function(content) {
    panelDom.html(content);
  }

  setPanelContent(ich.createTrip());
});

planRoute = function() {
  isPinEditPhase = function(){
    return false;
  }
  setPanelContent(ich.routeDecider());
  var driverlist = $("#drivers");
  var passengerlist = $("#passengers");
  var markers = getMarkers();
  Object.keys(markers).forEach(function(each){
    if (markers[each].isPassenger) {
      passengerlist.append(ich.routeDeciderPassenger(markers[each]));
    } else {
      driverlist.append(ich.routeDeciderDriver(markers[each]));
    }
  })
}

newTrip = function(){
  // call some ajax thing
  setPanelContent(ich.tripPinCreator());
  isPinEditPhase = function(){
    return true;
  }
}

displayMarker = function(marker){
  $("#pinList").append(ich.tripPinElement(marker));
  $("#placeholdermessage").hide();
}

setPassenger = function(name) {
  $("#driver-"+name).removeClass("selected").addClass("unselected");
  $("#passenger-"+name).removeClass("unselected").addClass("selected");
  var marker = getMarkers(name);
  marker.isPassenger = true;
  marker.icon = ('img/person.png');
  marker.setMap(marker.map);
  setMarker(name, marker);
}

setDriver = function(name) {
  $("#passenger-"+name).removeClass("selected").addClass("unselected");
  $("#driver-"+name).removeClass("unselected").addClass("selected");
  var marker = getMarkers(name);
  marker.isPassenger = false;
  marker.icon = ('img/car.png');
  marker.setMap(marker.map);
  setMarker(name, marker);
}

allowDrop = function (ev) {
  ev.preventDefault();
}

drag = function (ev) {
  ev.dataTransfer.setData("dragid", ev.target.id);
  ev.dataTransfer.setData("dragname", ev.target.getAttribute("name"));
}

drop = function (ev) {
  ev.preventDefault();
  var list = $("#"+ev.target.id+"-list");
  list.append($("#"+ev.dataTransfer.getData("dragid")));
  $("#"+ev.target.id).css("max-height", (list.children().length + 1) * 51);
  redrawAllPaths();
}

redrawAllPaths = function() {
  clearAllPins();
  var drivers = $("#drivers");
  var alldrivers = drivers.children();
  alldrivers.each(function(){
    var seed = this.getAttribute("name");
    $(this).children("ul").each(function(){
      $(this).children().each(function(){
        var next = this.getAttribute("name");
        drawPolyLine(seed, next);
        seed = next;
      })
    });
  });
}
