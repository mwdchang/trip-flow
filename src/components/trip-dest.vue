<template>
  <div class="modal" style="opacity:0.9" :class="{'show': showDestDialog}">
  <div class="modal-dialog modal-lg"> 
    <div class="modal-content">
      <div class="modal-header"><strong>Add/Edit Destination</strong></div>
      <div class="modal-body">
        <div class="flex-col">
          <div> 
            <input type="text" placeholder="Search" v-model="searchStrModel"> 
            <br>
          </div>
          <div> 
            <div v-for="c in searchCandidates" class="destination-card" v-on:click="select(c)" style="display:inline-block">
              {{c.formatted_address}}<br>
              <div v-if="c.photos">
                <img v-bind:src="c.photos[0].getUrl({maxHeight:65})" v-if="c.photos[0]">
                <img v-bind:src="c.photos[1].getUrl({maxHeight:65})" v-if="c.photos[1]">
                <img v-bind:src="c.photos[2].getUrl({maxHeight:65})" v-if="c.photos[2]">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" v-on:click="cancel()">Cancel</button>
      </div>
    </div>
  </div>
</div>
</template>


<script>
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


import { mapGetters, mapActions } from 'vuex';


export default {
  name: 'TripDest',
  data: () => ({
    searchStrModel: '',
    searchCandidates: []
  }),
  computed: {
    ...mapGetters(['trip', 'searchStr', 'showDestDialog', 'autocompleteService'])
  },
  methods: {
    ...mapActions([
      'setSearchStr', 
      'setShowDestDialog', 
      'getPlaceDetail'
    ]),
    cancel: function() {
      this.setShowDestDialog(false);
    },
    select: function(place) {
      this.trip.addPlace(place);
      this.searchStrModel = '';
    },
    predict: debounce(function() {
      this.autocompleteService.getPlacePredictions({ input: this.searchStr, types:['(cities)']}, predictions => {
        if (!predictions || predictions === null) return;

        let promises = [];
        predictions.forEach( p => {
          if (!p.place_id) return;
          promises.push(this.getPlaceDetail(p.place_id));
        });

        if (promises.length === 0) return;

        Promise.all(promises).then( values => {
          this.searchCandidates = [];
          values.forEach( v => {
            if (v === null) return;
            this.searchCandidates.push(v);
          });
        })
      })
    }, 800)
  },
  watch: {
    searchStr: function(n, o) {
      if (this.searchStr.length < 3) {
        this.searchCandidates = [];
        return;
      }
      this.predict();
    },
    searchStrModel: function changed() {
      this.setSearchStr(this.searchStrModel);
    }
  }
}
</script>

