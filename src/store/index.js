import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    trip: null,
    showNewTripDialog: false,
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
    showNewTripDialog: (state) => state.showNewTripDialog
  },
  actions: {
    setShowNewTripDialog({commit}, v) {
      commit('setShowNewTripDialog', v);
    }
  },
  mutations: {
    setShowNewTripDialog(state, v) {
      state.showNewTripDialog = v;
    }
  }
});


