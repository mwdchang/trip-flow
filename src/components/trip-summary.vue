<template>
  <div style="width:50%; height:99%" id="summary">
    <ul class="nav nav-tabs" >
      <li class="nav-item" @click="switchTo('summary')">
        <a v-bind:class="{active: trip.view ==='summary'}" class="nav-link" href="#">Summary</a>
      </li>
      <li class="nav-item" @click="switchTo('plans')">
        <a v-bind:class="{active: trip.view ==='plans'}" class="nav-link" href="#">Plans </a>
      </li>
      <li class="nav-item" @click="switchTo('destinations')">
        <a v-bind:class="{active: trip.view==='destinations'}" class="nav-link" href="#">Destinations</a>
      </li>
    </ul>
  
    <div v-if="trip.view==='summary'" style="padding:0.5rem">
      <table class="table">
        <tbody>
          <tr><td colspan="2"><strong>{{trip.name}}</strong></td></tr>
          <tr><td>Total destinations</td><td>{{trip.places.length}}</td></tr>
          <tr><td>Destinations used</td><td></td></tr>
          <tr><td>Number of plans</td><td>{{trip.plans.length}}</td></tr>
          <tr><td>Last updated</td><td>{{ trip.updated | formatDate }}</td></tr>
          <tr><td>Last updater</td><td></td></tr>
        </tbody>
      </table>
    </div>

    <div v-if="trip.view==='plans'" style="padding:0.5rem">
      <div v-if="trip.plans.length === 0">
        Click on <strong><em>New Plan</em></strong> to add a new trip plan.
      </div>

      <div class="flex-row">
        <div style="max-height: 25rem; overflow-y: scroll">
          <div v-for="(plan, idx) of trip.plans" @click="show(plan, idx)" class="plan-card" :key="idx" :class="{'active': currentPlan && currentPlan.name === plan.name}">
            {{plan.name}} <br>
            <em>{{plan.itineraries.length}} destinations</em>
            <br>
          </div>
        </div> 

        <div style="margin-left: 0.5rem; padding-left: 1.0rem;  border-left: 1px solid #ddd; flex:1" v-if="currentPlan">
          <div class="flex-row">
            <button class="btn btn-sm btn-primary" @click="editPlan()">Edit</button>
            &nbsp;
            <button class="btn btn-sm btn-danger" @click="deletePlan()">Delete</button>
          </div>
          <table class="table" style="margin-top: 0.5rem">
            <tbody>
              <tr v-for="(item, idx) of listPlan(currentPlan)" :key="idx">
                <td style="padding:0; position:relative; border: 0; width:25px">
                  <div style="position:absolute; top:0; left:9px; width:2px; height:100%; background: #AAA"></div>
                  <div v-if="item.type === 'itineraries'" style="position:absolute; left:0px; width:20px; height:20px; background: #EEE; border:2px solid #AAA; border-radius:50%"></div>
                </td>
                <td v-if="item.type==='itineraries'">{{findPlace(item.data.placeId).name}}</td>
                <td v-if="item.type==='travels'" style="text-align:center"><em>...Travel...</em></td>
                <td>{{item.data.duration}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <div v-if="trip.view==='destinations'" style="padding:0.5rem; max-height:25rem; overflow-y: scroll">
      <div v-if="trip.places.length === 0">
        Click on <strong><em>New Destination</em></strong> to add destinations to your trip.
      </div>
      <table class="table" v-if="trip.view==='destinations'">
        <tbody>
          <tr v-for="(place, idx) in trip.places" :key="idx">
            <td>
              {{place.name}}
            </td>
            <td>
              <div v-if="place.photos">
                <img v-bind:src="place.photos[0].getUrl({maxHeight:50})" v-if="place.photos[0]">
                <img v-bind:src="place.photos[1].getUrl({maxHeight:50})" v-if="place.photos[1]">
                <img v-bind:src="place.photos[2].getUrl({maxHeight:50})" v-if="place.photos[2]">
              </div>
            </td>
            <td>
              <span v-if="isPlaceUsed(place.placeId) === true" style="color:#CCC">Used</span>
              <button v-if="isPlaceUsed(place.placeId) === false" class="btn btn-sm btn-danger" @click="deletePlace(place.placeId)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import * as d3 from 'd3';
import _ from 'lodash';

import DB from '../util/db';

export default {
  name: 'trip-summary',
  filters: {
    formatDate: function(t) {
      if (_.isNumber(t) === false) return '';
      return d3.timeFormat('%Y-%m-%d %I:%M:%S %p')(+t);
    }
  },
  computed: {
    ...mapGetters([
      'trip',
      'currentPlan',
      'currentPlanIdx'
    ])
  },
  methods: {
    ...mapActions([
      'setShowPlanDialog',
      'setCurrentPlan',
      'setCurrentPlanIdx',
    ]),
    listPlan: function(p) { return this.trip.listPlan(p); },
    findPlace: function(id) { return this.trip.findPlace(id); },
    switchTo: function(view) {
      this.trip.view = view;
    },
    show: function(plan, idx) {
      this.setCurrentPlan(plan);
      this.setCurrentPlanIdx(idx);
    },
    isPlaceUsed: function(placeId) {
      let all = _.flatten(this.trip.plans.map(p => {
        return p.itineraries.map(dest => dest.placeId);
      }));
      return all.indexOf(placeId) >= 0;
    },
    deletePlace: function(placeId) {
      if (placeId !== null) {
        let idx = _.findIndex(this.trip.places, p => {
          return p.placeId === placeId;
        })
        if (idx !== -1) {
          this.trip.places.splice(idx, 1);
        }
        DB.writeDB('/Trip/' + this.trip.name, this.trip.toObj());
      }
    },
    editPlan: function() {
      this.setShowPlanDialog(true);
    },
    deletePlan: function() {
      
      if (this.currentPlanIdx > -1) {
        this.trip.plans.splice(this.currentPlanIdx, 1);
        this.setCurrentPlan(null);
        this.setCurrentPlanIdx(-1);
        DB.writeDB('/Trip/' + this.trip.name, this.trip.toObj());
      }
      
    }
  }

}
</script>


<style lang="scss">
.plan-card  {
  padding: 0.25rem 0.5rem; 
  border: 1px solid #ddd; 
  border-radius: 4px;
  margin: 0.25rem;

  &.active {
    background: #DDD;
  }
}
</style>
