export default class Mock {

  static mockTrip() {
    return {
      name: 'Test trip',
      places: [],
      plans: [],
      updated: 0
    }
  }

  static mockLoggedInUser() {
    return {
      name: 'User Alpha',
      loggedIn: true
    }
  }

  static mockLoggedOutUser() {
    return {
      name: '',
      loggedIn: false
    }
  }
}
