<template>
    <div>
      <h2>Update User</h2>
  
      <!-- Form to update an user -->
      <form @submit.prevent="updateUser">
  
        <div class="form-group">
          <label for="empName" class="form-label">Select User to Update:</label>
          <select v-model="selectedUser" id="empName" class="form-input" required>
            <option v-for="user in users" :key="user.employee_id" :value="user.employee_name">
              {{ user.employee_name }}
            </option>
          </select>
  
          <!-- Display current values of selected user's attributes -->
          <div v-if="selectedUserAttributes">
            <p>Current Name: {{ selectedUserAttributes.employee_name }}</p>
            <p>Current ID: {{ selectedUserAttributes.employee_id }}</p>
            <p>Current Role: {{ selectedUserAttributes.employee_role }}</p>
            <p>Current Sales Made: {{ selectedUserAttributes.sales_made }}</p>
          </div>
        </div>
  
        <div class="form-group">
          <label for="newRole" class="form-label">New Role:</label>
          <input v-model="newAttributes.employee_role" type="text" id="newEmpRole" class="form-input">
        </div>
  
        <div class="form-group">
          <label for="newSalesMade" class="form-label">New # Sales Made:</label>
          <input v-model="newAttributes.sales_amde" type="number" id="newSalesMade" class="form-input" required>
        </div>
  
        <!-- Submit button to update the user -->
        <button style="--c: #F9B831; --b: 5px; --s: 12px;" type="submit">Update User</button>
      </form>
  
      <!-- Button to return to the admin page -->
      <button style="--c: pink; --b: 5px; --s: 12px;" @click="navigateTo('/admin')">Return</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  /**
 * Represents a Vue component for updating user attributes.
 * @exports UpdateUserComponent
 * @type {object}
 */
  export default {
    data() {
      return {
        users: [],
        selectedUser: null,
        newAttributes: {
          employee_id: 0,
          sales_made: 0,
          employee_name: null,
          employee_role: null,
        },
        selectedUserAttributes: null, // Initialize as null
      };
    },
    mounted() {
      this.fetchUsers();
    },
    watch: {
      /**
     * Watch for changes in the selected user and fetch its attributes.
     * @type {string|null}
     */
      // Watch for changes in the selected user and fetch its attributes
      selectedUser: {
        handler: 'fetchSelectedUserAttributes',
        immediate: true, // Fetch attributes immediately on mount
      },
    },
    methods: {
      /**
     * Fetches all users from the API.
     * @function
     * @public
     * @returns {void}
     */
      fetchUsers() {
        // Fetch all users
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
     * Fetches attributes of the selected user.
     * @function
     * @public
     * @returns {void}
     */
      fetchSelectedUserAttributes() {
        if (!this.selectedUser || !this.users) {
        console.error('Please select an user.');
        return;
        }

        // Find the selected user in the data
        const selectedUserData = this.users.find(user => user.employee_name === this.selectedUser);

        if (selectedUserData) {
        // Extract attributes from the selected item data
        this.selectedUserAttributes = {
            employee_id: selectedUserData.employee_id,
            sales_made: selectedUserData.sales_made,
            employee_name: selectedUserData.employee_name,
            employee_role: selectedUserData.employee_role,
        };

        console.log('User attributes:', this.selectedUserAttributes);
        } else {
        console.error('Selected user not found in employee data.');
        }
    },
    /**
     * Updates the selected user's attributes based on newAttributes.
     * @function
     * @returns {void}
     * @public
     */
    updateUser() {
      if (!this.selectedUser) {
        console.error('Please select a user to update.');
        return;
      }

      // Create a new object to store only non-zero attributes
      const updatedAttributes = {};
      for (const key in this.newAttributes) {
        if (this.newAttributes[key] !== 0) {
          updatedAttributes[key] = this.newAttributes[key];
        }
      }

      // Check if there are any attributes to update
      if (Object.keys(updatedAttributes).length === 0) {
        console.log('No attributes to update.');
        return;
      }

      // Send a request to update the selected item with non-zero attributes
      axios.post('https://node-backend-project-3-902-04.onrender.com/updateUser', {
        itemName: this.selectedUser,
        newAttributes: updatedAttributes,
      })
        .then(response => {
             console.log('Item updated successfully:', response.data);

            // Clear the selected item box
            this.selectedUser = null;

            // Navigate back to the inventorymanagement page
            this.navigateTo('/admin');
        })
        .catch(error => {
          console.error('Error updating user:', error);
          // Handle the error, show a message, etc.
        });
    },
    /**
     * Navigates to the specified path using Vue Router.
     * @function
     * @param {string} path - The path to navigate to.
     * @public
     * @returns {void}
     */
      navigateTo(path) {
        this.$router.push(path); // Use Vue Router to navigate to the specified path
      },
    },
  };
  </script>
  
  <style>
  /* Your component styles here */
  </style>
  