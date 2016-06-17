angular.module('domoApp')
    .directive('twitterLineDay', ['graphService', function(graphService) {
        return {
            restrict: "E",
            link: function(scope, element) {

                    var margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 50
                        },
                        width = (window.innerWidth / 3) * 1.8,
                        height = (window.innerHeight / 3);

                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(24);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var area = d3.svg.area()
                        .x(function(d) {
                            return x(d.date);
                        })
                        .y0(height)
                        .y1(function(d) {
                            return y(d.engagement);
                        });

                    var svg = d3.select(element[0]).append("svg")
                        .classed("svg-content", true)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + 60 + ")");

                    //Data coming in
                    var getData = function() {
                        graphService.getTwitterLineData().then(function(response) {
                            let oldData = response.engagementByDay;
                            let data = [];
                            class Data {
                                constructor(date, engagement) {
                                    this.date = date;
                                    this.engagement = engagement;
                                }
                            }
                            _.forEach(oldData, (value, key) => {
                                data.push(new Data(key, value));
                            });

                            x.domain(data.map(function(d) {
                                return d.date;
                            }));
                            y.domain([0, d3.max(data, function(d) {
                                return d.engagement;
                            })]);

                            svg.append("path")
                                .datum(data)
                                .attr("class", "twitter-line-day")
                                .attr("d", area)
                                .attr("fill", "#9ce");

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
                                .text("tweets");

                        }); //Service
                    }; //getData
                    getData();
                } //link
        }; //return
    }]); //the directive
