angular.module('domoApp')
  .directive('scatterPlot', function () {
    return {
      restrict: "AE",
      scope: {
        graphData: '='
      },
      link: function (scope, element) {


        // var dataset = scope.graphData;
        var dataset = [
                  [ 5,     20 ],
                  [ 480,   90 ],
                  [ 250,   50 ],
                  [ 100,   33 ],
                  [ 330,   95 ],
                  [ 410,   12 ],
                  [ 475,   44 ],
                  [ 25,    67 ],
                  [ 85,    21 ],
                  [ 220,   88 ],
                  [ 300,   150]
              ];
        var margin = {top: 20, right: 20, bottom: 30, left: 40};
        var w = 960 - margin.left - margin.right;
        var h = 500 - margin.top - margin.bottom;
        var padding = 0;
        var formatAs = d3.format(".1"); //when data is messy

        var xScale = d3.scale.linear()
                              .domain([0, d3.max(dataset, function(d){
                                return d[0];
                              })])
                              .range([padding, w-padding * 2]);

        var yScale = d3.scale.linear()
                             .domain([0, d3.max(dataset, function(d) {
                               return d[1];
                             })])
                             .range([h-padding, padding]);

        var rScale = d3.scale.linear()
                            .domain([0, d3.max(dataset, function(d) {
                              return d[1];
                             })])
                            .range([2, 5]);
        //define x-axis
        var xAxis = d3.svg.axis()
                      .scale(xScale) //which scale to operate
                      .orient('bottom') //where
                      .ticks(5) //how many little lines(ticks) on the axis
                      .tickFormat(formatAs);

        //Define Y axis
        var yAxis = d3.svg.axis()
                          .scale(yScale)
                          .orient("left")
                          .ticks(5)
                          .tickFormat(formatAs);

        //create svg
        var svg = d3.select(element[0])
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)


        //create circles
        svg.selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr({
            cx: function(d){return xScale(d[0])},
            cy: function(d){return yScale(d[1])},
            r: function(d){return rScale(d[1])}
          })

        //labels
        svg.selectAll("text")
           .data(dataset)
           .enter()
           .append("text")
           .text(function(d) {
                return d[0] + "," + d[1];
           })
           .attr({
             x: function(d){return xScale(d[0]) + 4},
             y: function(d){return yScale(d[1]) + 2},
             "font-family": "sans-serif",
             "font-sizee": "11px",
             "fill": "#5DAEF8"
           });

        // create x-axis
        svg.append('g')
            .attr('class', 'x axis') //assigns 'x' and 'axis' class
            .attr("transform", "translate(0," + (h - padding) + ")") //pushes line to bottom
            .call(xAxis); //takes the incoming selection and hands it off to any function

        //Create Y axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        d3.select(element[0])
         .append("div")
         .classed("svg-container", true) //container class to make it responsive
         .append("svg")
         //responsive SVG needs these 2 attributes and no width and height attr
         .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", "0 0 600 400")
         //class to make it responsive
         .classed("svg-content-responsive", true);

          //random button
        d3.select(element[0])
          .on('click', function () {

                  //Update scale domains
        		xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
        		yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

            svg.selectAll('circle')
              .data(dataset)
              .transition()
              .duration(1000)
              .each("start", function() {      // <-- Executes at start of transition
               d3.select(this) //selects the current element
                 .attr("fill", "#f92")
                 .attr("r", 7);
               })
              .attr({
                cx: function(d){return xScale(d[0])},
                cy: function(d){return yScale(d[1])},
                r: function(d){return rScale(d[1])}
              })
              .transition() // <-- 2nd transition
              .duration(500)
                 .attr("fill", "black")
                 .attr("r", 2);

            svg.selectAll("text")
               .data(dataset)
               .transition()
               .duration(1000)
               .text(function(d) {
                    return d[0] + "," + d[1];
               })
               .attr({
                 x: function(d){return xScale(d[0])},
                 y: function(d){return yScale(d[1])},
                 "font-family": "sans-serif",
                 "font-size": "11px",
                 "fill": "#5DAEF8"
               })
            //update x-axis
            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(xAxis);

            //update y axis
            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yAxis);

              }) //on click

          //Makes Graph responsive
          d3.select(window).on('resize', function () {
              // update width
              w = parseInt(d3.select(element[0]).style('width'), 10);
              w = w - margin.left - margin.right;
              // reset x range
              xScale.range([0, w]);

              d3.select(svg.node().parentNode)
              .style('height', (200 + margin.top + margin.bottom) + 'px')
              .style('width', (200 + margin.left + margin.right) + 'px');

              svg.selectAll('circle.background')
                  .attr('width', w);

              svg.selectAll('circle.formatAs')
                  .attr('width', function(d) { return xScale(d.formatAs); });

              // update median ticks
              var median = d3.median(svg.selectAll('.bar').data(),
                  function(d) { return d.formatAs; });

              svg.selectAll('line.median')
                  .attr('x1', xScale(median))
                  .attr('x2', xScale(median));
              // update axes
              svg.select('.x.axis.top').call(xAxis.orient('top'));
              svg.select('.x.axis.bottom').call(xAxis.orient('bottom'));
          });
    } //link
  }
})
