import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

import Mock from '../util/mock';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /* Main data */
    user: Mock.mockLoggedInUser(),
    trip: Mock.mockTrip(),

    /* Cache some services */
    placeService: null,
    autocompleteService: null,

    /* User input stuff */
    searchStr:  '',

    /* Dialog control */
    showNewTripDialog: false,
    showLoadTripDialog: false,
    showPlanDialog: false,
    showDestDialog: false,
  },
  getters: {
    user: (state) => {
      console.log('checking state', state);
      if (state.user === null) {
        return {
          name: null,
          loggedIn: false
        };
      } else {
        return {
          name: state.user.name,
          loggedIn: true
        };
      }
    },
    trip: (state) => state.trip,
    searchStr: (state) => state.searchStr,
    showNewTripDialog: (state) => state.showNewTripDialog,
    showLoadTripDialog: (state) => state.showLoadTripDialog,
    showPlanDialog: (state) => state.showPlanDialog,
    showDestDialog: (state) => state.showDestDialog
  },
  actions: {
    setSearchStr({commit}, s) {
      commit('setSearchStr', s);
    },
    setShowNewTripDialog({commit}, v) {
      commit('setShowNewTripDialog', v);
    },
    setShowLoadTripDialog({commit}, v) {
      console.log('setShowLoadTripDialog', v);
      commit('setShowLoadTripDialog', v);
    },
    setShowPlanDialog({commit}, v) {
      commit('setShowPlanDialog', v);
    },
    setShowDestDialog({commit}, v) {
      commit('setShowDestDialog', v);
    },
    setTrip({commit}, trip) {
      commit('setTrip', trip);
    },
    setPlaceService({commit}, srv) {
      commit('setPlaceService', srv);
    },
    setAutocompleteService({commit}, srv) {
      commit('setAutocompleteService', srv);
    }
  },
  mutations: {
    setSearchStr(state, s) {
      state.searchStr = s;
    },
    setShowNewTripDialog(state, v) {
      state.showNewTripDialog = v;
    },
    setShowLoadTripDialog(state, v) {
      console.log('???', v);
      state.showLoadTripDialog = v;
    },
    setShowPlanDialog(state, v) {
      state.showPlanDialog = v;
    },
    setShowDestDialog(state, v) {
      state.showDestDialog = v;
    },
    setTrip(state, trip) {
      state.trip = _.cloneDeep(trip);
    },
    setPlaceService(state, srv) {
      state.placeService = srv
    },
    setAutocompleteService(state, srv) {
      state.autocompleteService = srv;
    }
  }
});


