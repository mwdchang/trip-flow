<template>
<div class="modal" style="opacity:0.9" :class="{'show': showPlanDialog}">
  <div class="modal-dialog modal-lg">
    <div class="modal-content" v-if="currentPlan">
      <div class="modal-header"><strong>Add/Edit Plan</strong></div>
      <div class="modal-body">
        <div> 
          <input type="text" placeholder="Plan name" v-model="currentPlan.name">
        </div>
        <br>
        <div style="display:flex; flex-direction: row">
          <div style="padding-left:0rem; max-height:15rem; overflow-y:scroll; flex: 1; display:flex; flex-direction:row"> 
            <div> 
              Destinations
              <table class="table">
                <thead>
                  <th></th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Notes</th>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in currentPlan.itineraries" :key="idx" v-if="currentPlan.itineraries.length > 0">
                    <td>
                      <button>-</button>
                      <button v-on:click="addRow()">+</button>
                    </td>
                    <td>
                      <select v-model="item.placeId">
                        <option disabled value="">Destinations</option>
                        <!--<option v-for="d in getTripPlaces()" v-bind:value="d.placeId">{{d.formatted_address}}</option>-->
                        <option v-for="d in getTripPlaces()" :key="d.placeId" v-bind:value="d.placeId">{{d.name}}</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" v-model="item.duration" size="4"/>
                    </td>
                    <td>
                      <textarea rows="1"></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div style="margin-left:1rem">
              On Route 
              <table class="table">
                <thead>
                  <th>Route</th>
                  <th>Duration</th>
                </thead>
                <tbody>
                  <tr v-for="(travel, idx) in currentPlan.travels" :key="idx">
                    <td>
                      <span>{{findPlace(travel.from).name}} &gt; {{findPlace(travel.to).name}}</span>
                    </td>
                    <td>
                      <input type="text" v-model="travel.duration" size="4"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" v-on:click="save()">Save</button>
        <button class="btn btn-primary btn-sm" v-on:click="cancel()">Cancel</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import DB from '../util/db';

export default {
  name: 'trip-plan',
  computed: {
    ...mapGetters([
      'showPlanDialog', 
      'currentPlan',
      'trip'
    ])
  },
  methods: {
    ...mapActions(['setShowPlanDialog', 'setCurrentPlan']),
    save: function() {
      let itineraries = this.currentPlan.itineraries.map( d => {
        return {
          placeId: d.placeId,
          duration: d.duration
        };
      });

      let travels = this.currentPlan.travels.map( d => {
        return {
          from: d.from,
          to: d.to,
          duration: d.duration
        };
      });

      if (this.currentPlan.mode === null) { 
        let plan = {
          name: this.currentPlan.name,
          start: 0,
          end: 0,
          itineraries: itineraries,
          travels: travels
        };
        this.trip.addPlan(plan);
        this.currentPlan.mode = null;
      }
      this.trip.sanitize();
      DB.writeDB('/Trip/' + this.trip.name, this.trip.toObj());
      this.setShowPlanDialog(false);
    },
    cancel: function() {
      this.setShowPlanDialog(false);
    },
    getTripPlaces: function() {
      return this.trip.places;
    },
    findPlace: function(placeId) {
      return this.trip.findPlace(placeId);
    },
    addRow() {
      this.currentPlan.itineraries.push({
        placeId: '',
        duration: 0
      });

      let num = this.currentPlan.itineraries.length;
      if (num > 1) {
        this.currentPlan.travels.push({
          from: '', 
          to: '',
          duration: 0
        });
      }
    }
  },
  watch: {
    'currentPlan.itineraries': function() {
      if (_.isNil(this.currentPlan)) return;

      let currentPlan = this.currentPlan;
      let it = currentPlan.itineraries;
      for (let i=0; i < currentPlan.travels.length; i++) {
        let t = currentPlan.travels[i];
        t.from = it[i].placeId;
        t.to = it[i+1].placeId;
      }
    }
  }

}
</script>

