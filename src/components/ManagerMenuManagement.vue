<template>
    <div class="button-columns">
        <div class="column">
            <div class="button-container">
                
            </div>
                <MenuPopup :storedata="menuinventory" v-if="screen==0"/>

            </div>
    
        <div class="column">
            <div class="button-container">
                
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/replacetopitem')">Replace Item</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/manager')">Return</button>
            </div> 
        </div>
    </div>


</template>


<script>
  import axios from 'axios';
  import MenuPopup from '@/components/MenuPopup.vue'

    /**
 * Represents a Vue component managing screens and handling various actions related to inventory management.
 * @module InventoryManager
 * @vue
 */

  export default {
    data() {
        return {
            screen: 0,
            menuinventory: [],
            showPopup: false,
            error: null,
        }
    },
    components: {
        MenuPopup
    },
    mounted() {
        /**
     * Fetches inventory data when the component is mounted.
     * @function
     * @name mounted
     * @public
     */
        this.fetchTopItems();
    },
    methods: { 
        /**
     * Fetches inventory data from the API endpoint.
     * @async
     * @function
     * @name fetchMenu
     * @returns {Promise<void>} - Promise resolving after fetching inventory data.
     * @public
     */
        async fetchTopItems() {
            try {
                const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/topItems'); //TODO this endpoint needs to be changed.
                this.menuinventory = response.data; // Store the fetched data in the items property
                console.log(this.menuinventory);
            } catch (error) {
                console.error('Error fetching attribute:', error);
                this.error = error.message; // Set the error message
            }
        },
        /**
     * Handles button click to display holder popup.
     * @async
     * @function
     * @name handleHolderButtonClick
     * @returns {Promise<void>} - Promise resolving after handling the button click.
     * @public
     */
        async handleMenuButtonClick() {
            // Call the fetchInventory method to update the inventory property
            await this.fetchTopItems();
            this.showPopup = true; // Show the popup after fetching items
        },
        /**
     * Closes the popup.
     * @function
     * @name closePopup
     * @public
     */
        closePopup() {
        this.showPopup = false; // Close the popup
        },
        /**
     * Navigates to the specified path using Vue Router.
     * @function
     * @name navigateTo
     * @param {string} path - The path to navigate to.
     * @public
     */
        navigateTo(path) {
        this.$router.push(path); // Use Vue Router to navigate to the specified path
        },
        /**
     * Sets the screen state to display holders.
     * @function
     * @name popupMenu
     * @public
     */
        popupMenu() {
        this.screen = 0
        },
    } 
  }
  
</script>

<style>
  .button-columns {
    display: flex;
    justify-content: space-around; 
  }

  .column {
    flex: 1; 
    margin: 0 10px; 
  }
</style>
