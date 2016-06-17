angular.module('domoApp')
    .directive('twitterLineHour', ['graphService', function(graphService) {
        return {
            restrict: "E",
            link: function(scope, element) {

                    var margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 50
                        },
                        width = (window.innerWidth / 3) * 2,
                        height = (window.innerHeight / 3);

                    function parseTime(timeString) {
                        if (timeString === '') return null;

                        var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
                        if (time === null) return null;

                        var hours = parseInt(time[1], 10);
                        if (hours === 12 && !time[4]) {
                            hours = 0;
                        } else {
                            hours += (hours < 12 && time[4]) ? 12 : 0;
                        }
                        var d = new Date();
                        d.setHours(hours);
                        d.setMinutes(parseInt(time[3], 10) || 0);
                        d.setSeconds(0, 0);
                        return d;
                    }

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
                            return x(d.time);
                        })
                        .y0(height)
                        .y1(function(d) {
                            return y(d.engagement);
                        });

                    var svg = d3.select(element[0]).append("svg")
                        .attr("class", "svg-content")
                        // .attr("width", width + margin.left + margin.right)
                        // .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    //Data coming in
                    var getData = function() {
                        graphService.getTwitterLineData().then(function(response) {
                            let oldData = response.engagementByHour;
                            let data = [];
                            class Data {
                                constructor(date, engagement) {
                                    this.time = date;
                                    this.engagement = engagement;
                                }
                            }
                            _.forEach(oldData, (value, key) => {
                                data.push(new Data(key, value));
                            });

                            data.forEach(function(d) {
                                d.time = moment(parseTime(d.time)).format('h a');
                            });

                            x.domain(data.map(function(d) {
                                return d.time;
                            }));
                            y.domain([0, d3.max(data, function(d) {
                                return d.engagement;
                            })]);

                            svg.append("path")
                                .datum(data)
                                .attr("class", "twitter-line")
                                .attr("d", area)
                                .attr("fill", "#9ce");

                            // Define the div for the tooltip
                           var div = d3.select(element[0]).append("div")
                               .attr("class", "tooly")
                               .style("opacity", 0);

                            svg.selectAll("dot")
                              .data(data)
                              .enter().append("circle")
                              .attr("r", 20)
                              .attr("opacity", ".9")
                              .attr("cx", function(d) { return x(d.time); })
                              .attr("cy", function(d) { return y(d.engagement); })
                              .on("mouseover", function(d) {
                                  div.transition()
                                      .duration(200)
                                      .style("opacity", .9)
                                      .style("background", "#f92")
                                      .style("position","absolute")
                                      .style("text-align", "center")
                                      .style("width", "60px")
                                      .style("height", "28px")
                                      .style("padding", "2px")
                                      .style("font", "12px sans-serif")
                                      .style("border", "1px")
                                      .style("border-radius", "8px")
                                      .style("pointer-events", "none");

                                  div.html(d.time + "<br/>"  + d.engagement)
                                      .style("left", (d3.event.pageX) + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                                  })
                              .on("mouseout", function(d) {
                                  div.transition()
                                      .duration(500)
                                      .style("opacity", 0);
                              });

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
