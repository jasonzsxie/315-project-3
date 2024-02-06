import { createApp } from 'vue'
import {createStore } from 'vuex'

import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'; // Active Directory
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'



const vuetify = createVuetify({
  components,
  directives,
})

// Create a new store instance.
const store = createStore({
  state () {
    return {
      userName: ""
    }
  },
  mutations: {
    change (state, newName) {
      state.userName = newName;
    }
  }
})

const app = createApp(App);



app.use(router).use(vuetify).use(store)

const auth0 = (createAuth0({
  domain: "dev-x6hkl6gbuo2upckf.us.auth0.com",
  clientId: "Owj9zzW5rrYty8PQhPVYJhe28k7l9fgh",
  authorizationParams: {
    redirect_uri: window.location.origin
  },
})
);

app.use(auth0).mount('#app');
