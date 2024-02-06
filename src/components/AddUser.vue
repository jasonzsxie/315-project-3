<template>
    <h2>Add a User</h2>

<div>
  <!-- <p>Put this number into Item ID field: {{ nextItemId }}</p> -->

  <!-- Form to add a new item -->
  <form @submit.prevent="addUser">

    <div class="form-group">
      <label for="itemId" class="form-label">Employee ID:</label>
      <input v-model="newUser.employee_id" type="number" id="empId" class="form-input" required> {{ nextUserId }} 
    </div>

    <div class="form-group">
      <label for="productName" class="form-label">Employee Name:</label>
      <input v-model="newUser.employee_name" type="text" id="empName" class="form-input" required>
    </div>

    <div class="form-group">
      <label for="itemType" class="form-label">Employee Role:</label>
      <select v-model="newUser.employee_role" id="empRole" class="form-input" required>
        <option value="cashier">cashier</option>
        <option value="manager">manager</option>
        <!-- <option value="customer">Customer</option>
        <option value="admin">Admin</option> -->
      </select>
    </div>

    <!-- Display the maximum item_id as a reference for the new item -->

    <button type="submit">Add User</button>
  </form>

  <button style="--c: pink; --b: 5px; --s: 12px;" @click="navigateTo('/admin')">Return</button>
</div>
</template>

<script>
import axios from 'axios';
/**
 * Vue component for adding a new user to the user database
 * @module AddUser
 */
export default {
data() {
  return {
    newUser: {
      employee_id: null,
      sales_made: 0,
      employee_name: '',
      employee_role: null,
    },
    users: [], // Array to store users
    maxUserId: null, // Variable to store the maximum employee_id
    nextUserId: null, // Variable to store the next available employee_id for the new user
  };
},
mounted() {
  this.fetchUsers();
},
methods: {
  /**
 * Finds the maximum user ID from the provided users array.
 * @param {Object[]} items - The array of user objects.
 * @returns {number} - The maximum user ID.
 * @public
 */
  findMaxUserId(items) {
    let maxUserId = -1;
    items.forEach((item) => {
      if (item.employee_id > maxUserId) {
        maxUserId = item.employee_id;
      }
    });
    return maxUserId;
  },
  /**
 * Fetches user data from the API endpoint.
 * @public
 */
  fetchUsers() {
    axios.get('https://node-backend-project-3-902-04.onrender.com/user')
      .then(response => {

        this.users = response.data;

        this.maxUserId = this.findMaxUserId(this.users);

        this.nextUserId = this.maxUserId !== null ? this.maxUserId + 1 : 1;
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  },
  
  /**
 * Adds a new user to the database.
 * @async
 * @public
 */
  async addUser() {
    try {
      // Validate the new user
      if (!this.newUser.employee_id || !this.newUser.employee_name || !this.newUser.employee_role) {
        // Handle validation error
        console.error('Missing required fields');
        return;
      }
      // Send a POST request to add the new user to the database
      const response = await axios.post('https://node-backend-project-3-902-04.onrender.com/addUser', this.newUser);

      // Assuming the response contains the newly added user
      const newUser = response.data;

      // Optionally, perform other actions, clear the form, etc.
      this.newUser = {
        employee_id: null,
        sales_made: 0,
        employee_name: '',
        employee_role: null,
      };

      // Update the nextUserId for the next new item
      this.nextUserId++;

      console.log('Item added successfully:', newUser);

    } catch (error) {
      console.error('Error adding item to inventory:', error);
      // Handle the error, show a message, etc.
      
    }
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
.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 18px;
  display: block;
  margin-bottom: 5px;
}

.form-input {
  width: 30%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
