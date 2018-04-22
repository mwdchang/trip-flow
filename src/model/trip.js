/********************************************************************************
*
* Basic building blocks
* 
* Trip
* - id: string
* - name:  string
* - plans: Plan[]
*
* Plan:
* - id: string
* - name: string
* - start: number
* - end:   number 
* - items: Item[]
*
*
********************************************************************************/
export default class Trip {
  constructor() {
    this.name = '';
    this.plans = [];
    this.places = [];
    this.updated = 0;

    this.view = 'summary';
  }

  addPlan(plan) {
    this.plans.push(plan);
  }

  addPlace(place) {
    this.places.push(place);
  }

  findPlace(placeId) {
    let r = _.find(this.places, d => d.placeId === placeId);
    return r || {};
  }

  maxLength() {
    return _.max(
      this.plans.map(plan => {
        let list = this.listPlan(plan);
        return _.sum(list.map(item => item.data.duration));
      })
    );
  }

  dateFormat(t) {
    if (_.isNumber(t) === false) return '';
    return d3.timeFormat('%Y-%m-%d %I:%M:%S %p')(+t);
  }

  listPlan(plan) {
    let r = [];
    for (let i=0; i < plan.itineraries.length; i++) {
      r.push({
        type: 'itineraries',
        data: plan.itineraries[i]
      })
      if (i < plan.travels.length) {
        r.push({
          type: 'travels',
          data: plan.travels[i]
        })
      }
    }
    return r;
  }

  load(text) {
    let data = JSON.parse(text)
    this.loadJSON(data)
  }

  loadJSON(data) {
    this.name = data.name || '';
    this.places = data.places || [];
    this.plans = data.plans || [];
    this.updated = data.updated || '';

    this.sanitize();
  }

  sanitize() {
    if (this.plans.length === 0) return;

    this.plans.forEach( plan => {
      plan.itineraries.forEach( d => {
        d.duration = +d.duration;
      })
      plan.travels.forEach( d => {
        d.duration = +d.duration;
      })
    });
  }

  toObj() {
    this.sanitize();
    return {
      name: this.name,
      places: this.places.map(d => d.placeId),
      plans: this.plans,
      updated: (new Date()).getTime()
    }
  }
}
