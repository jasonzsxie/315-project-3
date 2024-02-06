<template>
    <div class="about">
      <h1>This is Manager Order Log page</h1>
    </div>
    
    <div class="scrollable-pane">
    <table v-if="inventory.length > 0">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Price</th>
        <th>Time of Order</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in inventory" :key="item.order_id">
        <td>{{ item.order_id }}</td>
        <td>{{ item.price.toFixed(2) }}</td>
        <td>{{ formatOrderTime(item.order_time) }}</td> 
        <td>
      <!-- Button to delete the entry -->
      <button class="delete-button" @click="deleteEntry(item.order_id)">Delete</button>
    </td>
      </tr>
    </tbody>
    </table>
    </div>
    <div class="button-container">
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/manager')">Return</button>
    </div>
</template>

<script>
  // import ManagerOrderLog from '../components/ManagerOrderLog.vue'
  // import ManagerSaleRevenue from '../components/ManagerSalesRevenue.vue'
  // import ManagerInventoryManagement from '../components/ManagerInventoryManagement.vue'
  // import ManagerProductUsage from '../components/ManagerProductUsage.vue'
  import axios from 'axios'

  /**
 * Represents a Vue component managing inventory and related actions.
 * @module InventoryManager
 * @vue
 */
  export default {
      
    components: {
      //HelloWorld
      // ManagerOrderLog,
      // ManagerSaleRevenue,
      // ManagerInventoryManagement,
      // ManagerProductUsage
    },
    data() {
      return {
        inventory: [],
        error: null,
      }
    },
    mounted() {
      /**
     * Fetches inventory data when the component is mounted.
     * @function
     * @name mounted
     * @public
     */
      this.fetchInventory();
    },
    
    methods: { 
      /**
     * Formats the order time.
     * @function
     * @name formatOrderTime
     * @param {string} orderTime - The order time.
     * @returns {string} - The formatted order time.
     * @public
     */
      formatOrderTime(orderTime) {
        const date = new Date(orderTime);
        return date.toLocaleString(); // Adjust the format as needed
      },
      /**
     * Deletes an entry from the database by its order ID.
     * @param {number} orderId - The ID of the order to delete.
     */
    async deleteEntry(orderId) {
      try {
        // Make a DELETE request to the API endpoint with the order ID to delete
        await axios.delete(`https://node-backend-project-3-902-04.onrender.com/manager/orderLog/${orderId}`);
        
        // If successful, remove the deleted entry from the local inventory
        this.inventory = this.inventory.filter(item => item.order_id !== orderId);
      } catch (error) {
        this.error = error.message;
        console.error('An error occurred while deleting the entry:', error);
      }
    },
      /**
     * Fetches inventory data from the API endpoint.
     * @async
     * @function
     * @name fetchInventory
     * @returns {Promise<void>} - Promise resolving after fetching inventory data.
     * @public
     */
      async fetchInventory() {
        try {
          const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/orderLog'); // inventory is stored at this endpoint. TODO: check if this works in AWS deployment.
          this.inventory = response.data;
          
        } catch (error) {
          this.error = error.message;
          console.error('An error occurred:', error);
        }
      },
      /**
     * Navigates to the specified path using Vue Router.
     * @function
     * @name navigateTo
     * @param {string} path - The path to navigate to.
     * @public
     */
      navigateTo(path) {
      this.$router.push(path); // Use Vue Router to navigate to the specified path
    }
    } 
  }
  
</script>

<style>
  /* Container for the buttons */
  .button-container {
    display: flex;
    flex-direction: column; /* Arrange buttons vertically */
    align-items: center; /* Center buttons horizontally */
    margin-top: 30px;
  }

  /* Common styles for buttons */
  button {
    --b: 3px;   /* Border thickness */
    --s: .15em; /* Size of the corner */
    --c: #412C94; /* Button color */

    /* Button styles using custom properties */
    width: 1000px;
    /* padding: calc(.5em + var(--s)) calc(3em + var(--s));   */
    padding: 60px;
    color: var(--c);
    --_p: var(--s);
    background:
      conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--c) 0)
      var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
    transition: .3s linear, color 0s, background-color 0s;
    outline: var(--b) solid #0000;
    outline-offset: .2em;
    font-family: system-ui, sans-serif;
    font-weight: bold;
    font-size: 4rem;
    cursor: pointer;
    border: none;
    margin: .1em;
  }

  /* Button hover and focus styles */
  button:hover,
  button:focus-visible {
    --_p: 0px;
    outline-color: var(--c);
    outline-offset: .05em;
  }

  /* Button active state styles */
  button:active {
    background: var(--c);
    color: white;
  }
   /* Container for the entire content */
   .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Center content vertically */
    margin-top: 30px;
    height: 100vh;
  }

  /* Styles for the scrollable pane */
  .scrollable-pane {
    width: 60%;
    max-height: 60vh;
    overflow-y: auto;
    margin-top: 20px;
    margin-left: auto; /* Center horizontally */
    margin-right: auto; /* Center horizontally */
    flex-shrink: 0; /* Prevent shrinking */
  }

  /* Styles for the table */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  /* Styles for the loading and error messages */
  p {
    margin-top: 20px;
  }
  button.delete-button {
    --b: 1px;   /* Border thickness */
    --s: .1em;  /* Size of the corner */
    --c: #FF0000; /* Delete button color */

    /* Button styles using custom properties */
    padding: 6px; /* Adjust padding to control the button height */
    width: 60px; /* Adjust the width of the button */
    font-size: 12px; /* Adjust font size */
    --_p: var(--s);
    color: var(--c);
    background:
      conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--c) 0)
      var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
    transition: .3s linear, color 0s, background-color 0s;
    outline: var(--b) solid #0000;
    outline-offset: .2em;
    font-family: system-ui, sans-serif;
    cursor: pointer;
    border: none;
    margin: .1em;
  }

  /* Hover and focus styles for the smaller delete button */
  button.delete-button:hover,
  button.delete-button:focus-visible {
    --_p: 0px;
    outline-color: var(--c);
    outline-offset: .05em;
  }

  /* Active state styles for the smaller delete button */
  button.delete-button:active {
    background: var(--c);
    color: white;
  }
</style>