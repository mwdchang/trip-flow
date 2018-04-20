<template>
<div class="header flex-row" style="padding:0.25rem; justify-content: left; background:none">
  <h5 style="flex:2; text-align:left"> Trip Flow <span style="font-size: 50%">{{user.name}}</span></h5>
  <div class="flex-row" style="flex:1">
     <!--
     <a target="_blank" href="http://github.com/mwdchang/trip-flow"><i class="fa fa-github"></i>&nbsp;Fork me on GitHub</a>
     &nbsp;
     -->
     <button class="btn btn-sm btn-info" v-on:click="setShowDestDialog(true)">New Destination</button>
     <button class="btn btn-sm btn-info" v-on:click="setShowPlanDialog(true)">New Plan</button>
     <button class="btn btn-sm btn-info" v-on:click="setShowNewTripDialog(true)">New Trip</button>
     <button class="btn btn-sm btn-info" v-on:click="setShowLoadTripDialog(true)">Load Trip</button>
     <button v-if="user.loggedIn === false" class="btn btn-sm btn-primary" v-on:click="signin()">Sign in </button>
     <button v-if="user.loggedIn === true" class="btn btn-sm btn-primary" v-on:click="signout()">Sign out </button>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TripHeader',
  created: function() {
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions([
      'setShowNewTripDialog',
      'setShowLoadTripDialog',
      'setShowPlanDialog',
      'setShowDestDialog',
    ]),
    signin: function() {
      this.googleSignin();
    },
    signout: function() {
      this.googleSignout();
    }
  }
}
</script>

<style lang="scss">
.header {
  .btn {
    margin-right: 5px;
  }
}
</style>
