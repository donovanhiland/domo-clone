angular.module('domoApp')
  .directive('barChart', function () {
    return {
      restrict: "AE",
      scope: {
        graphData: '=',
      },
      link: function (scope, element) {
        // console.log(scope.graphData);

        // var dataset = scope.graphData;
        var dataset = [5,10,15,13,25,34,19,14,23,15, 12, 16, 19, 12, 8, 20];
        //Width and height
        var margin = {top: 20, right: 20, bottom: 30, left: 40};
        var w = parseInt(d3.select(element[0]).style('width'), 11);
        // var w = 450;
        w = w - margin.left - margin.right;
        // var h = parseInt(d3.select(element[0]).style('width'), 11);
        var h = 250 - margin.top - margin.bottom;
        var formatAs = d3.format(".1"); //when data is messy

        var sortOrder = false;
        var sortBars = function() {
        sortOrder = !sortOrder;
            svg.selectAll("rect")
               .sort(function(a, b) { //sorts the bars in asc/desc order
                 if (sortOrder) {
                   return d3.ascending(a, b);
                 } else {
                   return d3.descending(a, b);
                 }
              })
               .transition()
               .delay(function (d,i) {
                 return i * 50;
               })
               .duration(1000)
               .attr("x", function(d, i) {
                     return xScale(i);
               });
        };

        var xScale = d3.scale.ordinal() //an ordinal scale instead of linear
                        .domain(d3.range(dataset.length + 2))
                        .rangeRoundBands([0, w], 0.05); //discreet outputs are rounded to the nearest integer

        var yScale = d3.scale.linear()
          							.domain([0, d3.max(dataset)])
          							.range([0, h]);

        //Define x-axis
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

        //Create SVG element[0]
        var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr({
                x: function(d, i) { return xScale(i); }, //bar width
                y: function(d) { return h - yScale(d); }, //sets height and flips it
                width: xScale.rangeBand(), //width in between bars
                height: function(d) { return yScale(d) },
                fill: function(d) { return "rgb(0, 0, " + (d * 10) + ")"; }
           })


           .on("mouseover", function(d) {
               //Get this bar's x/y values, then augment for the tooltip
             var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
             var yPosition = parseFloat(d3.select(this).attr("y")) + 20;
                d3.select(this)
                  .attr("fill", "#f92");

                  //Create the tooltip label
                  svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black")
                    .attr("cursor", "context-menu")
                    .text(d);
                })
            .on("mouseout", function(d) {
                  d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("fill", "rgb(0, 0, " + (d * 10) + ")");
                  //Remove the tooltip
                  d3.select("#tooltip").remove();
          })
            .on("click", function() {
                  sortBars();
          });

          // create x-axis
          svg.append('g')
              .attr('class', 'x axis') //assigns 'x' and 'axis' class
              .attr("transform", "translate(0," + h + ")") //pushes line to bottom
              .call(xAxis); //takes the incoming selection and hands it off to any function

          //Create Y axis
          svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(" + 5 + ",0)")
              .call(yAxis);

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

            svg.selectAll('rect.background')
                .attr('width', w);

            svg.selectAll('rect.formatAs')
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
  } //return
}) //directive
