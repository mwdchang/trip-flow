const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDFqeomnCXYFfuIj3iSf5NpHBgRDUXGB4k',
  authDomain: "tripflow-1509338122882.firebaseapp.com",
  databaseURL: 'https://tripflow-1509338122882.firebaseio.com/',
}
firebase.initializeApp(FIREBASE_CONFIG);


const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();


function readDB(path) {
  return database.ref(path).once('value')
}

function writeDB(path, value) {
  return database.ref(path).set(value)
}

function googleSignin() {
   firebase.auth()
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token)
      console.log(user)
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code)
      console.log(error.message)
   });
}

function googleSignout() {
   firebase.auth().signOut()
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}


export {readDB}
export {writeDB}
export {googleSignin}
export {googleSignout}
