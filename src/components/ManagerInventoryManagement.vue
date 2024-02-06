<template>
    <div class="button-columns">
        <div class="column">
            <div class="button-container">
                
            </div>
                
                <HolderPopup :storedata="managerinventory" v-if="screen==0"/>
                <FlavorPopup :storedata="managerinventory" v-else-if="screen==1"/>
                <ToppingPopup :storedata="managerinventory" v-else-if="screen==2"/>
                <ExtraPopup :storedata="managerinventory" v-else/>

            </div>
    
        <div class="column">
            <div class="button-container">
                <button style="--c: black; --b: 5px; --s: 12px;" @click="popupHolders" id="holders" >Holder</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="popupFlavors" id="flavors">Flavor</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="popupToppings" id="toppings">Topping</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="popupExtras" id="extras">Extra</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/additem')">Add Item</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/deleteitem')">Remove Item</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/updateinventory')">Update Inventory</button>
                <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/manager')">Return</button>
            </div> 
        </div>
    </div>


</template>

<script>
  import axios from 'axios';
  import HolderPopup from '@/components/HolderPopup.vue';
  import FlavorPopup from '@/components/FlavorPopup.vue'
  import ToppingPopup from '@/components/ToppingPopup.vue'
  import ExtraPopup from '@/components/ExtraPopup.vue'
    /**
 * Represents a Vue component managing screens and handling various actions related to inventory management.
 * @module InventoryManager
 * @vue
 */

  export default {
    data() {
        return {
            screen: 0,
            managerinventory: [],
            showPopup: false,
            error: null,
        }
    },
    components: {
        HolderPopup,
        FlavorPopup,
        ToppingPopup,
        ExtraPopup
    },
    mounted() {
        /**
     * Fetches inventory data when the component is mounted.
     * @function
     * @name mounted
     * @public
     */
        this.fetchInventory();
    },
    methods: { 
        /**
     * Fetches inventory data from the API endpoint.
     * @async
     * @function
     * @name fetchInventory
     * @returns {Promise<void>} - Promise resolving after fetching inventory data.
     * @public
     */
        async fetchInventory() {
            try {
                const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/menu');
                this.managerinventory = response.data; // Store the fetched data in the items property
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
        async handleHolderButtonClick() {
            // Call the fetchInventory method to update the inventory property
            await this.fetchInventory();
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
     * @name popupHolders
     * @public
     */
        popupHolders() {
        this.screen = 0
        },
        /**
     * Sets the screen state to display flavors.
     * @function
     * @name popupFlavors
     * @public
     */
        popupFlavors() {
        this.screen = 1
        },
        /**
     * Sets the screen state to display toppings.
     * @function
     * @name popupToppings
     * @public
     */
        popupToppings() {
        this.screen = 2
        },
        /**
     * Sets the screen state to display extras.
     * @function
     * @name popupExtras
     * @public
     */
        popupExtras() {
        this.screen = 3
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
