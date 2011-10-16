function error(msg) {}

function success(position) {
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  	
  var myOptions = {
    zoom: 13,
    center: latlng,
    //mapTypeControl: false,
    MapTypeControlStyle: 'DROPDOWN_MENU',
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
		icon: '/images/marker_home.png',
    title: 'Home'
  });
  
  var infochimps_location = new google.maps.LatLng('30.273054','-97.757598');
  new google.maps.Marker({
    position: infochimps_location,
    map: map,
		icon: '/images/marker_infochimp.png',
    title: 'Infochimps'
  });
  
  //30.273054&g.longitude=-97.757598
  
  var lat = map.getCenter().lat();
  var lng = map.getCenter().lng();
  
  hospitals = near_home(position.coords.latitude,position.coords.longitude,30,function(hospitals) {
  	// sort by distance
  	hospitals.sort(function(a,b){return a.distance - b.distance;});
  	$.each(hospitals, function(i,hospital) {
  		if (i == 0) {
  			var hospital_location = new google.maps.LatLng(hospital['coordinates'][1], hospital['coordinates'][0]);
    		new google.maps.Marker({
					position: hospital_location,
					map: map,
					icon: '/images/marker_cluster.png',
					title:hospital['name']
				});
				
				$('#input_origin').val(position.coords.latitude+","+position.coords.longitude);
				$('#input_destination').val(hospital['coordinates'][1]+","+hospital['coordinates'][0]);
  		} else {
				var hospital_location = new google.maps.LatLng(hospital['coordinates'][1], hospital['coordinates'][0]);
    		new google.maps.Marker({
					position: hospital_location,
					map: map,
					icon: '/images/marker_firstaid.png',
					title:hospital['name']
				});
			}
		});
	});
}

function near_home(lat,long,miles,cb) {
	var url = "http://api.infochimps.com/geo/location/foursquare/places/search?g.radius="+miles_to_meters(miles)+"&g.latitude="+lat+"&g.longitude="+long+"&f.q=hospital&apikey=michaelminter-t_TKeMFkj0Ikn8ysSFFptcnlh69";
	var places = [];
	
	$.getJSON(url, function(data) {
    $.each(data['results'], function(i, place) {
    	if (place['name'].search(/veterinary|pet\s|animal/i) == -1) {
    		place['distance'] = distance(lat,long,place['coordinates'][1],place['coordinates'][0]);
    		places.push(place);
      }
  	});
  	cb(places);
	});
}

function miles_to_meters(miles) {
	var meters = miles * 1609.344;
	return meters;
}

function distance(lat1, lon1, lat2, lon2, unit) {
	//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
	//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
	//:::    unit = the unit you desire for results                               :::
	//:::           where: 'M' is statute miles                                   :::
	//:::                  'K' is kilometers (default)                            :::
	//:::                  'N' is nautical miles                                  :::
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist;
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success, error);
} else {
	error('Browser not supported');
}