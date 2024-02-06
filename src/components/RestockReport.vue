<template>
    <div class="about">
      <h1>Items that need Restocking </h1>
    </div>
    <div class="table-pane">
        <table class="inventory-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Minimum Threshold</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="inventory.length === 0">
                    <tr>
                        <td v-for="column in 4" :key="column">Not Available</td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="item in inventory" :key="item.product_name">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.minimum_threshold }}</td>
                        <td>{{ item.price }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    <div class="button-container">
        <button style="--c: #412C94; --b: 5px; --s: 12px;" @click="navigateTo('/salesrevenue')">Return</button>
    </div>
</template>

<script>
  import axios from 'axios'
/**
 * Represents a Vue component responsible for managing inventory restocking.
 * @exports InventoryRestockComponent
 * @type {object}
 */
  export default {
    data() {
      return {
        inventory: [],
        error: null,
      }
    },
    mounted() {
      this.fetchInventory();
    },
    components: {
      //HelloWorld
      // ManagerOrderLog,
      // ManagerSaleRevenue,
      // ManagerInventoryManagement,
      // ManagerProductUsage
    },
    methods: { 
      /**
     * Fetches inventory data from the backend API.
     * @async
     * @method
     * @public
     */
      async fetchInventory() {
        try {
          const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/Restock'); // inventory is stored at this endpoint. TODO: check if this works in AWS deployment.
          this.inventory = response.data;
          
        } catch (error) {
          this.error = error.message;
          console.error('An error occurred:', error);
        }
      },
       /**
     * Navigates to a specified route using Vue Router.
     * @param {string} path - The path to navigate to.
     * @method
     * @public
     */
      navigateTo(path) {
      this.$router.push(path); // Use Vue Router to navigate to the specified path
    }
    }
  }
  
</script>

<style scoped>
    .table-pane {
        max-height: 60vh; /* Set the table height to 60% of the viewport height */
        overflow-y: auto; /* Enable vertical scrolling if needed */
        margin: 0 auto; /* Center the table horizontally */
    }

    .inventory-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px; /* Add some margin for better spacing */
    }

    .inventory-table th, .inventory-table td {
        border: 1px solid #ddd;
        padding: 15px; /* Increase the padding for better spacing */
        text-align: left;
    }
</style>