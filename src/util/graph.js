import * as d3 from 'd3';

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}


export default class Graph {

  constructor(target) {
    let bbox = target.node().getBoundingClientRect()
    this.svg = target.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + bbox.width + ' ' + bbox.height);

    this.margin = 5;
    this.w = bbox.width - 2*this.margin;
    this.h = bbox.height - 2*this.margin;
    this.chart = this.svg.append('g').attr('transform', translate(this.margin, this.margin));
  }

  setClickFn(fn) {
    this.clickFn = fn;
  }


  render(trip) {
    let chart = this.chart;
    chart.selectAll('*').remove();

    if (trip.plans.length === 0) return;

    let maxLength = trip.maxLength();
    let bufferedMaxLength = maxLength + 5; // Just give it a little extra space
    let unit = this.w / bufferedMaxLength;
    let planH = 20;


    let scale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(trip.places.map( place => place.placeId));

    // Draw guides
    let start = 0;
    while(true) {
      if (start > maxLength) break;
      chart.append('rect')
        .attr('x', 70+start*unit)
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', 100)
        .attr('stroke', 'none')
        .attr('fill', '#BBB');

      chart.append('text')
        .attr('x', 70+start*unit)
        .attr('y', 115)
        .style('text-anchor', 'middle')
        .text(start);
      start += 1;
    }

    trip.plans.forEach( (plan, planIdx) => {
      let list = trip.listPlan(plan);
      let start = 70;
      let group = chart.append('g').datum(plan);
      let clickFn = this.clickFn;

      group.on('click', function(d) {
        if (clickFn) {
          clickFn(d);
        }
      });

      group.append('text')
        .attr('x', start-10)
        .attr('y', 25+planIdx*(planH+2))
        .style('text-anchor', 'end')
        .text(plan.name);

      list.forEach( item => {
        let duration = item.data.duration;
        let type = item.type;

        if (type === 'travels') {
          group.append('rect')
            .attr('x', start+1)
            .attr('y', 17+planIdx*(planH+5))
            .attr('width', duration*unit)
            .attr('height', 6)
            .style('fill', '#aaa');
        } else {
          let color = scale(item.data.placeId);
          group.append('rect')
            .attr('x', start)
            .attr('y', 10+planIdx*(planH + 5))
            .attr('rx', 5)
            .attr('width', duration*unit)
            .attr('height', planH)
            .style('fill', color)
            .style('stroke-width', 2)
            .style('stroke', d3.color(color).darker());
        }

        start += duration*unit;
      })

    })

  }
}

