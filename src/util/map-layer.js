/** 
 * Wraps a google map
 **/
export default class MapLayer {
  constructor(map) {
    this.map = map;
    this.mapObjects = [];
    this.usePathIcon = true;
  }

  refresh(trip) {
    this.mapObjects.forEach(obj => {
      obj.setMap(null)
    });

    if (trip.plans.length === 0) return;
    this.renderPlans(trip);
    this.renderPlaces(trip);
  }

  renderPlans(trip) {
    let palette = ['#FF0000', '#CC0099', '#448822', '#884488', '#336699'];

    // Define a symbol using SVG path notation, with an opacity of 1.
    let lineSymbol = {
      // path: 'M 0,-1 0,1',
      path: 'M 0,-0.2 0,0.2',
      strokeOpacity: 0.5,
      scale: 4
    };

    trip.plans.forEach( (plan, pIdx) => {
      let poly = []
      plan.itineraries.forEach(it => {
        let place = _.find(trip.places, p => p.placeId === it.placeId)
        let lat = place.geometry.location.lat()
        let lng = place.geometry.location.lng()
        poly.push({lat: lat, lng: lng})
      });
      let ppath = null;

      ppath = new google.maps.Polyline({
        path: poly,
        geodesic: true,
        strokeColor: palette[pIdx],
        strokeOpacity: 0.8,
        strokeWeight: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '10px'
        }]
      });
      if (this.usePathIcon === false) {
        ppath = new google.maps.Polyline({
          path: poly,
          geodesic: true,
          strokeColor: palette[pIdx],
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
      }
      ppath.setMap(this.map);
      this.mapObjects.push(ppath);
    });
  }

  renderPlaces(trip) {
    let bounds = new google.maps.LatLngBounds();

    trip.places.forEach(place => {
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let c = new google.maps.Circle({
        map: this.map,
        center: { 
          lat: lat,
          lng: lng
        },
        strokeColor: '#04f',
        strokeWeight: 2,
        fillColor: '#04f',
        radius: 25000
      });
      this.mapObjects.push(c);
      bounds.extend(place.geometry.location);
    });
    this.map.fitBounds(bounds);
  }
}

