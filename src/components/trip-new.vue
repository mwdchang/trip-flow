<template>
  <div class="modal" style="opacity:0.9" :class="{'show': showNewTripDialog}">
  <div class="modal-dialog modal-lg"> 
    <div class="modal-content">
      <div class="modal-header">
        <strong>Add Trip</strong>
      </div>
      <div class="modal-body">
        <input type="text" v-model="name" placeholder="Trip name">
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
  name: 'TripNew',
  data: () => {
    return {name: ''};
  },
  computed: {
    ...mapGetters(['showNewTripDialog', 'trip'])
  },
  methods: {
    ...mapActions(['setShowNewTripDialog']),
    save: function() {
      this.trip.name = this.name;
      DB.writeDB('/Trip/'+this.name, this.trip.toObj());
      this.setShowNewTripDialog(false);
    },
    cancel: function() {
      this.setShowNewTripDialog(false);
    }
  }

}
</script>
