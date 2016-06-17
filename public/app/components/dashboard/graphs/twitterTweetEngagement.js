angular.module('domoApp')
    .directive('twitterTweetEngagement', ['graphService', function(graphService) {
        return {

            restrict: "E",
            link: (scope, element) => {

                    let margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 40
                        },
                        width = (window.innerWidth / 3) * 1.8,
                        height = (window.innerHeight / 3);

                    let x0 = d3.scale.ordinal()
                        .rangeRoundBands([0, width], 0.1);

                    let x1 = d3.scale.ordinal();

                    let y = d3.scale.linear()
                        .range([height, 0]);

                    let color = d3.scale.ordinal()
                        .range(["#94caed", "#f79521"]);

                    let xAxis = d3.svg.axis()
                        .scale(x0)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(d3.format(".2s"));

                    let svg = d3.select('.svg-container').append("svg")
                        .classed("svg-content", true)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + 60 + ")");

                    graphService.getTwitterBarData(scope.user.screenName).then(function(response) {

                        let dataNames = ["retweets", "favorites"];

                        let data = response;
                        data.forEach(function(d) {
                            d.data = dataNames.map(function(name) {
                                return {
                                    name: name,
                                    value: +d[name]
                                };
                            });
                        });
                        data.forEach(function(d) {
                            d.date = moment(d.date).format('MMM Do');
                        });

                        x0.domain(data.map(function(d) {
                            return d.date;
                        }));
                        x1.domain(dataNames).rangeRoundBands([0, x0.rangeBand()]);
                        y.domain([0, d3.max(data, function(d) {
                            return d3.max(d.data, function(d) {
                                return d.value;
                            });
                        })]);

                        svg.append("g")
                            .classed("x-axis", true)
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        svg.append("g")
                            .classed("y-axis", true)
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 2)
                            .attr("dy", ".30em")
                            .style("text-anchor", "end");

                        let date = svg.selectAll(".date")
                            .data(data)
                            .enter().append("g")
                            .attr("class", " date")
                            .attr("transform", function(d) {
                                return "translate(" + x0(d.date) + ",0)";
                            });

                        date.selectAll("rect")
                            .data((d) => {
                                return d.data;
                            })
                            .enter().append("rect")
                            .attr("width", x1.rangeBand())
                            .attr("x", function(d) {
                                return x1(d.name);
                            })
                            .attr("y", function(d) {
                                return y(d.value);
                            })
                            .attr("height", function(d) {
                                return height - y(d.value);
                            })
                            .style("fill", function(d) {
                                return color(d.name);
                            });

                        let legend = svg.selectAll(".legend")
                            .data(dataNames)
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", function(d, i) {
                                return "translate(0," + i * 20 + ")";
                            });

                        legend.append("rect")
                            .attr("x", width - 18)
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", color);

                        legend.append("text")
                            .attr("x", width - 24)
                            .attr("y", 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text(function(d) {
                                return d;
                            });
                    });
                } //link
        }; //return
    }]); //directive
