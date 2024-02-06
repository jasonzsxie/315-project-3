<template>
    <div class="about">
      <h1>Sales Trend</h1>
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
    <table v-if="dateRangeValid" class="result-table">
      <thead>
        <tr>
          <th>Product 1</th>
          <th>Product 2</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pair in productPairsTable.slice(0, 25)" :key="pair.product1 + '-' + pair.product2">
          <td>{{ getProduct(pair.product1) }}</td>
          <td>{{ getProduct(pair.product2) }}</td>
          <td>{{ pair.frequency }}</td>
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
 * Represents a Vue component responsible for managing sales revenue and product pairs.
 * @exports SalesRevenueComponent
 * @type {object}
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
      productPairsTable: [],
    };
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
     * Checks the validity of the provided date range.
     * @async
     * @method
     * @returns {boolean} Returns a boolean indicating the validity of the date range.
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
     * Performs the second query to fetch order IDs for a given date range.
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
                    this.orderIDs = response.data;
                    this.performThirdQuery();
            }catch (error) {
            console.error('An error occurred while performing the second query:', error);
            }
        },
        /**
     * Performs the third query to get sales trend and generate product pairs.
     * @async
     * @method
     * @public
     */
        async performThirdQuery() {
            try {
                const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/manager/salesRevenue/salesTrend', {
                params: {
                    orderIds: this.orderIDs.map(order => order.order_id),
                },
            });
            this.productPairsTable = [];
        // Assuming you want to associate the productPairsTable with each order ID
        this.orderIDs.forEach(order => {
          const orderId = order.order_id;
          const productPairs = response.data[orderId] || [];
          console.log('Processed Product Pair:', productPairs);
          // Process productPairs to create the productPairsTable
          for (let i = 0; i < productPairs.length; i++) {
            for (let j = i + 1; j < productPairs.length; j++) {
                const productPair = [productPairs[i], productPairs[j]];
                

                const existingPairIndex = this.productPairsTable.findIndex(p =>
                (p.product1 === productPair[0] && p.product2 === productPair[1]) ||
                (p.product1 === productPair[1] && p.product2 === productPair[0])
                );


                if (existingPairIndex !== -1) {
                // Increment frequency if the pair already exists in the table
                    this.productPairsTable[existingPairIndex].frequency++;
                } else {
                // Add a new entry if the pair doesn't exist in the table
                    this.productPairsTable.push({
                        product1: productPair[0],
                        product2: productPair[1],
                        frequency: 1,
                        });
                }
            }
          }
        });
        
        // Sort productPairsTable by frequency in descending order
        this.productPairsTable.sort((a, b) => b.frequency - a.frequency);
        

      } catch (error) {
        console.error('An error occurred while performing the third query:', error);
      }
    },
    /**
     * Retrieves the product name based on the provided item ID.
     * @param {number} itemId - The ID of the item to retrieve the product name.
     * @method
     * @public
     * @returns {string} Returns the product name corresponding to the item ID.
     */
        getProduct(itemId) {
            return this.productMap[itemId] || 'Unknown Product';
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