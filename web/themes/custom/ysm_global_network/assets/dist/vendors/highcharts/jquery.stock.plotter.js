'use strict';

(function($) {
	$.fn.stockPlotter = function() {
		if (this.length == 0) {
			return this;
		}

		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).stockPlotter();
			});

			return this;
		}

		// get a global reference to the stock plotter
		var $stockPlotter = $(this);

		// get the data source for the stocks
		$.ajax({
			url: $stockPlotter.data('src'),
			type: 'get',
			dataType: 'text',
			success: function(data) {
				// source data is a CSV
				if ($stockPlotter.data('srcType') == 'text/csv') {
					var _parseData = $.parse(data, {
							header: false,
							dynamicTyping: true
						}),
						_stockData = _parseData.results;

				// source data is JSON
				} else if ($stockPlotter.data('srcType') == 'text/json') {
					_stockData = JSON.parse(data);
				}

				switch($stockPlotter.data('chartType')) {
					case 'candlestick':
						_candlestickStockParser(_stockData);
					break;

					default:
						_genericStockParser(_stockData);
				}
			},
			error: function(error) {
				console.log(error.status + ' ' + error.statusText)
			}
		});

		/**
		 * Parses the stock data for the following chart types:
		 * - Line
		 * - Spline
		 * - Step Line
		 * - Area
		 * - Area Spline
		 * - Column
		 *
		 * @param {array} stockData
		 * 	the data to parse
		 */
		var _genericStockParser = function(stockData) {
			var _stockDates = stockData[0],
				_series = [],
				_seriesData = [];

			// the first index of the _stockDates is the "dates" label,
			// it can be removed, which leaves only the stock dates
			_stockDates = _stockDates.splice(1);

			// the first index of the stockData is the "dates" array,
			// it can be removed, which leaves only the stock series
			stockData = stockData.splice(1);

			// loop through stockData to create each series
			$.each(stockData, function(seriesIdx, seriesVal) {
				_series.push({
					// the first index is the name of the series
					name: seriesVal[0],

					// convert that name to get the series ID
					id: highchartsUtils.convertStringToID(seriesVal[0]),

					// get the chart type, if it's a stepline, for the type to be line
					type: ($stockPlotter.data('chartType') == 'stepline') ? 'line' : $stockPlotter.data('chartType'),

					// is this a stepline chart type
					step: ($stockPlotter.data('chartType') == 'stepline') ? true : false,

					// get the series data
					data: (function() {
						// clear the series data
						_seriesData = [];

						// the first index of the seriesVal is the "series name",
						// it can be removed, which leaves only the stock series data
						seriesVal = seriesVal.splice(1);

						// loop through the seriesVal to map the data (y) to it's date (x)
						$.each(seriesVal, function(dataIdx, dataVal) {
							_seriesData.push({
								// convert the human readable date into unix timestamp
								x: highchartsUtils.convertDate(_stockDates[dataIdx]),

								// even though the dataVal should always be a number,
								// there could be a chances it's a string, so it should
								// parsed anyway
								y: parseFloat(dataVal)
							});
						});

						return _seriesData;
					})()
				});
			});

			// if ($('#flags').length) {
			// 	// parses the JSON string into an object
			// 	flags = JSON.parse('[' + $('#flags').html() + ']');

			// 	// loop through the new object
			// 	$.each(flags, function(index, value) {
			// 		// call function to convert the series name
			// 		value.onSeries	= highchartsUtils.convertStringToID(value.onSeries);

			// 		$.each(flags[index].data, function(index, value) {
			// 			// parse the "x" value into a number and add 3 zeros
			// 			value.x		= parseInt(value.x + '000');
			// 		});
			// 	});

			// 	series = series.concat(flags);
			// }

			_plotStock(_series);
		};

		/**
		 * Parses the stock data for the candlestick chart type.
		 *
		 * @param {array} stockData
		 * 	the data to parse
		 */
		var _candlestickStockParser = function(stockData) {
			var _series = [],
				_seriesData = [];

			// loop through stockData to create each series
			$.each(stockData, function(seriesIdx, seriesVal) {
				// empty the series data
				_seriesData = [];

				_series.push({
					// the first index is the name of the series
					name: seriesVal[0],

					// convert that name to get the series ID
					id: highchartsUtils.convertStringToID(seriesVal[0]),
					type: 'candlestick',

					// get the series data
					data: (function() {
						// the first index of the seriesVal is the "series name",
						// it can be removed, which leaves only the stock series data
						seriesVal = seriesVal.splice(1);

						// loop through the seriesVal add assign the dataVal to it's date (x)
						$.each(seriesVal, function(dataIdx, dataVal) {
							_seriesData.push({
								// convert the human readable date into unix timestamp
								x: highchartsUtils.convertDate(dataVal[0]),

								// the opening value for this data point
								open: parseFloat(dataVal[1]),

								// the high or maximum value for this data point
								high: parseFloat(dataVal[2]),

								// the low or minimum value for this data point
								low: parseFloat(dataVal[3]),

								// The closing value of this data point
								close: parseFloat(dataVal[4])
							});
						});

						return _seriesData;
					})()
				});

				_plotStock(_series);
			});
		};

		/**
		 * Plot the stock.
		 *
		 * @param {array} series
		 * 	the stock series
		 */
		var _plotStock = function(series) {
			$stockPlotter.highcharts('StockChart', {
				chart: {
					backgroundColor: ($stockPlotter.data('grayBackground')) ? '#f2f2f1' : '#ffffff'
				},
				colors: highchartsColors,
				title: {
					text: $stockPlotter.data('title')
				},
				subtitle: {
					text: $stockPlotter.data('subtitle')
				},
				plotOptions: {
					series: {
						dataLabels: {
							enabled: $stockPlotter.data('showDataLabels'),
						}
					},
					// candlestick:{
					// 	dataLabels: {
					// 		formatter: function() {
					// 			console.log(this);
					// 			return 'as'
					// 		}
					// 	}
					// }
				},
				rangeSelector: {
					selected: $stockPlotter.data('rangeSelectorDefault'),
					enabled: $stockPlotter.data('showRangeSelector')
				},
				navigator: {
					enabled: $stockPlotter.data('showNavigator')
				},
				scrollbar: {
					enabled: $stockPlotter.data('showScrollbar'),
				},
				tooltip: {
					xDateFormat: '%b %e, %Y',
					enabled: $stockPlotter.data('showTooltip'),
					valueDecimals: 3,
				},
				series: series,
				credits: {
					enabled: false
				},
				exporting: {
					enabled: $stockPlotter.data('exportable')
				}
			});
		};

		// returns the current jQuery object
		return this;
	};
})(jQuery);
