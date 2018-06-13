'use strict';

(function($) {
	$.fn.chartPlotter = function() {
		if (this.length == 0) {
			return this;
		}

		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).chartPlotter();
			});

			return this;
		}

		// get a global reference to the chart plotter
		var $chartPlotter = $(this);

		// get the data source for the chart
		$.ajax({
			url: $chartPlotter.data('src'),
			type: 'get',
			dataType: 'text',
			success: function(data) {
				var _parseResult = $.parse(data, {
						header: false,
						dynamicTyping: true
					});

				switch($chartPlotter.data('chartType')) {
					case 'pie':
						_pieChartParser(_parseResult.results);
					break;

					default:
						_genericChartParser(_parseResult.results);
				};
			},
			error: function(error) {
				console.log(error.status + ' ' + error.statusText);
			}
		});

		/**
		 * Parses the chart data for the following chart types:
		 *  - Line
		 *  - Spline
		 *  - Bar
		 *  - Column
		 *  - Area
		 *  - Area Spline
		 * 
		 * @param {array} chartData
		 * 	the data to parser, so it can be displayed
		 */
		var _genericChartParser = function(chartData) {
			var	_chartCategories = chartData[0],
				_series = [],
				_seriesName = '',
				_seriesData = [],
				_drillDownSeries = [];
			
			// the first and second indexes of the _chartCategories are the "categories" 
			// and "color" labels, they can be removed, which leaves only the categories
			_chartCategories = _chartCategories.splice(2);

			// the first index of the chartData is the "categories" array,
			// it can be removed, which leaves only the chart series
			chartData = chartData.splice(1);

			// if this chart needs drilldown data, parse it
			// and get the returned data
			if ($chartPlotter.data('drilldownSrc') !== '') {
				_drilldownChartParser(function(data) {
					_drillDownSeries = data;
				});
			}

			// loop through stockData to create each series
			$.each(chartData, function(seriesIdx, seriesVal) {
				_series.push({
					// the first index is the name of the series
					name: seriesVal[0],

					// convert that name to get the series ID
					id: highchartsUtils.convertStringToID(seriesVal[0]),
					
					// convert the human readable color into a hex value
					color: highchartsUtils.convertColorNameToHex(seriesVal[1]),

					// get the series data
					data: (function() {
						// empty the series data
						_seriesData = [];

						// get a copy of the series name
						// so it can be used in the drilldown data
						// if there is drilldown data
						_seriesName = seriesVal[0];

						// the first and second indexs of seriesVal are the series "name" and 
						// "color", they can be removed, which leaves only the chart series data
						seriesVal = seriesVal.splice(2);

						// get the data for each series
						$.each(seriesVal, function(dataIdx, dataVal) {
							_seriesData.push({
								// the category which the value (y) belongs to
								name: _chartCategories[dataIdx],
								
								// the value to display
								y: parseFloat(dataVal),

								// the series name that the drilldown belongs to
								// sets to undefined if there is no drilldown src
								drilldown: (function() {
									if ($chartPlotter.data('drilldownSrc') !== '') {
										return highchartsUtils.convertStringToID(_seriesName);

									} else {
										return undefined;
									}
								})()
							});
						});

						return _seriesData;
					})()
				});
			});

			_plotChart(_series, _drillDownSeries);
		};

		/**
		 * Parses the chart data for the piechart chart type.
		 *
		 * @param {array} chartData
		 * 	the data to parse so the chart can be displayed
		 */
		var _pieChartParser = function(chartData) {
			var _series = [],
				_seriesData = [],
				_drilldownSeries = [];
			
			// if this chart needs drilldown data, parse it
			// and get the returned data
			if ($chartPlotter.data('drilldownSrc') !== '') {
				_drilldownChartParser(function(data) {
					_drilldownSeries = data;
				});
			}
			
			// the first index of chartData is the "header row",
			// it can be removed, which leaves only the chart series data
			chartData = chartData.splice(1);
			
			_series = [{
				type: 'pie',
				name: $chartPlotter.data('pieChartSeriesName'),
				
				// set the inner size of the pie chart based on whether or not
				// the chart is donut, half chart, or half dount chart
				// sets to 0% if not dount, half or half dount
				innerSize: ($chartPlotter.data('pieChartMakeDonut')) ? 
							(($chartPlotter.data('pieChartMakeHalf')) ? 
								'50%' : 
								'30%'
							) : 
							'0%',
				
				data: (function() {
					// get the series data
					$.each(chartData, function(dataIdx, dataVal) {
						_seriesData.push({
							// the category which the value (y) belongs to
							name: dataVal[0],
							
							// convert that category name to get the category ID
							id: highchartsUtils.convertStringToID(dataVal[0]),
							
							// convert the human readable color into a hex value
							color: highchartsUtils.convertColorNameToHex(dataVal[1]),
							
							// the value to display
							y: parseFloat(dataVal[2]),
							
							// the series name that the drilldown belongs to
							// sets to undefined if there is no drilldown src
							drilldown: (function() {
								if ($chartPlotter.data('drilldownSrc') !== '') {
									return highchartsUtils.convertStringToID(dataVal[0]);

								} else {
									return undefined;
								}
							})()
						});
					});

					return _seriesData;
				})()
			}];

			_plotChart(_series, _drilldownSeries);
		};

		/**
		 * Parses an array needed for the drilldown chart
		 *
		 * @name drilldownChartParser
		 *
		 * @param {function} fn
		 * 	the return function
		 */
		var _drilldownChartParser = function(fn) {
			var _drilldownData = [],
				_drilldownSeries = [],
				_drilldownSeriesData = [];

			// get the drilldown data
			$.ajax({
				url: $chartPlotter.data('drilldownSrc'),
				type: 'get',
				dataType: 'text',
				async: false,
				success: function(data) {
					var _parseData = $.parse(data, {
							header: false,
							dynamicTyping: true
						});

					// the first index of _parseData is the "header row",
					// it can be removed, which leaves only the drilldown series
					_drilldownData = _parseData.results.splice(1);

					// loop through _drilldownData to create each series
					$.each(_drilldownData, function(seriesIdx, seriesVal) {
						_drilldownSeries.push({
							// convert the the first index to get the series ID
							id: highchartsUtils.convertStringToID(seriesVal[0]),

							// the second index is the name of the series
							name: seriesVal[1],
							
							// get the drilldown chart type, if there is no drilldown chart type,
							// use the parent chart type
							type: ($chartPlotter.data('drilldownChartType') == '') ? 
									$chartPlotter.data('chartType') : 
									$chartPlotter.data('drilldownChartType'),
						
							data: (function() {
								// empty the series data
								_drilldownSeriesData = [];

								// the first and second indexs of seriesVal are the "series name" 
								// and "source", they can be removed, which leaves only the drilldown
								// chart series data
								seriesVal = seriesVal.splice(2);

								// get the series data
								$.each(seriesVal, function(dataIdx, dataVal) {
									// since the drilldown data is a key/value pair
									// only add new series data every other iteration
									if (dataIdx % 2 == 0) {
										_drilldownSeriesData.push([
											seriesVal[dataIdx],
											parseFloat(seriesVal[dataIdx + 1])
										]);
									}
								});

								return _drilldownSeriesData;
							})()
						});
					});

					fn(_drilldownSeries);
				},
				error: function(error) {
					fn(_drilldownSeries);
				}
			});
		};

		/**
		 * Plot the chart using the series and drilldown series 
		 *
		 * @param {array} series
		 * 	the data for the series
		 * @param {array} drilldownSeries
		 * 	the data for the drilldown series
		 * 	NOTE: this is always passed but could be an empty
		 * 			array if there is no drilldown data
		 */
		var _plotChart = function(series, drilldownSeries) {
			var _heightValue = null,
				_dataLabelStyles = {
					color: '#383a3b',
					fontWeight: 'normal',
					fontSize:'14px',
					textDecoration: 'none'
				};

			if ($chartPlotter.data('knockoutDataLabels')) {
				_dataLabelStyles.color = '#ffffff';
				_dataLabelStyles.textShadow = '0px 1px 2px #1f2021';
			}

			if ($chartPlotter.data('chartType') == 'pie') {
				_dataLabelStyles.width = '200px';

				_heightValue = $chartPlotter.data('pieChartMakeHalf') ? 300 : 600;			
			}

			// build the chart
			$chartPlotter.highcharts({
				chart: {
					type: $chartPlotter.data('chartType'),
					backgroundColor: ($chartPlotter.data('grayBackground')) ? '#f2f2f1' : '#ffffff',
					height: _heightValue,
					marginBottom: ($chartPlotter.data('pieChartMakeHalf')) ? -110 : null,
					events: {
						drillup: function(event) {
							this.setTitle({
								text: $chartPlotter.data('title')
							});

							this.setSize(this.chartWidth, this.chartHeight);
						}
					}
				},
				title: {
					useHTML: true,
					align: 'left',
					style: {
						fontWeight: 'bold'
					},
					text: $chartPlotter.data('title')
				},
				subtitle: {
					text: $chartPlotter.data('subtitle'),
					align: 'left'
				},
				xAxis: {
					categories: true,
					labels: {
						enabled: true
					}
				},
				yAxis: {
					title: {
						text: $chartPlotter.data('yAxis')
					},
					showEmpty: false
				},
				tooltip: {
					enabled: $chartPlotter.data('showTooltip'),
					formatter: function() {
						return highchartsUtils.formatTooltip(this, $chartPlotter);
					},
					useHTML: true
				},
				legend: {
					backgroundColor: 'transparent',
					borderWidth: 0,
					borderRadius: 5,
					enabled: $chartPlotter.data('showLegend'),
					navigation: {
						enabled: false
					}
				},
				plotOptions: {
					series: {
						events: {
							click: function(event) {
								highchartsUtils.showAlertPanel(this.chart, event.point.drilldown);
							},
							legendItemClick: function() {
								return true;
							}
						},
						dataLabels: {
							enabled: $chartPlotter.data('showDataLabels'),
							style: _dataLabelStyles,
							formatter: function() {
								return highchartsUtils.formatDataLabel(this, $chartPlotter);
							}
						},
						stacking: ($chartPlotter.data('stackValues')) ? 'normal' : '',
					},
					column: {
						borderWidth: 0
					},
					bar: {
						borderWidth: 0
					},
					pie: {
						point: {
							events: {
								// disables the hiding of pie segements
								legendItemClick: function() {
									return false;
								}
							}
						},	
						allowPointSelect: false,
						dataLabels: {
							distance: ($chartPlotter.data('pieChartMakeHalf')) ? -50 : 30,
							maxStaggerLines: 1,
							format: '{point.name}: <b>{point.percentage:.1f}%</b>'
						},
						showInLegend: $chartPlotter.data('showLegend'),
						startAngle: ($chartPlotter.data('pieChartMakeHalf')) ? -90 : 0,
						endAngle: ($chartPlotter.data('pieChartMakeHalf')) ? 90 : null,
						center: ($chartPlotter.data('pieChartMakeHalf')) ? ['50%', '50%'] : [null, null]
					}
				},
				colors: highchartsColors,
				series: series,
				drilldown: {
					drillUpButton: {
						relativeTo: 'spacingBox',
						theme: {
							'stroke-width': 1,
							position: {
								y: 0,
								x: 0
							}
						}
					},
					activeDataLabelStyle: _dataLabelStyles,
					activeAxisLabelStyle: {
						textDecoration: 'none'
					},
					series: drilldownSeries
				},
				credits: {
					enabled: false
				},
				exporting: {
					enabled: $chartPlotter.data('exportable')
				}
			});
		};

		// returns the current jQuery object
		return this;
	};
})(jQuery);

(function($) {
	$.fn.complexChartPlotter = function() {
		if (this.length == 0) {
			return this;
		}

		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).complexChartPlotter();
			});

			return this;
		}

		// get a global reference to the complex chart plotter 
		var $complexChartPlotter = $(this);

		// console.log(JSON.parse())

		var chartData = JSON.parse($complexChartPlotter.find('.chart-data').html());

		$complexChartPlotter.highcharts(chartData);
	};
})(jQuery);