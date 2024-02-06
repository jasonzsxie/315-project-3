<template>
  <v-dialog v-model="dialogVisible" width="500">
  <template v-slot:default="{ isActive }">
    <v-card class=text-center title="Sign up today">
      <v-card-text>
        Enter your phone number:
      </v-card-text>

        <v-text-field
          v-model="customerPhone"
          :rules="IDRules"
          :counter="10"
          label="Customer Phone"
          aria-label="Customer Phone Input"
        ></v-text-field>

        <v-card-text class=text-center> ID: {{ customerData.customer_id }}</v-card-text>
        <v-card-text class=text-center> Email: {{ customerData.email }}</v-card-text>
        <v-card-text class=text-center> Points: {{ customerData.points }}</v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Get Started"
          @click="isActive.value = false"
          aria-label="Get Started Button"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
  <v-app>
    <v-row>
      <v-col>
        <div class="navContainer">    
          <CustomerNav @togglePage=changeScreen :childScreen="choiceScreen"/>
        </div>
      </v-col>
      <v-col>
        <HolderChoices @addItem=customerAdd :buttons="items[1]" v-if="this.choiceScreen == 'holders'"/>
        <FlavorChoices @addItem=customerAdd :buttons="items[2]" :noMoreFlavor="noMoreFlavor" v-if="this.choiceScreen == 'flavors'"/>
        <ToppingChoices @addItem=customerAdd :buttons="items[3]" v-if="this.choiceScreen == 'toppings'"/>
        <ExtraChoices @addItem=customerAdd :buttons="items[4]" v-if="this.choiceScreen == 'extras'"/>
      </v-col>
      <v-col>
        <div class="d-flex align-center flex-column ma-3">
            <v-card height = "70vh" width="36vw" color="#7DA59C">
              <v-card-item>
                <v-card-title>Current Order</v-card-title>

                <v-card-subtitle> Review Here: </v-card-subtitle>
              </v-card-item>

              <v-card-text style="overflow-y: scroll; max-height: 380px; height: 380px">
                <v-list-item-group v-if="order.length > 0">
                  <div v-for="(item, count) in order" :key="count">
                    {{ item.name }}
                    <v-btn icon @click="removeItem(item, count)" style="width: 24px; height: 24px; background-color: transparent; box-shadow: none">
                      <v-icon style="font-size: 16px">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-group>
                <v-list-item-group v-else>
                  <div>
                    No items in the order.
                  </div>
                </v-list-item-group>
              </v-card-text>
              <v-card-text style="max-height: 55px; height: 55px">
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title> Total Price: ${{ parseFloat(currentPrice).toFixed(2) }} </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card-text>
            </v-card>
        </div>
        <v-col align="center" style="display: flex; justify-content: center ;" justify="end">
          <v-spacer></v-spacer>
          <v-btn  @click = "submitOrders" color="#0B5563" width="36vw" style="position: absolute"> Order Now </v-btn>
        </v-col>
      </v-col>
    </v-row>
  </v-app>
  
  
</template>
  
<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import CustomerNav from '@/components/CustomerNav.vue'
import HolderChoices from '@/components/HolderChoices.vue'
import FlavorChoices from '@/components/FlavorChoices.vue'
import ToppingChoices from '@/components/ToppingChoices.vue'
import ExtraChoices from '@/components/ExtraChoices.vue'
// import { get } from 'http'
import axios from 'axios'; 
/**
   * Data properties for managing customer, order, and UI-related information.
   */


export default {
  components: {
    CustomerNav,
    HolderChoices,
    FlavorChoices,
    ToppingChoices,
    ExtraChoices
  },
  
  data() {
    return {
      noMoreFlavor: true,
      maxFlavor: 0,
      currentNumFlavor: 0,
      choiceScreen: 'holders',
      order: [],
      count: 0,
      dialogVisible: true,
      // Input Rules
      IDRules: [
        value => {
          const phoneNumberPattern = /^\d{10}$/;

          if (phoneNumberPattern.test(value)) {
            this.submitPhoneNumber();
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
      items: {
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
    }
  },
  methods: {
    /**
     * Changes the active screen within the UI.
     * @param {string} screen - The screen to be displayed.
     * @public
     */
    changeScreen(screen) {
      // console.log("changeScreen");
      this.choiceScreen = screen;
    },
    /**
     * Updates the current time in a specified format.
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
     * Adds an item to the customer's order.
     * @param {Object} item - The item to be added to the order.
     * @public
     */
    customerAdd(item) {
      // console.log("customerAdd");
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
      this.order.push(item);
      this.currentPrice = this.currentPrice + item.price;
      console.log(this.order);
      if (this.currentNumFlavor == this.maxFlavor) {
        this.noMoreFlavor = true;
      } else {
        this.noMoreFlavor = false;
      }
    },
    /**
     * Removes an item from the customer's order.
     * @param {Object} item - The item to be removed from the order.
     * @param {number} count - The count/index of the item to be removed.
     * @public
     */
    removeItem(item, count) {
      // console.log("removeItem");
      this.order.splice(count, 1);
      console.log(item.price)
      this.currentPrice = this.currentPrice - item.price;
      console.log(this.currentPrice);
      if (this.currentPrice <= 0) {
        this.currentPrice = 0;
      }
      console.log(this.order);
    },
    /**
     * Fetches the largest order ID and order detail ID from the backend.
     * @async
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
    // Get Customer Data from Phone Number
    /**
     * Retrieves customer data based on the provided phone number.
     * @async
     * @public
     */
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

      // Http Put to Update Current Customer Information
      /**
     * Updates the current customer information via HTTP PUT request.
     * @async
     * @public
     */
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

        this.items[categoryIndex].push({
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
     * Submits the customer's orders to the backend.
     * @public
     */
      submitOrders() {

        // TODO: We need the orderDetail ID and orderID from the database
        this.currentOrderID++;
        const postorderid = this.currentOrderID.toString();
        const postprice = this.currentPrice.toString();

        // Input Validation:

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
        this.order = [];
      },
  },
  mounted() {
    // get.localStorage.getItem('choiceScreen');
    this.fetchIDs();
    this.fetchItems();
    this.updateTime();
  },
}
</script>

<style>
/* .orderCard {
  height: 500px;
  position: relative;
  top: -100%;
  right: -100%;
  background-color: black;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  z-index: 1;
} */

.customerContainer {
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    min-height: 0;
    align-items: center;
    height: 73vh;
    max-height: 73vh; 
    overflow-y: auto; /* Enable vertical scrolling */
    width: 45vw;
    position: absolute;
    left: 13%;
    top: 9%;
}


.customerContainer .customerButton {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 10vh;
    flex: 1 1 auto;
    flex-basis: content;
    margin: 5px;
    position: relative;
    background-color: #56abf5;
    /* Add the following properties to handle text overflow */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

</style>