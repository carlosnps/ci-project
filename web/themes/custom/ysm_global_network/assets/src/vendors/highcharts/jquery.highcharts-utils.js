'use strict';

var yaleColors = [
		{ name: 'green', color: '#68741c' },
		{ name: 'blue', color: '#25519d' },
		{ name: 'dark gray', color: '#888888' },
		{ name: 'gray', color: '#cccccc' },
		{ name: 'teal', color: '#085386' },
		{ name: 'light-blue', color: '#2083BD' },
		{ name: 'brown', color: '#887052' }
	],
	highchartsColors = [],
	highchartsUtils = {};

(function($) {
	Highcharts.setOptions({
		lang: {
			thousandsSep: ',',
			decimalPoint: '.'
		}
	});

	$(document).ready(function() {
		$.each(yaleColors, function(key, value) {
			highchartsColors.push(yaleColors[key].color);
		});

		highchartsUtils = {
			//////////////////////////////////////////////////
			// CONVERSION FUNCTIONS
			//////////////////////////////////////////////////
			
			/**
			 * This converts any string into a lower case hyphenated string.
			 *
			 * @param theString
			 * 	The string to convert
			 */
			convertStringToID: function(theString) {
				// make lower case
				theString = theString.toLowerCase();

				// replace all HTML tags with hyphens
				theString = theString.replace(/<[^>]*>/g, '-');

				// replace all spaces with hyphens
				theString = theString.replace(/\s+/g, '-');

				return theString;
			},

			/**
			 * This converts any readable date into a unix based time code
			 *
			 * @param date
			 * 	The human readable date to convert.
			 */
			convertDate: function(date) {
				return new Date(date).getTime();
			},

			/**
			 * This converts the color name to it's hex value
			 *
			 * @param colorName
			 * 	The name of the Yale color to convert into HEX
			 */
			convertColorNameToHex: function(colorName) {
				var _hexColor = ''

				// convert the color name to lowercase
				colorName = colorName.toLowerCase();

				// loop through the yale colors array
				$.each(yaleColors, function(key, value) {
					// if a color name is found
					if (colorName == yaleColors[key].name) {
						// set the hex color
						_hexColor = yaleColors[key].color;

						// break out of the loop
						return false;
					}
				});

				return _hexColor;
			},

			/**
			 * Take the tooltip value and converts speical words
			 * from the mergeTagMap into values from the chartPoint
			 *
			 * @param {object} chartPoint
			 *	a specific point of a series on the chart
			 * @param {string} tooltipValue
			 *	the tooltip text
			 */
			convertTooltipValue: function(chartPoint, tooltipValue) {
				// create map of available merge words and their values that can be merged
				var _mergeTagMap = {
					'#CATEGORY#': chartPoint.key,
					'#VALUE#': chartPoint.y,
					'#SERIES#': chartPoint.series.name
				};

				// loop through the map and replace any found merge words with the new value
				for (var _key in _mergeTagMap) {
					tooltipValue = tooltipValue.replace(new RegExp(_key, 'g'), _mergeTagMap[_key]);
				}

				return tooltipValue;
			},

			//////////////////////////////////////////////////
			// FORMAT FUNCTIONS
			//////////////////////////////////////////////////
			
			/**
			 * This formats the datalabel for each point on the chart
			 * 
			 * @param {object} chartPoint
			 * 	a specific point of a series on the chart
			 * @param {object} $theChart
			 * 	the chart container as a jQuery object 
			 */
			formatDataLabel: function(chartPoint, $theChart) {
				if ($theChart.data('tooltipValueFormat') !== undefined) {
					var _dataLabelFormat = ($theChart.data('tooltipValueFormat') != '') ? $theChart.data('tooltipValueFormat').split(':')[0] : '',
						_dataLabelFormatType = ($theChart.data('tooltipValueFormat') != '') ? $theChart.data('tooltipValueFormat').split(':')[1] : '';
				}

				if ($theChart.data('drilldownTooltipValueFormat') !== undefined) {
					var	_drilldownDataLabelValueFormat = ($theChart.data('drilldownTooltipValueFormat') != '') ? $theChart.data('drilldownTooltipValueFormat').split(':')[0] : '',
						_drilldownDataLabelValueFormatType = ($theChart.data('drilldownTooltipValueFormat') != '') ? $theChart.data('drilldownTooltipValueFormat').split(':')[1] : '';
				}

				// if this is the parent chart
				if (typeof chartPoint.series.options._levelNumber == 'undefined' || chartPoint.series.options._levelNumber == 0) {
					// update the value of the point based on the dataLabelFormat
					switch(_dataLabelFormat) {
						case 'currency':
							return highchartsUtils.formatCurrency(chartPoint.point.y, _dataLabelFormatType);
						break;

						default:
							return chartPoint.point.y;
					}

				// drilldown chart
				} else {
					switch(_drilldownDataLabelValueFormat) {
						case 'currency':
							return highchartsUtils.formatCurrency(chartPoint.point.y, _drilldownDataLabelValueFormatType);
						break;

						default:
							return chartPoint.point.y;
					}
				}
			},

			/**
			 * This formats any number into currancy
			 *
			 * @param {number} number
			 * 	the number to format
			 * @param {string} whatFormat
			 * 	the currancy type (not used)
			 */
			formatCurrency: function(number, whatFormat) {
				var _decimals = 2,
					_symbol = '$',
					_thousandsSeperator = ',',
					_negativeSymbol = number < 0 ? '-' : '',
					_number = parseInt(number = Math.abs(+number || 0).toFixed(_decimals), 10) + '',
					_j = (_j = _number.length) > 3 ? _j % 3 : 0;
				
				return _symbol + 
						_negativeSymbol + 
						(_j ? _number.substr(0, _j) + _thousandsSeperator : '') + 
						_number.substr(_j).replace(/(\d{3})(?=\d)/g, '$1' + _thousandsSeperator) + 
						(_decimals ? '.' + Math.abs(number - _number).toFixed(_decimals).slice(2) : '');
			},

			/**
			 * This formats the tooltip for each point on the chart
			 *
			 * @param {object} chartPoint
			 * 	a specific point of a series on the chart
			 * @param {object} $theChart
			 * 	the chart container as a jQuery object 
			 */
			formatTooltip: function(chartPoint, $theChart) {
				var _value = '',
					_valueSuffix = '';
					
					if ($theChart.data('tooltipValueFormat') !== undefined) {
						var _tooltipValueFormat = ($theChart.data('tooltipValueFormat') !== '') ? $theChart.data('tooltipValueFormat').split(':')[0] : '',
							_tooltipValueFormatType = ($theChart.data('tooltipValueFormat') !== '') ? $theChart.data('tooltipValueFormat').split(':')[1] : '';
					}

					if ($theChart.data('drilldownTooltipValueFormat') !== undefined) {
						var _drilldownTooltipValueFormat = ($theChart.data('drilldownTooltipValueFormat') !== '') ? $theChart.data('drilldownTooltipValueFormat').split(':')[0] : '',
							_drilldownTooltipValueFormatType = ($theChart.data('drilldownTooltipValueFormat') !== '') ? $theChart.data('drilldownTooltipValueFormat').split(':')[1] : '';
					}
				// if this is the parent chart
				if (typeof chartPoint.series.options._levelNumber == 'undefined' || chartPoint.series.options._levelNumber == 0) {
					// update the value of the point based on the tooltipValueFormat
					switch(_tooltipValueFormat) {
						case 'currency':
							_value = highchartsUtils.formatCurrency(chartPoint.point.y, _tooltipValueFormatType);
						break;

						default:
							_value = chartPoint.point.y;
					}

					// if the chart type is pie
					if ($theChart.data('chartType') == 'pie') {
						_value = chartPoint.percentage.toFixed(1);
						_valueSuffix = '%';

					// for all other charts
					} else {
						_valueSuffix = $theChart.data('tooltipValueSuffix');
					}

					if ($theChart.data('advancedTooltip')) {
						// update the chart y value with the new value
						chartPoint.y = _value;

						return highchartsUtils.convertTooltipValue(chartPoint, $theChart.data('advancedTooltipText'));

					} else {
						return '<b>' + chartPoint.point.name + '</b>: ' + _value + _valueSuffix;
					}

				// drilldown chart
				} else {
					// update the value of the point based on the drilldownTooltipValueFormat
					
					switch(_drilldownTooltipValueFormat) {
						case 'currency':
							_value = highchartsUtils.formatCurrency(chartPoint.point.y, _drilldownTooltipValueFormatType);
						break;

						default:
							_value = chartPoint.point.y;
					}

					// if the drilldown chart is pie or drilldown chart is blank and parent is pie
					if ($theChart.data('drilldownChartType') == 'pie' || ($theChart.data('drilldownChartType') == '' && $theChart.data('chartType') == 'pie')) {
						_value = chartPoint.percentage.toFixed(1);
						_valueSuffix = '%';

					} else {
						_valueSuffix = $theChart.data('drilldownTooltipValueSuffix');
					}

					return '<b>' + chartPoint.point.name + '</b>: ' + _value + _valueSuffix;
				}
			},

			////////////////////////////////////////////////
			// ALERT PANELS
			////////////////////////////////////////////////

			/**
			 * Shows an alert panel when drilldown data is not available
			 *
			 * @param {object} theChart
			 * 	the chart object
			 * @param {string} drilldownID
			 *	the ID of drilldown series
			 */
			showAlertPanel: function(theChart, drilldownID) {
				var _alertPanelID = theChart.renderTo.id + '-alert-panel',
					_alertTextID = theChart.renderTo.id + '-alert-text',
					_showAlert 	= true,
					_drillDownTitle	= '';
				
				// make sure drilldownID is defined and it has at least one set of series data
				if (drilldownID !== undefined && theChart.userOptions.drilldown.series.length >= 1) {
				// 	// loop through the all the drilldown series data
					$.each(theChart.userOptions.drilldown.series, function(drilldownSeriesIdx, drilldownSeriesVal) {
						// check each drilldown series ID if it matches the drilldownID
						if (drilldownSeriesVal.id == drilldownID) {
							// if a match is found, we don't need to show an alert
							_showAlert = false;

							// the title of the drill down series
							_drillDownTitle = drilldownSeriesVal.name;

							// break out of the loop
							return false;
						}
					});

					// only show an alert if there is matching drilldown data
					if (_showAlert) {
						theChart.renderer.rect(theChart.renderTo.clientWidth - 270, 10, 235, 45, 0)
							.attr({
								'stroke-width': 0.5,
								stroke: '#383a3b',
								fill: '#dddddd',
								id: _alertPanelID
							}).add();

						theChart.renderer.text(
							'Insufficient data or data not published<br />to maintain student privacy', 
							theChart.renderTo.clientWidth - 262, 28)
							.attr({
								id: _alertTextID
							}).add();

						highchartsUtils.hideAlertPanel(_alertPanelID, _alertTextID);

					// drilldown data found
					} else {
						// change the chart title to the drill down title
						theChart.setTitle({
							text: _drillDownTitle
						});

						// hides an alert panel immediately
						highchartsUtils.hideAlertPanel(_alertPanelID, _alertTextID, 0);
					}
				}
			},

			/**
			 * Hides an alert panel after a timeout period
			 *
			 * @param {string} alertPanelID
			 * 	the ID of the alert panel
			 * @param {string} alertTextID
			 * 	the ID of the text inside the alert panel
			 * @param {number} [delayTime = 2000]
			 * 	how long to display the alert panel, defaults to 2 seconds
			 */
			hideAlertPanel: function(alertPanelID, alertTextID, delayTime) {
				var _delayTime = (typeof delayTime == 'undefined') ? 2000 : delayTime;

				setTimeout(function() {
					$('#' + alertPanelID).remove();
					$('#' + alertTextID).remove();
				}, _delayTime);
			},
		}
	});
})(jQuery);