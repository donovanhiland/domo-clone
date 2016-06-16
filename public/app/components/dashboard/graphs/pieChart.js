angular.module('domoApp')
  .directive('pieChart', function() {
    return {
      restrict: "AE",
      scope: {
        graphData: '=',
      },
      link: function(scope, element) {


        // let dataset = scope.excelData[0];
        let dataset = [ 5, 10, 20, 45, 6, 25 ];

        let pie = d3.layout.pie();
        // let w = 300;
        let w = 230;
        let h = 210;
        let color = d3.scale.ordinal()
	                          .range(["#3399FF", "#5DAEF8", "#86C3FA", "#ADD6FB", "#D6EBFD"]);

        function randomColor() {
          return color([Math.floor(Math.random()*5)]);
        }

        let outerRadius = w / 2;
        let innerRadius = w / 4; //change this for the
        //arcs require inner and outer radii
        let arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

        //Create SVG element
        let svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        //Set up groups
        let arcs = svg.selectAll("g.arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate( " + outerRadius + ", " + outerRadius + " )");


        //paths - SVG’s answer to drawing irregular forms
        //Draw arc paths
        arcs.append("path") //within each new g, we append a path. A paths path description is defined in the d attribute.
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc)
            .on("mouseover", function(d) {
              d3.select(this)
                .attr("fill", "#f92");
            })
            .on("mouseout", function(d) {
                  d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("fill", randomColor());
          });
            //labels
            arcs.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")"; //A centroid is the calculated center point of any shape
                })
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text(function(d){
                    return d.value; //pie-ified data has to return d.value
                });


            // //Makes Graph responsive
            // d3.select(window).on('resize', function() {
            //     // update width
            //     w = parseInt(d3.select(element[0]).style('width'), 10);
            //     w = w - margin.left - margin.right;
            //     // reset x range
            //     xScale.range([0, w]);
            //
            //     d3.select(svg.node().parentNode)
            //     .style('height', (200 + margin.top + margin.bottom) + 'px')
            //     .style('width', (200 + margin.left + margin.right) + 'px');
            //
            //     svg.selectAll('g.arc.background')
            //         .attr('width', w);
            //
            //     svg.selectAll('g.arc.formatAs')
            //         .attr('width', (d) => { return xScale(d.formatAs); });
            //
            //     // update median ticks
            //     let median = d3.median(svg.selectAll('.bar').data(),
            //         function(d) { return d.formatAs; });
            //
            //     svg.selectAll('line.median')
            //         .attr('x1', xScale(median))
            //         .attr('x2', xScale(median));
            //     // update axes
            //     svg.select('.x.axis.top').call(xAxis.orient('top'));
            //     svg.select('.x.axis.bottom').call(xAxis.orient('bottom'));
            // }); //responsive
      } //link
  };
});
