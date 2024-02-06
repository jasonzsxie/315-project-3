<template>
  <div class="move-down">
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="customerPhone"
                  :rules="IDRules"
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
        <v-card-title>Current Customer</v-card-title>
        <v-card-title>Customer Id: {{ customerData.customer_id }}</v-card-title>
        <v-card-title>Customer Id: {{ customerData.email }}</v-card-title>
        <v-card-title>Customer Points: {{ customerData.points }}</v-card-title>
      </v-card>
    </div>

    

    <v-btn class="move-down" @click="submitPhoneNumber">Submit Number</v-btn>

    <v-btn class="move-down" @click="updateCustomer">Update Customer</v-btn>

    <v-btn class="move-down" @click="submitOrders">Submit Order</v-btn>
    
  </template>
  
  <script>
  // @ is an alias to /src
  //import HelloWorld from '@/components/HelloWorld.vue'
  // We need to capture the 
  import axios from 'axios'; 

  /**
 * This component manages various operations related to customer data, orders, and updates.
 * @module CustomerOperations
 * @vue
 */
  export default {
    components: {
      //HelloWorld
    },
    data() {
      return {
        // Input Rules
        IDRules: [
        value => {
          const phoneNumberPattern = /^\d{10}$/;

          if (phoneNumberPattern.test(value)) {
            return true;
          }
          return 'Value must be in 10 Digit Number.';
          }
      ],

      // Customer Data
      customerPhone: '',
      customerData: {},
      updatedCustomerData : {},

      // Menu HashMap
      item: {
        1: [],
        2: [],
        3: [],
        4: [],
      },
      // Submit Orders 
      frequencyMap: {},
      currentTimeSQLFormat: '',
      currentOrderID: [],
      currentOrderDetailID: [],
      currentPrice: 0.00,
      orderString: "",
      }
    },
    methods: {
      /**
     * Fetches customer data based on the provided phone number.
     * @async
     * @public
     */
      // Get Customer Data from Phone Number
      async submitPhoneNumber() {
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/customer/' + this.customerPhone);
        this.customerData = response.data;
        this.error = null;
      } catch (error) {
        console.error('Error fetching customer data:', error.response);
        this.customerData = null;
        this.error = 'Customer not found';
      }
      console.log('Customer Data:', this.customerData);
      console.log('Customer Data email:', this.customerData.email);
      console.log('Customer Data id:', this.customerData.customer_id);
      },
      /**
     * Updates the current customer information via HTTP PUT request.
     * @async
     * @public
     */
      // Http Put to Update Current Customer Information
      async updateCustomer() {
        console.log("Update Customer Started");
        const customerId = this.customerData.customer_id;
        const updatedData = {
          customer_id: this.customerData.customer_id,
          email: this.customerData.email,
          phone_number: this.customerData.phone_number,
          points: this.customerData.points,
        };
        try {
          const response = await axios.put('https://node-backend-project-3-902-04.onrender.com/customer/' + customerId, updatedData);

          // Assuming the server responds with the updated customer data
          this.updatedCustomerData = response.data;
          console.log('Customer data updated successfully:', this.updatedCustomerData);
        } catch (error) {
          console.error('Error updating customer data:', error.response);
          this.updatedCustomerData = null;
          this.updateError = 'Failed to update customer data';
        }
      },
       /**
     * Fetches items from the menu.
     * @async
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
     * Submits orders to the backend.
     * @public
     */
      submitOrders(){

        // TODO: We need the orderDetail ID and orderID from the database
        this.currentOrderID++;
        const postorderid = this.currentOrderID.toString();
        const postprice = this.currentPrice.toString();

        // Input Validation:

        //ID numbers
        if (this.isThreeDigitNumber(this.employeeID) === false){
          this.displaySubmitError = true;
          // Show error card on the screen
          return;
        } else if (this.isThreeDigitNumber(this.customerID) === false){
          this.displaySubmitError = true;
          // Show error card on the screen
          return;
        }

        // Create Order Data to submit to Orders
        const orderData = {
        order_id: postorderid,
        price: postprice,
        employee_id: 0,
        customer_id: this.customerID,
        order_time: this.currentTimeSQLFormat
        }
        console.log('Order Data: ', orderData);
        // Submitting to Orders
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
        // Update Customer Table (Rewards Points must be updated)
        this.updateCustomer();


        // Reset the Frequency Map & Variables
        this.frequencyMap = {};
        this.currentPrice = 0.00;
        this.orderString = "";
        this.employeeID = null;
        this.customerID = null;
      },

    },

  }
  </script>

