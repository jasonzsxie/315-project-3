<template>
    <div class="about">
      <h1>Excess Report</h1>
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
        <div v-if="dateRangeValid" class="result-container">
            <div class="scrollable-table">
            <table class="result-table">
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Percentage Sold</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in formattedInventoryData" :key="index">
                    <td>{{ item.productName }}</td>
                    <td>{{ item.percentage }}%</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
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
 * Vue component managing extra items in the inventory.
 * @module ExcessReport
 */
export default {
    
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
      inventoryData: [],
      formattedInventoryData: [],
    };
  },
  methods: { 
    /**
     * Checks the validity of the specified date range.
     * @async
     * @public
     * @returns {boolean} - Indicates if the date range is valid.
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
     * Performs a second query based on the date range which returns all the sales of each product.
      * @async
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
     * Populates product occurrences for each order in the date range.
     * @async
     * @param {Object} orderID - The order ID object.
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
                    const productID = row.productid;
                    const occurrenceCount = parseInt(row.frequency); // Assuming frequency is a string, convert to integer
                    console.log(productID);
                    // Check if productid already exists in the hashmap
                    if (productID in this.productOccurrences) {
                        // If yes, add the occurrenceCount to the existing count
                        this.productOccurrences[productID] += occurrenceCount;
                    } else {
                        // If no, create a new entry in the hashmap
                        this.productOccurrences[productID] = occurrenceCount;
                    }
                });

                await this.calculateAndAddPercentageToResults();

            } catch (error) {
                console.error('An error occurred while populating product occurrences for order:', orderID, error);
            }
        },
        /**
     * Calculates and adds percentage to the results.
     * @async
     * @public
     */
        async calculateAndAddPercentageToResults() {
            try {
                const inventoryData = [];

                // Make a query to get all inventory data
                const inventoryResponse = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/getAllInventoryData');

                const inventoryArray = inventoryResponse.data;

                this.formattedInventoryData = [];

                // Iterate over inventory data and perform calculations
                inventoryArray.forEach(item => {
                    const productID = item.item_id;
                    const totalAmount = item.total_amount;
                    const productName = this.productMap[productID];
                    const occurrenceCount = productID in this.productOccurrences ? this.productOccurrences[productID] : 0;

                    // Check if productName is not empty
                    if (productName) {
                    // Perform your calculations based on totalAmount and occurrenceCount
                    const percent = (occurrenceCount / (totalAmount + occurrenceCount)) * 100;

                    // For example, filter out items with percentage >= 10
                    if (percent < 10) {
                        const formattedPercent = percent.toFixed(3);
                        const newData = {
                        productName: productName,
                        percentage: formattedPercent,
                        };
                        this.formattedInventoryData.push(newData);
                    }
                    }
                });

                // Do something with the inventoryData array, for example, log it to the console
                console.log('Inventory Data:', inventoryData);
            } catch (error) {
                console.error('An error occurred while calculating and adding percentage:', error);
            }
        },
        /**
     * Navigates to the specified path using Vue Router.
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
.result-container {
  height: 60vh;
  width: 60%;
  margin: 0 auto;
  overflow: hidden;
}

.scrollable-table {
  max-height: 100%;
  overflow-y: auto;
}

.result-table {
  width: 50vw;
  table-layout: fixed;
  border-collapse: collapse;
}

.result-table th, .result-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  word-break: break-all; /* Add this line to prevent long words from extending */
}

.result-table thead th {
  background-color: #f8f8f8;
}
.else-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 30vh; /* Adjust the height as needed */
  }
</style>
