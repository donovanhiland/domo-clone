angular.module('domoApp')
    .directive('tweetsByDay', ['graphService', function(graphService) {
        return {
            restrict: "E",
            link: function(scope, element) {

                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 70,
                        left: 40
                    },
                    width = (window.innerWidth / 3) * 1.8,
                    height = (window.innerHeight / 3);

                var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

                var y = d3.scale.linear().range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
                // .tickFormat(d3.time.format("%Y-%m"));

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);

                var svg = d3.select(element[0]).append("svg")
                    .classed("svg-content", true)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + 20 + ")");

                graphService.getTwitterLineData(scope.user.screenName).then(function(response) {
                    let oldData = response.postsByDay;

                    let data = [];
                    class Data {
                        constructor(date, tweetCount) {
                            this.date = date;
                            this.tweetCount = tweetCount;
                        }
                    }
                    _.forEach(oldData, (value, key) => {
                        data.push(new Data(key, value));
                    });

                    x.domain(data.map(function(d) {
                        return d.date;
                    }));
                    y.domain([0, d3.max(data, function(d) {
                        return d.tweetCount;
                    })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", "-.55em")
                        .attr("transform", "rotate(-65)");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end");
                        // .text("Value ($)");

                    svg.selectAll("bar")
                        .data(data)
                        .enter().append("rect")
                        .style("fill", "#9ce")
                        .attr("x", function(d) {
                            return x(d.date);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d.tweetCount);
                        })
                        .attr("height", function(d) {
                            return height - y(d.tweetCount);
                        });

                });
            }
        }; //return
    }]); //the directive
