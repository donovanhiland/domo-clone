angular.module('domoApp')
  .directive('pieChart', function () {
    return {
      restrict: "AE",
      scope: {
        graphData: '=',
      },
      link: function (scope, element) {
        // scope.$watch('excelData', function () {


        // var dataset = scope.excelData[0];
        var dataset = [ 5, 10, 20, 45, 6, 25 ];

        var pie = d3.layout.pie()
        var w = 230;
        var h = 250;
        var color = d3.scale.ordinal()
	.range(["#3399FF", "#5DAEF8", "#86C3FA", "#ADD6FB", "#D6EBFD"]);
        function randomColor() {
          return color([Math.floor(Math.random()*5)])
        }
        var outerRadius = w / 2;
        var innerRadius = w / 4; //change this for the
        //arcs require inner and outer radii
        var arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

        //Create SVG element
        var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        //Set up groups
        var arcs = svg.selectAll("g.arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate( " + outerRadius + ", " + outerRadius + " )")


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
                    .attr("fill", randomColor())
          })
            //labels
            arcs.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")"; //A centroid is the calculated center point of any shape
                })
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text(function(d) {
                    return d.value; //pie-ified data has to return d.value
                })


        // }); //scope.watch
      } //link
  }
})
