<template>
  <div>
    <div v-if="isAuthenticated">
      <p>Welcome: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <!-- Add more user information as needed -->
    </div>
    <div v-else>
      <button @click="login">Log in</button>
    </div>
    <button v-if="isAuthenticated" @click="logout">Log out</button>
    <button v-if="isAuthenticated" @click="getRole">Get Role</button>
  
  </div>

  </template>
  
  <script>
  import { useAuth0 } from '@auth0/auth0-vue';
  //import axios from 'axios';
  import { onMounted } from 'vue';
  import { useStore } from 'vuex'; // Import useStore from vuex
  
  
    /**
 * View for Login
 * @module Loginview
 */
  export default {
  
  setup() {
    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
    const store = useStore(); // Get access to the Vuex store
  
    console.log('User Object:', user);
  
  
    onMounted(async () => {
     
     });
  
    return {
      user,
      isAuthenticated,
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      getRole: () => {
        if (isAuthenticated) {
          // Commit the mutation to set the userName in the Vuex store
          store.commit('change', user._rawValue.name);
          // Access and log the userName from the store
          console.log('UserName from store:', store.state.userName);      
      }

 
      }
    };
  },
  
  };
  </script>