var SP = {};

SP.transactions = {};

function jsonFlickrApi(r) {
	SP.transactions.photosearch=r;
	
}

(function() {
	
	YUI().use('node', function(Y) {
		
		var mercator = d3.geo.mercator();
		
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
			Y.Get.js('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6ded95f2901a334b25f2b058751c5012&woe_id='+woe_id+'&format=json&stpxid=photosearch&extras=geo', function (err) {
			    if (err) {
			        Y.Array.each(err, function (error) {
			            Y.log('Error loading JS: ' + error.error, 'error');
			        });
				
			        return;
			    }
				
				callback.apply(scope, [SP.transactions.photosearch]);
			});
		}
		
		function getPointForCoordinate(coordinates_array) {
			var point_array = mercator(coordinates_array);
			return point_array;
		}
		
		getFlickrPointsForWoeId(2487956, function(r) {
			var coordinate_array = getCoordinateArray(r.photos.photo);
			
			for(var i=0, l=coordinate_array.length; l > i; i++) {
				console.log('points',getPointForCoordinate(coordinate_array[i]));
			}

		}, this);
	});
	console.log('index.js loaded');
})();