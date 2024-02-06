<template>
    <div class="about">
      <h1>Sales Report</h1>
    </div>
    <div class="centered-container">
      <div class="date-range-container">
        <div class="date-input">
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" v-model="startDate">
        </div>

        <div class="date-input">
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" v-model="endDate">
        </div>

        <div class="button-wrapper">
    <button class="small-button" @click="checkDateRange">Get Data</button>
  </div>
      </div>
    </div>
    <div class="result-container">
        <table v-if="dateRangeValid"  class="result-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Amount Sold</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(occurrenceCount, productID) in productOccurrences" :key="productID">
                    <td>{{ productID }}</td>
                    <td>{{ occurrenceCount }}</td>
                </tr>
            </tbody>
        </table>
        <div class = "else-container" v-else>
            <h1>Please Enter A Valid Date Range</h1>
        </div>
    </div>
    <div class="button-container">
        <button style="--c: #412C94; --b: 5px; --s: 12px;" @click="navigateTo('/salesrevenue')">Return</button>
    </div>
</template>
<script>
import axios from 'axios'
/**
 * Represents a Vue component responsible for managing sales revenue data.
 * @exports SalesRevenueComponent
 * @type {object}
 */
export default {
  /**
   * Vue data.
   * @property {string} startDate - The start date for querying sales data.
   * @property {string} endDate - The end date for querying sales data.
   * @property {boolean} dateRangeValid - Flag indicating if the date range is valid.
   * @property {Array} orderIDs - Array to store order IDs.
   * @property {object} productMap - A mapping of product IDs to their names.
   * @property {object} productOccurrences - Object to track product occurrences.
   */
  data() {
  return {
    startDate: '',
    endDate: '',
    dateRangeValid: false,
    orderIDs: [],
    productMap:{
      29: "Richards Rainwater",
      30: "Cold Brew High Coffee",
      31: "Nitro Brew High Brew Coffee",
      33: "Beevile Honey Vanilla Cream Soda",
      34: "Limoncito",
      35: "Texacola",
      19: "Chocolate Peanut Butter Brownie",
      23: "Caramel Sauce",
      32: "Root Bexar",
      0: "Small Cup",
      26: "Rainbow Sprinkles",
      2: "Large Cup",
      3: "Pint",
      4: "Small Cone",
      5: "Medium Cone",
      22: "Chocolate Sauce",
      6: "Large Cone",
      7: "Caramel Salt Lick",
      8: "Coffee With Cream",
      9: "Dark Chocolate: Olive Oil & Sea Salt",
      21: "Fig & Fromage",
      1: "Medium Cup",
      20: "Caramel Corn",
      28: "Whipped Cream",
      36: "Cookie",
      27: "Strawberry",
      24: "Toasted Texas Pecans",
      25: "Chocolate Cookie Crumble",
      10: "Fresh Mint and Chocolate Chunk",
      11: "Goat Cheese, Thyme & Honey",
      12: "Hill Country Honey and Vanilla Bean",
      37: "Chocolate Bear",
      13: "Roasted Beets & Fresh Mint",
      14: "Milk Chocolate",
      15: "Texas Sheet Cake",
      16: "Honey Sunbutter",
      17: "Vanilla Pear Cake",
      18: "Blackberry Lime Basil",
    },
    productOccurrences: {},
  };
},
methods: { 
  /**
     * Checks if the provided date range is valid.
     * @async
     * @method
     * @returns {boolean} - Returns true if the date range is valid, otherwise false.
     * @public
     */
      async checkDateRange() {
          try {
              const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/validDate', {
              params: {
                  startDate: this.startDate,
                  endDate: this.endDate,
              },
              });

              this.dateRangeValid = response.data.total > 0;

              if (this.dateRangeValid) {
                  await this.performSecondQuery();
              }else {
              // Reset results if date range is not valid
                  this.orderIDs = [];
              }
          } catch (error) {
              console.error('An error occurred while checking the date range:', error);
              return false;
          }   
      },
      /**
     * Performs a second query based on the date range that populates the each product with the number of occurences in each order in the date range.
     * @async
     * @method
     * @public
     */
      async performSecondQuery(){
          try{
              const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/orderIDSGivenDate', {
                      params: {
                      startDate: this.startDate,
                      endDate: this.endDate,
                      },
                  });

                  this.productOccurrences = {};
                  for (const orderID of response.data) {
                      await this.populateProductOccurrencesForOrder(orderID);
                  }
          }catch (error) {
          console.error('An error occurred while performing the second query:', error);
          }
      },
      /**
     * Populates product occurrences for a specific order.
     * @async
     * @method
     * @param {object} orderID - The ID of the order.
     * @public
     */
      async populateProductOccurrencesForOrder(orderID) {
          try {
              // Make the third query for each orderID
              const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/productOccurrences', {
                  params: {
                      orderID: orderID.order_id,
                  },
              });

              // Iterate over the result and update the productOccurrences hashmap
              response.data.forEach(row => {
                  const productName = this.productMap[row.productid];
                  const occurrenceCount = parseInt(row.frequency); // Assuming frequency is a string, convert to integer

                  // Check if productid already exists in the hashmap
                  if (productName in this.productOccurrences) {
                      // If yes, add the occurrenceCount to the existing count
                      this.productOccurrences[productName] += occurrenceCount;
                  } else {
                      // If no, create a new entry in the hashmap
                      this.productOccurrences[productName] = occurrenceCount;
                  }
              });
          } catch (error) {
              console.error('An error occurred while populating product occurrences for order:', orderID, error);
          }
      },
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

<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.date-range-container {
  display: flex;
  flex-wrap: wrap; /* Allow elements to wrap if they exceed container width */
  align-items: center;
  margin-top: 20px;
}

.date-input {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.date-input label {
  margin-right: 10px;
}
.small-button {
  --c: #412C94;
  max-width: 100%; /* Button will not exceed the container width */
  flex: 1; /* Occupy remaining space */
  padding: 5px 10px;
  margin-top: 10px; /* Adjust margin as needed */
  box-sizing: border-box; /* Include padding in button's width */
  font-family: Arial, sans-serif;
}
.button-container {
  margin-top: 20px;
}
.result-container {
  height: 60vh; /* 60% of the viewport height */
  width: 60%;
  margin: 0 auto; /* Center the container horizontally */
  overflow: auto; /* Add a scrollbar when the content exceeds the container height */
}

.result-table {
  width: 100%;
  table-layout: fixed; /* Fix the table layout to prevent column widths from changing */
}

.result-table th, .result-table td {
  white-space: nowrap; /* Prevent text wrapping in cells */
}

.result-table thead th {
  position: sticky;
  top: 0;
  background-color: #f8f8f8; /* Add a background color to the sticky header */
  z-index: 1; /* Ensure the sticky header appears above the scrollable content */
}
.else-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 30vh; /* Adjust the height as needed */
  }
</style>
