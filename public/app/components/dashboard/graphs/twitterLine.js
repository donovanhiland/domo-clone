angular.module('domoApp')
  .directive('twitterLineHour', ['graphService', function(graphService) {

    return {
      restrict: "E",
      link: function(scope, element) {
        var getData = function() {
        graphService.getTwitterLineData().then(function(response) {
          console.log(response.engagementByHour);
          let data = response.engagementByHour;
          console.log(data['1:00 AM']);
          data.forEach(function(d) {
            return d;
          });
          console.log(data);
      // STYLING
      let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 760 - margin.left - margin.right,
        height = 415 - margin.top - margin.bottom,
        formatPercent = d3.format(".01");

      let x = d3.time.scale()
        .range([0, width]);

      let y = d3.scale.linear()
        .range([height, 0]);

      // let color = d3.scale.category10();
      let color = d3.scale.ordinal()
        .range("#1F77B4");

      let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.hour).tickFormat(d3.time.format("%I"));

      let yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

      let line = d3.svg.area()
        .interpolate("cardinal")
        .x((d) => { return x(d.date); })
        .y0((d) => { return y(d.y); })
        .y1((d) => { return y(d.y); });

        function line_to_stacked(t) {
        return d3.svg.area()
          .interpolate("cardinal")
          .x((d) => { return x(d.date); })
          .y0((d) => { return y(t * d.y0 + d.y); })
          .y1((d) => { return y(t * d.y0 + d.y); });
      }

        function area_to_stacked(t) {
        return d3.svg.area()
          .interpolate("cardinal")
          .x(function(d) { return x(d.date); })
          .y0(function(d) { return y(d.y0 + (1 - t) * d.y); })
          .y1(function(d) { return y(d.y0 + d.y); });
      }

      let stack = d3.layout.stack()
        .values(function(d) { return d.values; });

      // CREATE CHART CONTAINER //
      let svg = d3.select(".total-ar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // DEFINITIONS
      color.domain(d3.keys(dailyData[0]).filter(function(key) { return key !== "date"; }));

      dailyData.forEach((d) => {
        d.date = parseDate(d.date);
      });

      let collPeriods = stack(color.domain().map(function(name) {
        return { name: name, values: dailyData.map(function(d) {
          return {date: d.date, y: d[name] / 100};
        })};
      }));

      x.domain(d3.extent(dailyData, function(d) { return d.date; }));

      let collPeriod = svg.selectAll(".collPeriod")
        .data(collPeriods)
        .enter().append("g")
        .attr("class", "collPeriod");

      collPeriod.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); })
        .style("stroke-width", "3px")
        .style("fill", function(d) { return color(d.name); });

      collPeriod.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y) + ")"; })
        .attr("x", 4)
        .attr("dy", ".35em")
        .style("fill", function(d) { return color(d.name); })
        .text(function(d) { return d.name; });

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      // TRANSITIONS //
      let is_area_plot = false;
      scope.transitionLineStacked = function() {
        let duration = 1500;
        let collPeriod = svg.selectAll(".collPeriod");
        let transition = collPeriod.transition()
          .delay(function(d, i) { return i * 500; })
          .duration(duration);
        let postTransition = transition.transition();
        if (!is_area_plot) {
          transition.selectAll("path")
            .attrTween("d", shapeTween(line_to_stacked, 1));
          transition.selectAll("text")
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y) + ")"; });
          postTransition.selectAll("path")
            .attrTween("d", shapeTween(area_to_stacked, 1))
            .style("stroke-opacity", 0.0);
          postTransition.selectAll("text")
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; });
        } else {
          transition.selectAll("path")
            .style("stroke-opacity", 1.0)
            .attrTween("d", shapeTween(area_to_stacked, 0));
          transition.selectAll("text")
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y) + ")"; });
          postTransition.selectAll("path")
            .attrTween("d", shapeTween(line_to_stacked, 0));
          postTransition.selectAll("text")
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y) + ")"; });
        }
        is_area_plot = !is_area_plot;
      };

      function shapeTween(shape, direction) {
        return function(d, i, a) {
          return function(t) {
            return shape(direction ? t : 1.0 - t)(d.values);
          };
        };
        }


      }); //Service
    }; //getData
    getData();
    } //link
  }; //return
}]); //the directive
