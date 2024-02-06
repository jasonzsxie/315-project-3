
<template>
      <h2>Add an Item</h2>

  <div>
    <p>Put this number into Item ID field: {{ nextItemId }}</p>

    <!-- Form to add a new item -->
    <form @submit.prevent="addItem">

      <div class="form-group">
        <label for="itemId" class="form-label">Item ID:</label>
        <input v-model="newItem.item_id" type="number" id="itemId" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="productName" class="form-label">Product Name:</label>
        <input v-model="newItem.product_name" type="text" id="productName" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="quantity" class="form-label">Quantity:</label>
        <input v-model="newItem.quantity" type="text" id="quantity" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="minThreshold" class="form-label">Minimum Threshold:</label>
        <input v-model="newItem.minimum_threshold" type="number" id="minThreshold" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="price" class="form-label">Price: (put 0.0 if no price associated)</label>
        <input v-model="newItem.price" type="text" id="price" pattern="\d+(\.\d{1,2})?" class="form-input">
      </div>

      <div class="form-group">
        <label for="reorderPrice" class="form-label">Reorder Price:</label>
        <input v-model="newItem.reorder_price" type="text" id="reorderPrice" pattern="\d+(\.\d{1,2})?" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="itemType" class="form-label">Item Type:</label>
        <select v-model="newItem.item_type" id="itemType" class="form-input" required>
          <option value="holder">Holder</option>
          <option value="flavor">Flavor</option>
          <option value="topping">Topping</option>
          <option value="extra">Extra</option>
        </select>
      </div>

      <!-- Display the maximum item_id as a reference for the new item -->

      <button style="--c: black; --b: 5px; --s: 12px;" type="submit">Add Item</button>
    </form>

    <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/inventorymanagement')">Return</button>
  </div>
</template>

<script>
import axios from 'axios';
/**
 * 
 * Description: Allows users to add a new item to the inventory management system.
 */

  export default {
    name: 'AddItem',
    data() {
      return {
        /**
       * Represents the details of the new item to be added.
       * @type {Item}
       */
        newItem: {
          item_id: null,
          product_name: '',
          quantity: 0,
          minimum_threshold: 0,
          price: 0.0,
          reorder_price: 0.0,
          item_type: '',
        },
        menuItems: [], // Array to store menu items
        maxItemId: null, // Variable to store the maximum item_id
        nextItemId: null, // Variable to store the next available item_id for the new item
      };
    },
    mounted() {
      // Fetch the menu data
      this.fetchMenu();
    },
    methods: {
      /**
       * Finds the maximum item_id from the provided items array.
       * @param {Item[]} items - The array of items.
       * @returns {number} - The maximum item_id.
       * @public
       */
      findMaxItemId(items) {
        let maxItemId = -1;
        items.forEach((item) => {
          if (item.item_id > maxItemId) {
            maxItemId = item.item_id;
          }
        });
        return maxItemId;
      },
      /**
     * Fetches menu data from the API endpoint.
     * @public
     */
      fetchMenu() {
        axios.get('https://node-backend-project-3-902-04.onrender.com/menu')
          .then(response => {
            // Update menuItems with the fetched data
            this.menuItems = response.data;

            // Find the maximum item_id
            this.maxItemId = this.findMaxItemId(this.menuItems);

            // Calculate the next available item_id
            this.nextItemId = this.maxItemId !== null ? this.maxItemId + 1 : 1;
          })
          .catch(error => {
            console.error('Error fetching menu data:', error);
          });
      },
    /**
     * Adds a new item to the inventory.
     * @async
     * @public
     */
      async addItem() {
        try {
          // Validate the newItem, including the manually provided item_id
          if (!this.newItem.item_id || !this.newItem.product_name || !this.newItem.quantity || !this.newItem.minimum_threshold || !this.newItem.reorder_price || !this.newItem.item_type) {
            // Handle validation error
            console.error('Missing required fields');
            return;
          }
          // Send a POST request to add the new item to the database
          const response = await axios.post('https://node-backend-project-3-902-04.onrender.com/addItem', this.newItem);

          // Assuming the response contains the newly added item
          const newItem = response.data;

          // Optionally, perform other actions, clear the form, etc.
          this.newItem = {
            item_id: null,
            product_name: '',
            quantity: 0,
            minimum_threshold: 0,
            price: 0.0,
            reorder_price: 0.0,
            item_type: '',
          };

          // Update the nextItemId for the next new item
          this.nextItemId++;

          console.log('Item added successfully:', newItem);

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
