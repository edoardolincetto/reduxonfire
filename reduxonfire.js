import { ReduxOnFire } from './dist';

const reduxonfire = new ReduxOnFire({
    apiKey: "AIzaSyBAUL8ku9ev0gexmMq2iQZQGJn811VvmQM",
    authDomain: "aterrae-management.firebaseapp.com",
    databaseURL: "https://aterrae-management.firebaseio.com",
    projectId: "aterrae-management",
    storageBucket: "aterrae-management.appspot.com",
    messagingSenderId: "81491556010"
});

reduxonfire.watchAuth();

export default reduxonfire;
