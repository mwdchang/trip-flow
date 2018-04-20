<template>
  <div id="app">
   <trip-header></trip-header>

    <div class="flex-row"> 
      <trip-summary></trip-summary>
      <div style="width:50%">
        <div id="googleMap" style="height:20rem; width:100%" class="todo"></div>
        <div class="flex-column">
          <div>Plans Timeline</div>
          <div style="width:100%; min-height:8rem" id="graph">
          </div>
        </div>
      </div>
    </div>

   <trip-new></trip-new>
   <trip-load></trip-load>
   <trip-dest></trip-dest>
   <trip-plan></trip-plan>

  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import TripHeader from './components/header.vue';
import TripNew from './components/trip-new.vue';
import TripLoad from './components/trip-load.vue';
import TripDest from './components/trip-dest.vue';
import TripSummary from './components/trip-summary.vue';
import TripPlan from './components/trip-plan.vue';

export default {
  name: 'app',
  components: {
    TripHeader,
    TripNew,
    TripLoad,
    TripDest,
    TripSummary,
    TripPlan
  },
  mounted() {
    const center = new google.maps.LatLng(51.0, 0.0);
    const map = new google.maps.Map(document.getElementById('googleMap'), {
      center: center,
      zoom: 5,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      streetViewControl: false
    });
    const autocompleteService = new google.maps.places.AutocompleteService();
    const placeService = new google.maps.places.PlacesService(map);

    this.setPlaceService(placeService);
    this.setAutocompleteService(autocompleteService);
  },
  methods: {
    ...mapActions([
      'setPlaceService',
      'setAutocompleteService'
    ])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}

select {
  height: 1.5rem;
  border-radius:0 !important;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.todo {
  border: 1px solid #ccc;
  background: #EEE;
}

.modal {
  display: none;
}

.modal.show {
  display: block; 
}


.modal-header, .modal-footer {
  padding-top: 10px;
  padding-bottom: 10px;
}

.destination-card {
  width: 48%;
  margin: 2px;
  padding: 4px 8px;
  border: 1px solid #DDD;
  border-radius: 2px;
  cursor: pointer;
}

.destination-card:hover {
  background: #69C;
  color: #EEE;
}

.plan-card  {
  padding: 0.25rem 0.5rem; 
  border: 1px solid #ddd; 
  border-radius: 4px;
  margin: 0.25rem;
}

.action-button {
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 2px;
  border-left: 1px solid #DDD;
  box-sizing: border-box;
}

.btn {
  cursor: pointer;
}

.btn-sm {
  padding: 0.1rem 0.2rem;
  font-size: 0.8rem;
}

.action-button:hover {
  padding: 2px 5px;
  background: #69C;
  color: #EEE;
}

/* override bootstrap */
td {
  padding: 0.25rem 0.5rem !important;
}




</style>
