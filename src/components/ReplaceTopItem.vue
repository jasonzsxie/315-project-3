<template>
    <div>
      <h2>Update Inventory</h2>
  
      <!-- Form to update an item -->
      <form @submit.prevent="updateItem">
  
        <div class="form-group">
          <label for="itemName" class="form-label">Select Item to Update:</label>
          <select v-model="selectedItem" id="itemName" class="form-input" required>
            <option v-for="item in items" :key="item.item_id" :value="item.combination">
              {{ item.combination }}
            </option>
          </select>
  
          <!-- Display current values of selected item's attributes -->
          
        </div>
  
        <div class="form-group">
          <label for="newTopItem" class="form-label">New Top Item:</label>
          <input v-model="newAttributes.newTopitem" type="text" id="newTopItem" class="form-input" required>
        </div>
  
        <!-- Submit button to update the item -->
        <button style="--c: black; --b: 5px; --s: 12px;" type="submit">Replace Item</button>
      </form>
  
      <!-- Button to return to the manager page -->
      <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/menumanagement')">Return</button>
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
        selectID: null,
        newAttributes: {
          newTopitem: ""
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
        axios.get('https://node-backend-project-3-902-04.onrender.com/topItems') //Change endpoint.
          .then(response => {
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
        const selectedItemData = this.items.find(item => item.combination === this.selectedItem);
        this.selectID = selectedItemData.item_id;

        if (selectedItemData) {
        // Extract attributes from the selected item data
        this.selectedItemAttributes = {
            combination: selectedItemData.combination,
            item_id: selectedItemData.item_id
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
        if (this.newAttributes[key] !== "") {
          updatedAttributes[key] = this.newAttributes[key];
        }
      }

      // Check if there are any attributes to update
      if (Object.keys(updatedAttributes).length === 0) {
        console.log('No attributes to update.');
        return;
      }
      console.log(this.selectID);
      console.log(updatedAttributes);
      // Send a request to update the selected item with non-zero attributes
      axios.post('https://node-backend-project-3-902-04.onrender.com/updatetopmenu', { //change to update top menu items
        item_id: this.selectID,
        newAttributes: updatedAttributes,
      })
        .then(response => {
             console.log('Item updated successfully:', response.data);

            // Clear the selected item box
            this.selectedItem = null;
            this.selectID = null;

            // Navigate back to the inventorymanagement page
            this.navigateTo('menumanagement');
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
  