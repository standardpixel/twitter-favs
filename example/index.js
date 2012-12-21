var SP = {};

SP.transactions = {};

function jsonFlickrApi(r) {
	SP.transactions.photosearch=r;
	
}

(function() {
	
	YUI().use('node', function(Y) {
		
		var mercator = d3.geo.mercator();
		
		function tell(what) {
			Y.one('#console_display').append('<li>' + what + '</li>');
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
		
		function getFlickrPointsForWoeId(woe_id, callback, scope) {
			var scope = scope || this;
			tell('Getting Flickr photos for '+woe_id+'...');
			Y.Get.js('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6ded95f2901a334b25f2b058751c5012&woe_id='+woe_id+'&format=json&stpxid=photosearch&extras=geo', function (err) {
			    if (err) {
			        Y.Array.each(err, function (error) {
			            Y.log('Error loading JS: ' + error.error, 'error');
			        });
				
			        return;
			    }
				
				tell('Found ' + SP.transactions.photosearch.photos.photo.length + ' photos in ' + woe_id);
				callback.apply(scope, [SP.transactions.photosearch]);
			});
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
		
		getFlickrPointsForWoeId(2487956, function(r) {
			var coordinate_array = getCoordinateArray(r.photos.photo),
			    point_array      = [];
			
			tell('Converting coordinates to mercator ponts');
			for(var i=0, l=coordinate_array.length; l > i; i++) {
				point_array.push(getPointForCoordinate(coordinate_array[i]));
			}
			
			tell('Drawing shape for ' + 2487956);
			drawShape(point_array);

		}, this);
	});
	console.log('index.js loaded');
})();