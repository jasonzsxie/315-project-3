<template>    
<div v-if="$store.state.userName === 'Cashier' || $store.state.userName === 'Manager' || $store.state.userName === 'Admin'" >
  <div class="table-container">
  <table>
    <tr>
      <td>
        <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" aria-label="Select Holder"> Holder </v-btn>
          </template>


          <v-list>
            <v-list-item v-for="(item, index) in item[1]" :key="index" >
              <v-btn @click="handleItemClick(item)" :borderless="true" aria-label="item.product_name">{{ item.name }}</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
      </td>
      <td>
        <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :disabled="noMoreFlavor" aria-label="Select Flavor"> Flavor </v-btn>
          </template>


          <v-list>
            <v-list-item v-for="(item, index) in item[2]" :key="index" >
              <v-btn @click="handleItemClick(item)" :borderless="true" aria-label="item.product_name">{{ item.name }}</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
      </td>
      <td>
        <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" aria-label="Select Topping"> Toppings </v-btn>
          </template>


          <v-list>
            <v-list-item v-for="(item, index) in item[3]" :key="index" >
              <v-btn @click="handleItemClick(item)" :borderless="true" aria-label="item.product_name">{{ item.name }}</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
      </td>
      <td>
        <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" aria-label="Select Extra"> Extras </v-btn>
          </template>


          <v-list>
            <v-list-item v-for="(item, index) in item[4]" :key="index" >
              <v-btn @click="handleItemClick(item)" aria-label="item.product_name">{{ item.name }}</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
      </td>
      <td>
      </td>
      <td></td>
    </tr>
  </table>
  </div>

  <div class="move-down">
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="employeeID"
                :rules="IDRules"
                :counter="3"
                label="Employee ID"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field

                v-model="customerPhone"
                :rules="PhoneRules"
                :counter="10"
                label="Customer Phone #"

              ></v-text-field>
            </v-col>

            
          </v-row>
        </v-container>
      </v-form>
  </div>


  <div class="move-down">
  <v-card>
    <v-card-title>Current Order</v-card-title>
    <v-card-text>
      <v-textarea readonly :value="orderString" ></v-textarea>
    </v-card-text>
  </v-card>
  </div>

  <div class="move-down">
    <v-card>
      <v-card-title>Current Price: $ {{ currentPrice }}</v-card-title>
    </v-card>
  </div>

  <div class="move-down">
    <v-card>
      <v-card-title>New Points: {{ newpoints}}</v-card-title>
    </v-card>
  </div>

  <div class="move-down">
    <v-card>
      <v-card-title>Employee Sales Made: {{ employeeData.sales_made}}</v-card-title>
    </v-card>
  </div>

  <v-btn class="move-down" @click="submitOrders" aria-label="Submit order">Submit Order</v-btn>



  <v-btn class="move-down, close" @click="clearOrder">Clear</v-btn>
</div>
<div v-else>
    <h1>Sorry, you don't have access to this page.</h1>
</div>

</template>


 
  <script>
  
  // @ is an alias to /src
  import axios from 'axios'; 
  /**
 * View for cashier
 * @module CashierView
 */
  export default {
    components: {
    },
    data() {
      return {

      IDRules: [
        value => {
          if (/^\d{3}$/.test(value)) {
            this.validEmp = true;
            return true;
          }
          this.validEmp = false;
          return 'Value must be a 3-digit number.';
          }
      ],
      PhoneRules: [
        value => {
          const phoneNumberPattern = /^\d{10}$/;

          if (phoneNumberPattern.test(value)) {
            return true;
          }
          return 'Value must be in 10 Digit Number.';
          }
      ],
      noMoreFlavor: true,
      maxFlavor: 0,
      currentNumFlavor: 0,
      displaySubmitError: false,
      valid: false,
      menuOpen: {},



      // Customer & Employee Input Code
      employeeID: '',
      customerPhone: '',


      // Customer & Employee Data
      customerData: {},
      updatedCustomerData : {},
      employeeData: {},
      newpoints: 0,
      oldpoints: 0,
      newsales: 0,

      

      // For Submit Orders
      frequencyMap: {},
      currentTimeSQLFormat: '',
      currentOrderID: [],
      currentOrderDetailID: [],
      currentPrice: 0.00,
      orderString: "",

      // Hashmap to Store the Products and Their Quantitues
      item: {
        1: [],
        2: [],
        3: [],
        4: [],
      }
    } 
  },
  
  methods: {
     /**
     * Fetches items from the server.
     * @async
     * @method
     * @returns {Promise<void>}
     * @public
     */
    async fetchItems() {
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/menu/cashieritems');
        const itemsFromDatabase = response.data;
        for (const item of itemsFromDatabase) {
        let categoryIndex;

        if (item.item_id >= 0 && item.item_id <= 6) {
          categoryIndex = 1;
        } else if (item.item_id >= 7 && item.item_id <= 21) {
          categoryIndex = 2;
        } else if (item.item_id >= 22 && item.item_id <= 28) {
          categoryIndex = 3;
        } else if (item.item_id >= 29) {
          categoryIndex = 4;
        } 

        this.item[categoryIndex].push({
        name: item.product_name,
        price: item.price,
        id: item.item_id,
      });
    }
      }
      catch(error){
        console.error('Error fetching items', error.message);
      }
    },
    /**
     * Toggles menu based on button number.
     * @method
     * @param {number} buttonNumber - The number of the button.
     * @public
     */
    toggleMenu(buttonNumber) {
      this.menuOpen[buttonNumber] = !this.menuOpen[buttonNumber];
    },
    /**
     * Handles click event for items.
     * @method
     * @param {object} item - The item object.
     * @public
     */
    handleItemClick(item){
      if (item.id == 0 || item.id == 3 || item.id == 4) {
        this.maxFlavor += 1;
      }
      else if (item.id == 1 || item.id == 5) {
        this.maxFlavor += 2;
      }   
      else if (item.id == 2 || item.id == 6) {
        this.maxFlavor += 3;
      }
      if (item.id >= 7 && item.id <= 21) {
        this.currentNumFlavor += 1;
      }
      if(!this.frequencyMap[item.id]) {
        this.frequencyMap[item.id]= 1;
      } else {
        this.frequencyMap[item.id]++;
      }
      this.newpoints += Math.round(item.price * 10); // Make sure whole number
      this.orderString += item.name + "\t\t\t$" + item.price + "\n";
      const price = parseFloat(item.price)
      this.currentPrice += price;
      console.log(this.maxFlavor);

      if (this.currentNumFlavor == this.maxFlavor) {
        this.noMoreFlavor = true;
      } else {
        this.noMoreFlavor = false;
      }
    },
    /**
     * Submits orders to the server.
     * @method
     * @public
     */
    submitOrders(){


      console.log("Submitting Order");

      // TODO: We need the orderDetail ID and orderID from the database
      this.currentOrderID++;
      const postorderid = this.currentOrderID.toString();
      const postprice = this.currentPrice.toString();

      // Input Validation:

      //ID number
      if (this.isThreeDigitNumber(this.employeeID) === false){
        this.displaySubmitError = true;
        console.log('Employee Id had incorrect input')
        // Show error card on the screen
        return;
       } 
      // else if (this.isTenDigitNumber(this.customerPhone) === false){
      //   this.displaySubmitError = true;
      //   console.log('Phone Number had incorrect input')
      //   return;
      // }

    
      const orderData = {
      order_id: postorderid,
      price: postprice,
      employee_id: this.employeeID,
      customer_id: this.customerID,
      order_time: this.currentTimeSQLFormat
      }

      console.log('Order Data: ', orderData);


      const apiUrl = 'https://node-backend-project-3-902-04.onrender.com/orders/submitOrder';

      axios
        .post(apiUrl, orderData)
        .then(response => {
          // Sucess
          console.log('Order submitted successfully:', response.data);
        })
        .catch(error => {
          console.error('Error submitting order:', error);
        });
      
        // Submitting to Order Details
        for (const key in this.frequencyMap) {
            this.currentOrderDetailID++;
            const postorderDetailid = this.currentOrderDetailID.toString();
            const productid = key.toString();
            const quantity = this.frequencyMap[key].toString();

            const orderDetailData = {
              orderdetailid: postorderDetailid,
              orderid: postorderid,
              productid: productid,
              quantity: quantity
            }


            //console.log(orderDetailData.data);

            const apiUrl = 'https://node-backend-project-3-902-04.onrender.com/orders/submitOrderDetail'; 

            axios
              .post(apiUrl, orderDetailData)
              .then(response => {
                // Success
                console.log('Product submitted successfully:', response.data);
              })
              .catch(error => {
                console.error('Error submitting order:', error);
              });
        }

        console.log("Now updating customer info");

        // Update Customer Table (Rewards Points must be updated)
        console.log('New Points before update:', this.newpoints);
        this.oldpoints = this.newpoints;
        this.updateCustomer();
        this.updateEmployee();

        // Reset the Frequency Map & Variables
        this.frequencyMap = {};
        this.currentPrice = 0.00;
        this.orderString = "";
        this.employeeID = null;
        this.customerID = null;

        //this.newpoints = 0;

    },
    /**
     * Fetches IDs from the server.
     * @async
     * @method
     * @returns {Promise<void>}
     * @public
     */
    async fetchIDs(){
      // We need to get the largest orderID and largest orderDetailID
      try{
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/orders/largest-order-id');
        console.log(response.data);
        this.currentOrderID = response.data.largest_orderid;
      }
      catch(error){
        console.error('Error fetching largest orderID:', error.message);
      }
       
      try{
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/orders/largest-orderDetail-id');
        this.currentOrderDetailID = response.data.largest_orderdetailid;
      }
      catch(error){
        console.error('Error fetching largest order Detail ID:', error.message);
      }
    },
    /**
     * Updates current time.
     * @method
     * @public
     */
    updateTime(){
      const now = new Date();
      const ctOffset = 0; // Central Time (CT) offset in minutes

      // Calculate the time for Central Time
      now.setMinutes(now.getMinutes() + ctOffset);
      this.currentTimeSQLFormat = now.toISOString().slice(0,19).replace('T', ' ');
    },
    /**
     * Checks if the input string is a three-digit number.
     * @method
     * @param {string} str - The input string.
     * @returns {boolean} - Indicates if the string is a three-digit number.
     * @public
     */
    isThreeDigitNumber(str) {
      // Use a regular expression to check for a 3-digit number
      return /^\d{3}$/.test(str);
    },
    /**
     * Checks if phone number is valid
     * @method
     * @public
     */
    isTenDigitNumber(str) {
      // Use a regular expression to check for a 10-digit number
      return /^\d{10}$/.test(str);
    },
    /**
     * Clears the order details.
     * @method
     * @public
     */
    clearOrder() {
        this.frequencyMap = {};
        this.currentPrice = 0.00;
        this.orderString = "";
        this.employeeID = null;
        this.customerID = null;
        this.noMoreFlavor = true;
        this.maxFlavor = 0;
        this.currentNumFlavor = 0;

    },
    // Http Put to Update Current Customer Information
    async updateCustomer() {
      // Gettings Customer Info
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/customer/' + this.customerPhone);
        this.customerData = response.data;
        console.log('Customer Data', this.customerData)
        this.error = null;
      } catch (error) {
        console.error('Error fetching customer data:', error.response);
        this.customerData = null;
        this.error = 'Customer not found';
      }

      this.newpoints += Math.round(this.customerData.points);

      // Updating Customer Info
      console.log('Update Customer Started. Newpoints:', this.newpoints);
      const customerId = this.customerData.customer_id;
      const updatedData = {
        customer_id: this.customerData.customer_id,
        email: this.customerData.email,
        phone_number: this.customerData.phone_number,
        points: this.newpoints, // Needs to update the rewards points
      };
      console.log('updated Data:' , updatedData)
      try {
        const response = await axios.put('https://node-backend-project-3-902-04.onrender.com/customer/' + customerId, updatedData);
        console.log('Response after put:' , response.data);

        // Fetch the data again to make sure it's up to date
        const updatedResponse = await axios.get('https://node-backend-project-3-902-04.onrender.com/customer/' + this.customerPhone);
        this.customerData = updatedResponse.data;

        console.log('Customer data updated successfully:', this.customerData);
      } catch (error) {
        console.error('Error updating customer data:', error.response);
        this.updateError = 'Failed to update customer data';
      }
     },
    // Http Put to Update Current Customer Information
    async updateEmployee() {
      // Getting Employee Info
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/employee/' + this.employeeID);
        this.employeeData = response.data;
        console.log('Employee Data', this.employeeData)
        this.error = null;
      } catch (error) {
        console.error('Error fetching Employee data:', error.response);
        this.employeeData = null;
        this.error = 'Employee not found';
      }


      // Updating Customer Info
      console.log('Update Employee Started.');
      const employeeId = this.employeeData.employee_id;
      const updatedData = {
        employee_id: employeeId,
        sales_made: this.employeeData.sales_made + 1,
        employee_name: this.employeeData.employee_name,
        employee_role: this.employeeData.employee_name, // Needs to update the rewards points
      };
      console.log('Updated Employee Data:' , updatedData)
      try {
        const response = await axios.put('https://node-backend-project-3-902-04.onrender.com/employee/' + employeeId, updatedData);
        console.log('Response after put:' , response.data);

        // Fetch the data again to make sure it's up to date
        const updatedResponse = await axios.get('https://node-backend-project-3-902-04.onrender.com/employee/' + this.customerPhone);
        this.customerData = updatedResponse.data;

        console.log('Customer data updated successfully:', this.customerData);
      } catch (error) {
        console.error('Error updating customer data:', error.response);
        this.updateError = 'Failed to update customer data';
      }
    },

  },
  mounted(){
    this.fetchIDs();
    this.updateTime();
    this.fetchItems();
  },
}
  </script>


<style>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  width: 100vw;
  border: 0px solid black;
  border-color: white;
}

.table-container .v-btn {
  background-color: #f55856;
  color: white;
  border: 2px solid #f55856;
  border-radius: 5px;
  width: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 20vw;
}
.close {
    background-color: red;
    color: blue;
    border: 2px solid #f55856;
    padding: 10px 20px;
    border-radius: 5px;
    margin-top: 50px;
    margin-left: 10px;
    
}

.move-down{
  margin-top: 50px;
}


</style>
