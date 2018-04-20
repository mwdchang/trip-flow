<template>
<div class="modal" style="opacity:0.9" :class="{'show': showLoadTripDialog}">
  <div class="modal-dialog modal-lg"> 
    <div class="modal-content">
      <div class="modal-header">
        <strong>Load Trip </strong>
      </div>
      <div class="modal-body">
        <table class="table table-hover">
          <tbody>
            <tr v-for="trip of trips" style="cursor:pointer" v-on:click="load(trip)">
              <td>{{trip}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" v-on:click="cancel()">Cancel</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DB from '../util/db';
import Trip from '../model/trip';

export default {
  name: 'TripLoad',
  data: () => ({
    trips: []
  }),
  created: function() {
    DB.readDB('/Trip').then(values => {
      let trips = Object.keys(values.val());
      trips.forEach( t => {
        this.trips.push(t);
      });
      console.log('Done loading trips...', this.trips);
    });
  },
  computed: {
    ...mapGetters(['showLoadTripDialog'])
  },
  methods: {
    ...mapActions(['setShowLoadTripDialog']),
    load: function(name) {
      const path = '/Trip/' + name;
      DB.readDB(path).then( d => {
        if (d.val() === null) return;

        const trip = new Trip();
        trip.loadJSON(d.val());
        let promises = [];
        trip.places.forEach(p => {
          promises.push(this.getDetailsWrapper(p));
        });
        Promise.all(promises).then(values => {
          trip.places = values;
        });

 
        
      });
      this.setShowLoadTripDialog(false);
    },
    cancel: function() {
      this.setShowLoadTripDialog(false);
    }
  }
}
</script>
