angular.module('domoApp')
  .directive('lineChart', function () {
    return {
      restrict: "AE",
      // controller: 'dashboardCtrl',
      link: function (scope, element) {
        // scope.$watch('excelData', function () {
        console.log(element);
        let margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        let formatDate = d3.time.format("%d-%b-%y");

        let x = d3.time.scale()
            .range([0, width]);

        let y = d3.scale.linear()
            .range([height, 0]);

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        let line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.tsv("data.tsv", type, function(error, data) {
          if (error) throw error;

          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.close; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Price ($)");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
        });

        function type(d) {
          d.date = formatDate.parse(d.date);
          d.close = +d.close;
          return d;
        }

        // }); //scope.watch
      } //link
  }
})
