<template>
    <div>
      <h2>Update Inventory</h2>
  
      <!-- Form to update an item -->
      <form @submit.prevent="updateItem">
  
        <div class="form-group">
          <label for="itemName" class="form-label">Select Item to Update:</label>
          <select v-model="selectedItem" id="itemName" class="form-input" required>
            <option v-for="item in items" :key="item.item_id" :value="item.product_name">
              {{ item.product_name }}
            </option>
          </select>
  
          <!-- Display current values of selected item's attributes -->
          <div v-if="selectedItemAttributes">
            <p>Old Inventory: {{ selectedItemAttributes.quantity }}</p>
            <p>Old Minimum Threshold: {{ selectedItemAttributes.minimum_threshold }}</p>
            <p>Old Price: {{ selectedItemAttributes.price }}</p>
            <p>Old Reorder Price: {{ selectedItemAttributes.reorder_price }}</p>
          </div>
        </div>
  
        <div class="form-group">
          <label for="newQuantity" class="form-label">New Quantity:</label>
          <input v-model="newAttributes.quantity" type="number" id="newQuantity" class="form-input" required>
        </div>
  
        <div class="form-group">
          <label for="newMinThreshold" class="form-label">New Minimum Threshold:</label>
          <input v-model="newAttributes.minimum_threshold" type="number" id="newMinThreshold" class="form-input" required>
        </div>
  
        <div class="form-group">
          <label for="newPrice" class="form-label">New Price:</label>
          <input v-model="newAttributes.price" type="text" id="newPrice" pattern="\d+(\.\d{1,2})?" class="form-input">
        </div>
  
        <div class="form-group">
          <label for="newReorderPrice" class="form-label">New Reorder Price:</label>
          <input v-model="newAttributes.reorder_price" type="text" id="newReorderPrice" pattern="\d+(\.\d{1,2})?" class="form-input" required>
        </div>
  
        <!-- Submit button to update the item -->
        <button style="--c: black; --b: 5px; --s: 12px;" type="submit">Update Item</button>
      </form>
  
      <!-- Button to return to the manager page -->
      <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/inventorymanagement')">Return</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  /**
 * Represents a Vue component managing inventory items and their attributes.
 * @exports InventoryManagerComponent
 * @type {object}
 */
  export default {
    data() {
      return {
        items: [],
        selectedItem: null,
        newAttributes: {
          quantity: 0,
          minimum_threshold: 0,
          price: 0.0,
          reorder_price: 0.0,
        },
        selectedItemAttributes: null, // Initialize as null
      };
    },
    mounted() {
      // Fetch items when the component is mounted
      this.fetchItems();
    },
    watch: {
      /**
     * Watch for changes in the selected item and fetch its attributes.
     * @type {string|null}
     */
      selectedItem: {
        handler: 'fetchSelectedItemAttributes',
        immediate: true, // Fetch attributes immediately on mount
      },
    },
    methods: {
      /**
     * Fetches all items from the API.
     * @function
     * @returns {void}
     */
      fetchItems() {
        // Fetch all items
        axios.get('https://node-backend-project-3-902-04.onrender.com/menu')
          .then(response => {
            console.log('Fetched items:', response.data);
            this.items = response.data;
          })
          .catch(error => {
            console.error('Error fetching items:', error);
          });
      },
      /**
     * Fetches attributes of the selected item.
     * @function
     * @public
     * @returns {void}
     */
      fetchSelectedItemAttributes() {
        if (!this.selectedItem || !this.items) {
        console.error('Please select an item.');
        return;
        }

        // Find the selected item in the menu data
        const selectedItemData = this.items.find(item => item.product_name === this.selectedItem);

        if (selectedItemData) {
        // Extract attributes from the selected item data
        this.selectedItemAttributes = {
            quantity: selectedItemData.quantity,
            minimum_threshold: selectedItemData.minimum_threshold,
            price: selectedItemData.price,
            reorder_price: selectedItemData.reorder_price,
        };

        console.log('Item attributes:', this.selectedItemAttributes);
        } else {
        console.error('Selected item not found in menu data.');
        }
    },
    /**
     * Updates the selected item's attributes based on newAttributes.
     * @function
     * @public
     * @returns {void}
     */
    updateItem() {
      if (!this.selectedItem) {
        console.error('Please select an item to update.');
        return;
      }

      // Create a new object to store only non-zero attributes
      const updatedAttributes = {};
      for (const key in this.newAttributes) {
        if (this.newAttributes[key] !== 0) {
          updatedAttributes[key] = this.newAttributes[key];
        }
      }

      // Check if there are any attributes to update
      if (Object.keys(updatedAttributes).length === 0) {
        console.log('No attributes to update.');
        return;
      }

      // Send a request to update the selected item with non-zero attributes
      axios.post('https://node-backend-project-3-902-04.onrender.com/updateinventory', {
        itemName: this.selectedItem,
        newAttributes: updatedAttributes,
      })
        .then(response => {
             console.log('Item updated successfully:', response.data);

            // Clear the selected item box
            this.selectedItem = null;

            // Navigate back to the inventorymanagement page
            this.navigateTo('/inventorymanagement');
        })
        .catch(error => {
          console.error('Error updating item:', error);
          // Handle the error, show a message, etc.
        });
    },
    /**
     * Navigates to the specified path using Vue Router.
     * @function
     * @param {string} path - The path to navigate to.
     * @public
     * @returns {void}
     */
      navigateTo(path) {
        this.$router.push(path); // Use Vue Router to navigate to the specified path
      },
    },
  };
  </script>
  
  <style>
  /* Your component styles here */
  </style>
  