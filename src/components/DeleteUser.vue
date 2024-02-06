<template>
    <div>
      <h2>Remove a User</h2>
        <strong><label for="itemName">Select User to Remove:</label> </strong>
      
      <select v-model="selectedUser" class="large-dropdown">
        <option v-for="user in users" :key="user.item_id" :value="user.employee_name">
          {{ user.employee_name }}
        </option>
      </select>
  
      <div class="button-container">
          <button style="--c: #EC8700; --b: 5px; --s: 12px;" @click="deleteUser">Delete User</button>
      </div>
  
      <div class="button-container">
          <button style="--c: pink; --b: 5px; --s: 12px;" @click="navigateTo('/admin')">Return</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  /**
 * Vue component managing items and selected item for deletion.
 * @module ItemManager
 */
  export default {
    data() {
      return {
        users: [],
        selectedUser: null,
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      /**
     * Fetches all users.
     * @public
     */
      fetchUsers() {
        axios.get('https://node-backend-project-3-902-04.onrender.com/user')
          .then(response => {
            console.log('Fetched users:', response.data);
            this.users = response.data;
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      },
      /**
     * Deletes the selected user.
     * If no user is selected, logs an error.
     * @public
     */
      deleteUser() {
          if (!this.selectedUser) {
              console.error('Please select a user to delete.');
              return;
          }
  
          // Send a request to delete the selected item using POST
          axios.post('https://node-backend-project-3-902-04.onrender.com/deleteUser', { userName: this.selectedUser })
              .then(response => {
              console.log('User deleted successfully:', response.data);
              
              // Clear the selected item
              this.selectedUser = null;
  
              this.navigateTo('/admin');
          })
              .catch(error => {
              console.error('Error deleting user:', error);
              // Handle the error, show a message, etc.
          });
      },
      /**
     * Navigates to the specified path using Vue Router.
     * @param {string} path - The path to navigate to.
     * @public
     */
      navigateTo(path) {
        this.$router.push(path); // Use Vue Router to navigate to the specified path
      },
    },
  };
  </script>
  
  <style>
  .large-dropdown {
      width: 300px; /* Adjust the width as needed */
      padding: 8px; /* Add padding for better appearance */
      font-size: 24px !important; /* Adjust font size as needed and use !important */
      border: 1px solid #ccc; /* Add a 1px solid border with a light gray color */
      border-radius: 4px; /* Optional: Add border-radius for rounded corners */
  }
  
  .button-container {
      margin-top: 10px; /* Add margin to separate buttons */
  }
  </style>
  