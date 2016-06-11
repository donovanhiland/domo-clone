angular.module('domoApp')
  .directive('twitterLineHour', ['graphService', function(graphService) {
    return {
      restrict: "E",
      link: function(scope, element) {
        var getData = function() {
        graphService.getTwitterLineData().then(function(response) {
          console.log(response);
          console.log(response.engagementByHour);
          let data = response.engagementByHour;
          console.log(data['1:00 AM']);
          for(var key in data) {
          }

          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 740 - margin.left - margin.right,
            height = 415 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x(d); })
            .y0(height)
            .y1(function(d) { return y(d); });

        var svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          // data.forEach(function(d) {
          //   d.date = parseDate(d.date);
          //   d.close = +d.close;
          // });

          x.domain(d3.extent(data, function(d) {
            console.log(d);
            return d;
           }));
          y.domain([0, d3.max(data, function(d) {
            return d;
           })]);

          svg.append("path")
              .datum(data)
              .attr("class", "twitter-line")
              .attr("d", area)
              .attr("fill", "steelblue");

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

      }); //Service
    }; //getData
    getData();
    } //link
  }; //return
}]); //the directive
