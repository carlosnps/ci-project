'use strict';

(function($) {
	$.fn.mapPlotter = function() {
		if (this.length == 0) {
			return this;
		}

		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).mapPlotter();
			});

			return this;
		}

		// get a global reference to the map plotter
		var $mapPlotter = $(this);

		// get the data source for the map
		$.ajax({
			url: $mapPlotter.data('src'),
			type: 'get',
			dataType: 'text',
			success: function(data) {
				var _parseData = $.parse(data, {
						header: false,
						dynamicTyping: true
					});

				_mapParser(_parseData.results);
			},
			error: function(error) {
				console.log(error.status + ' ' + error.statusText);
			}
		});

		/**
		 * Parse the map data.
		 *
		 * @param {array} mapData
		 * 	the data to parse
		 */
		var _mapParser = function(mapData) {
			var _seriesData = [];
			
			// the first index of mapData is the "header row",
			// it can be removed, which leaves only the map series data
			mapData = mapData.splice(1);
			
			// loop through the maoData to create the series data
			$.each(mapData, function(dataIdx, dataVal) {
				_seriesData.push({
					// the place on the map to display the value typically 
					// a State (prefixed with US-) or Country 2 letter code 
					code: dataVal[0],

					// the value to display
					value: dataVal[1],

					// determine how big the value area on the map should be,
					// this is constrained by the min and max values
					// in the plotter
					z: (dataVal[1] * 100)
				});
			});

			_plotMap(_seriesData);
		};

		/**
		 * Plot the map.
		 * 
		 * @param {array} seriesData
		 * 	the map series data
		 */
		var _plotMap = function(seriesData) {
			// get the mapData to build the map
			// $.ajax({
			// 	url: 'assets/js/highcharts/mapdata/' + $mapPlotter.data('mapData') + '.js',
			// 	type: 'get',
			// 	dataType: 'script',
			// 	success: function() {
			var _mapData = '';
			
			// try to convert the mapData into GeoJSON
			try {
				_mapData = Highcharts.geojson(Highcharts.maps[$mapPlotter.data('mapData')]);

			// if that fails, just use the raw mapData
			} catch(e) {
				_mapData = Highcharts.maps[$mapPlotter.data('mapData')];
			}

			// build the map
			$mapPlotter.highcharts('Map', {
				chart: {
					backgroundColor: ($mapPlotter.data('grayBackground')) ? '#f2f2f1' : '#ffffff'
				},
				title: {
					useHTML: true,
					align: 'center',
					style: {
						fontWeight: 'bold'
					},
					text: $mapPlotter.data('title')
				},
				subtitle : {
					align: 'center',
					text: $mapPlotter.data('subtitle')
				},
				legend: {
					enabled: false
				},
				// mapNavigation: {
				// 	enabled: $mapPlotter.data('showMapNavigation'),
				// 	enableButtons: $mapPlotter.data('showMapNavigation'),
				// 	enableDoubleClickZoom: false,
				// 	enableDoubleClickZoomTo: false,
				// 	enableMouseWheelZoom: false,
				// 	enableTouchZoom: false
				// },
				tooltip: {
					enabled: false
				},
				series: [{
					mapData: _mapData,
					borderColor: '#f2f2f1',
					enableMouseTracking: false,
					nullColor: '#A7A6A6'
				}, {
					type: 'mapbubble',
					mapData: _mapData,
					joinBy: ['hc-key', 'code'],
					data: seriesData,
					minSize: '13%',
					maxSize: '23%',
					marker: {
						fillColor: '#807a73',
						lineWidth: 0,
						states: {
							hover: {
								enabled: false
							}
						}
					},
					dataLabels: {
						enabled: true,
						format: '{point.value:.1f}%',
						style: {
							fontSize: '16px',
							fontWeight: 'bold',
							textShadow: 0
						}
					}
				}],
				credits: {
					enabled: false
				},
				exporting: {
					enabled: $mapPlotter.data('exportable')
				}
			});
		};
		
		// returns the current jQuery object
		return this;
	};
})(jQuery);