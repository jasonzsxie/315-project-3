<template>
  <div class="about">
    <h1>This is Manager Sales & Revenue page</h1>
  </div>
  
  <div class="button-columns">
        <div class="column">
            <div class="button-container">
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/restockReport')">Restock Report</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/excessReport')">Excess Report</button>

            </div>
        </div>
    
        <div class="column">
            <div class="button-container">
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/salesReport')">Sales Report</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/salesTrend')">Sales Trend</button>
            </div> 
        </div>
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
  // import axios from 'axios'
/**
 * Represents a Vue component for the sales and revenue page.
 * @exports DefaultComponent
 * @type {object}
 */
  export default {
      
    components: {
      //HelloWorld
      // ManagerOrderLog,
      // ManagerSaleRevenue,
      // ManagerInventoryManagement,
      // ManagerProductUsage
    },
    methods: { 
      // async fetchInventory() {
      //   try {
      //     const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/menu'); // inventory is stored at this endpoint. TODO: check if this works in AWS deployment.
      //     this.inventory = response.data;
      //   } catch (error) {
      //     this.error = error.message;
      //     console.error('An error occurred:', error);
      //   }
      // },
      /**
     * Navigates to a specified path using Vue Router.
     * @method
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
  
</style>