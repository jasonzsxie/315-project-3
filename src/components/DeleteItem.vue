<template>
  <div>
    <h2>Delete an Item</h2>
      <strong><label for="itemName">Select Item to Delete:</label> </strong>
    
    <select v-model="selectedItem" class="large-dropdown">
      <option v-for="item in items" :key="item.item_id" :value="item.product_name">
        {{ item.product_name }}
      </option>
    </select>

    <div class="button-container">
        <button style="--c: black; --b: 5px; --s: 12px;" @click="deleteItem">Delete Item</button>
    </div>

    <div class="button-container">
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/inventorymanagement')">Return</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
/**
 * Vue component for selecting item for deletion.
 * @module ItemManager
 */

export default {
  data() {
    return {
      items: [],
      selectedItem: null,
    };
  },
  mounted() {
    // Fetch items when the component is mounted
    this.fetchItems();
  },
  methods: {
    fetchItems() {
      /**
     * Fetches all items.
     * @public
     */
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
     * Deletes the selected item.
     * If no item is selected, logs an error.
     * @public
     */
    deleteItem() {
        if (!this.selectedItem) {
            console.error('Please select an item to delete.');
            return;
        }

        // Send a request to delete the selected item using POST
        axios.post('https://node-backend-project-3-902-04.onrender.com/deleteItem', { itemName: this.selectedItem })
            .then(response => {
            console.log('Item deleted successfully:', response.data);
            
            // Clear the selected item
            this.selectedItem = null;

            this.navigateTo('/inventorymanagement');
        })
            .catch(error => {
            console.error('Error deleting item:', error);
            // Handle the error, show a message, etc.
        });
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
.large-dropdown {
    width: 300px; /* Adjust the width as needed */
    padding: 8px; /* Add padding for better appearance */
    font-size: 24px !important; /* Adjust font size as needed and use !important */
    border: 1px solid #ccc; /* Add a 1px solid border with a light gray color */
    border-radius: 4px; /* Optional: Add border-radius for rounded corners */
}

.button-container {
    margin-top: 10px; /* Add margin to separate buttons */
}
</style>
