'use strict';

(function ($, window, document, undefined) {
  var $window = $(window),
    $document = $(document);

  $.fn.teamHoldings = function (holdingsUrl) {
    var $teamHoldings = $(this);
    var teamHoldingsTableRows = [];

    var init = function () {
      $.ajax({
        url: holdingsUrl,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          for (var d = 0; d < data.length; d++) {
            buildTeamHoldingsRow(data[d]);
          }

          buildTeamHoldingsTable();
        }
      });
    }

    var buildTeamHoldingsRow = function (data) {
      var row = [
        '<tr>',
        '<td><a href="' + _getStockUrl(data) + '" target="_blank">' + data.company + '</a></td>',
        '<td class="">' + data.symbol + '</td>',
        '<td class="">' + data.industry + '</td>',
        '<td class="">' + data.price + '<span class="percent_change">(' + _formatPercentChange(data.percent_change) + ')</span></td>',
        '<td class="">' + _formatPercentChange(data.total_percent_change) + '</td>',
        '<td class="">' + data.market_cap + '</td>',
        '</tr>'
      ].join('');

      teamHoldingsTableRows.push(row);
    }

    /**
     * Builds a team holdings table.
     */
    var buildTeamHoldingsTable = function () {
      // Create the table head section.
      var tableHead = [
        '<thead>',
        '<tr>',
        '<th class="" scope="col">Company</th>',
        '<th class="" scope="col">Symbol</th>',
        '<th class="" scope="col">Industry</th>',
        '<th class="" scope="col">Price</th>',
        '<th class="" scope="col">Return Since Inception</th>',
        '<th class="" scope="col">Market Cap (MM)</th>',
        '</tr>',
        '</thead>'
      ].join('');

      // Creat the table body using the team holdings rows.
      var tableBody = [
        '<tbody>',
        teamHoldingsTableRows.join(''),
        '</tbody>'
      ].join('');

      // Append the final table to the teamHoldings panel.
      $teamHoldings.append([
        '<div class="view-team-holdings">',
        '<table class="team-holdings">',
        tableHead,
        tableBody,
        '</table>',
        '</div>'
      ].join(''));
    }

    var _getStockUrl = function (data) {
      return 'https://www.bloomberg.com/quote/' + data.symbol + ':' + data.country;
    }

    var _formatPercentChange = function (percentChange) {
      return '<span class="' + ((percentChange > 0) ? 'increase' : 'decrease') + '">' + percentChange + '%</span>';
    }

    init();

    // returns the current jQuery object
    return this;
  };
})(jQuery, window, document);