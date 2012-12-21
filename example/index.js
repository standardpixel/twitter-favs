var SP = {};

SP.transactions   = {};
SP.response_cache = {};

(function() {
	
	YUI().use('node','querystring', function(Y) {
		
		var mercator = d3.geo.mercator();
		
		function tell(what) {
			Y.one('#console_display .dropbox').append('<li>' + what + '</li>');
			
			if(what === 'Done.') {
				Y.one('#console_display .loader').setStyle('display','none');
			}
		}
		
		tell('Started.');
		
		function getCoordinateArray(flickr_api_photo_list) {
		
			if(!Y.Lang.isObject(flickr_api_photo_list)) {
				return false;
			} else {
				var array_out = [];
				for(var i=0 in flickr_api_photo_list) {
					if(flickr_api_photo_list.hasOwnProperty(i)) {
							array_out.push([flickr_api_photo_list[i].longitude, flickr_api_photo_list[i].latitude]);
					}
				}
				return array_out;
			}
		
		}
		
		function callMethod(method_name, params, callback, scope) {
			var scope = scope || this;
			var method_key = method_name.replace(/\./g,'_');
			
			SP.transactions[method_key] = function(r) {SP.response_cache[method_key]=r}
			var params_string = '&' + Y.QueryString.stringify(params) + '&';
			Y.Get.js('http://api.flickr.com/services/rest/?method='+method_name+'&api_key=6ded95f2901a334b25f2b058751c5012'+params_string+'format=json&jsoncallback=SP.transactions.'+method_key, function (err) {
			    if (err) {
			        Y.Array.each(err, function (error) {
			            Y.log('Error loading JS: ' + error.error, 'error');
						tell('Not able to connect to the Flickr API. Im quitting.');
			        });
				
			        return;
			    }
				
				if (SP.response_cache[method_key].stat === 'fail') {
					console.error('Flickr API error',SP.response_cache[method_key].message);
					tell('Flickr api crapped out for some reason. Im quitting.');
					return;
				}
				
				callback.apply(scope, [SP.response_cache[method_key]]);
			});
		}
		
		function getFlickrPointsForWoeId(woe_id, callback, scope) {
			var scope = scope || this;
			
			tell('getting info for ' + woe_id);
			
			callMethod('flickr.places.getInfo', {woe_id:woe_id}, function(r) {
				
				var woe = r.place;
				
				tell('looks like ' + woe_id + ' is ' + woe.woe_name + ', I\'ll call it that for now on.');
				
				if(Y.Lang.isObject(woe)) {
					tell('Getting Flickr photos for '+woe.woe_name);
					callMethod('flickr.photos.search', {
						woe_id:woe_id,
						extras:"geo"
					}, function(r) {
						tell('Found ' + r.photos.photo.length + ' photos in ' + woe.woe_name);
						callback.apply(scope, [{woe:woe,photos:r.photos.photo}]);
					});
				} else {
					console.error('woe_id: ' + woe_id + 'was not found');
				}
				
			}, this);
		}
		
		function getPointForCoordinate(coordinates_array) {
			var point_array = mercator(coordinates_array);
			return point_array;
		}
		
		function drawShape(vertices) {
			//
			// This funciton is https://gist.github.com/1552725
			// using it to learn how D3 does alpha shapes
			//
			var w = 960,
			    h = 500,
			    alpha = 50,
    
			    offset = function(a,dx,dy) {
			        return a.map(function(d) { return [d[0]+dx,d[1]+dy]; });
			    },

			    dsq = function(a,b) {
			        var dx = a[0]-b[0], dy = a[1]-b[1];
			        return dx*dx+dy*dy;
			    },

			    asq = alpha*alpha,

			    // well, this is where the "magic" happens..
			    mesh = d3.geom.delaunay(offset(vertices,600,0)).filter(function(t) {
			        return dsq(t[0],t[1]) < asq && dsq(t[0],t[2]) < asq && dsq(t[1],t[2]) < asq;
			    });

			var svg = d3.select("body")
			  .append("svg")
			    .attr("width", w)
			    .attr("height", h)
			    .attr("class", "Blues");

			svg.append("g")
			  .selectAll("circle")
			    .data(vertices)
			  .enter().append("circle")
			    .attr("r", 3)
			    .attr("cx", function(d) { return d[0]; })
			    .attr("cy", function(d) { return d[1]; });
    
			svg.append("g")
			  .selectAll("path")
			    .data(d3.geom.delaunay(offset(vertices,300,0)))
			  .enter().append("path")
			    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

			svg.append("g")
			  .selectAll("path")
			    .data(mesh)
			  .enter().append("path")
			    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
				
			tell('Done.');
		}
		
		//sf 2487956
		getFlickrPointsForWoeId(23424977 /*usa*/, function(r) {
			var coordinate_array = getCoordinateArray(r.photos),
			    point_array      = [];
			
			tell('Converting coordinates to mercator ponts');
			for(var i=0, l=coordinate_array.length; l > i; i++) {
				point_array.push(getPointForCoordinate(coordinate_array[i]));
			}
			
			tell('Drawing a shape for ' + r.woe.woe_name);
			
			drawShape(point_array);

		}, this);
	});
	console.log('index.js loaded');
})();