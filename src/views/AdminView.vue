<template>
<div v-if="$store.state.userName === 'Admin'" >
    <div class="button-columns">
        <div class="column">
            <div class="button-container">
                
            </div>
                <UserPopup :userList="users" v-if="screen==0"/>
                <!-- <HolderPopup :storedata="managerinventory" v-if="screen==0"/>
                <FlavorPopup :storedata="managerinventory" v-else-if="screen==1"/>
                <ToppingPopup :storedata="managerinventory" v-else-if="screen==2"/>
                <ExtraPopup :storedata="managerinventory" v-else/> -->

            </div>
    
        <div class="column">
            <div class="button-container">
                <!-- <button style="--c: #412C94; --b: 5px; --s: 12px;" @click="popupHolders" id="holders" >Holder</button>
                <button style="--c: #EC8700; --b: 5px; --s: 12px;" @click="popupFlavors" id="flavors">Flavor</button>
                <button style="--c: #F9B831; --b: 5px; --s: 12px;" @click="popupToppings" id="toppings">Topping</button>
                <button style="--c: #EFE277; --b: 5px; --s: 12px;" @click="popupExtras" id="extras">Extra</button> -->
                <button style="--c: #EFE277; --b: 5px; --s: 12px;" @click="navigateTo('/admin/adduser')">Add User</button>
                <button style="--c: #F9B831; --b: 5px; --s: 12px;" @click="navigateTo('/admin/deleteuser')">Remove User</button>
                <button style="--c: #EC8700; --b: 5px; --s: 12px;" @click="navigateTo('/admin/updateuser')">Update User</button>
                <button style="--c: #412C94; --b: 5px; --s: 12px;" @click="navigateTo('/')">Return</button>
            </div> 
        </div>
    </div>

</div>
<div v-else>
    <h1>Sorry, you don't have access to this page.</h1>
</div>
</template>

<script>
  import axios from 'axios';
//   import HolderPopup from '@/components/HolderPopup.vue';
//   import FlavorPopup from '@/components/FlavorPopup.vue'
//   import ToppingPopup from '@/components/ToppingPopup.vue'
//   import ExtraPopup from '@/components/ExtraPopup.vue'
  import UserPopup from '@/components/UserPopup.vue'
/**
 * View for admin page
 * @module AdminView
 */

  export default {
    data() {
        return {
            screen: 0,
            users: [],
            showPopup: false,
            error: null,
        }
    },
    components: {
        // HolderPopup,
        // FlavorPopup,
        // ToppingPopup,
        // ExtraPopup
        UserPopup
    },
    mounted() {
        this.fetchUsers();
    },
    methods: { 
        /**
     * Fetches users from the server.
     * @async
     * @method
     * @returns {Promise<void>}
     * @public
     */
        async fetchUsers() {
            try {
                const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/user');
                console.log(response);
                this.users = response.data; // Store the fetched data in the items property
            } catch (error) {
                console.error('Error fetching attribute:', error);
                this.error = error.message; // Set the error message
            }
        },
        // async handleHolderButtonClick() {
        //     // Call the fetchInventory method to update the inventory property
        //     await this.fetchUsers();
        //     this.showPopup = true; // Show the popup after fetching items
        // },
        /**
     * Closes the popup.
     * @method
     * @public
     */
        closePopup() {
        this.showPopup = false; // Close the popup
        },
        /**
     * Navigates to a specified path using Vue Router.
     * @method
     * @param {string} path - The path to navigate to.
     * @public
     */
        navigateTo(path) {
        this.$router.push(path); // Use Vue Router to navigate to the specified path
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
