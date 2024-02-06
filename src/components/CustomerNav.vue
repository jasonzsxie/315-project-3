<template>
    <div class="navContainer"> 
        <!-- <router-link to="/employee/holders"> -->
            <v-btn @click=showHolders class="customerButton" height="500%" >Holders</v-btn>
        <!-- </router-link>   
        <router-link to="/employee/flavors"> -->
            <v-btn @click=showFlavors class="customerButton" height="500%" >Flavors</v-btn>
        <!-- </router-link>
        <router-link to="/employee/toppings"> -->
            <v-btn @click=showToppings class="customerButton" height="500%" >Toppings</v-btn>
        <!-- </router-link>
        <router-link to="/employee/extras"> -->
            <v-btn @click=showExtras class="customerButton" height="500%" >Extras</v-btn>
        <!-- </router-link> -->
    </div>
</template>

<script>
// import HolderChoices from '@/components/HolderChoices.vue'
// import FlavorChoices from '@/components/FlavorChoices.vue'
// import ToppingChoices from '@/components/ToppingChoices.vue'
// import ExtraChoices from '@/components/ExtraChoices.vue'

export default {
    /**
 * Vue component for displaying menu options for each component
 * @module CustomerNav
 */
    data() {
        return {
            screen: 'holders'
        }
    },
    components: {

    }, props:
    {
        /**
     * Represents the current screen from the parent component.
     * @type {string}
     * @default 'holders'
     */
        childScreen: String
    },
    /**
   * Emits an event to toggle the page/screen.
   * @event ToggleScreen#togglePage
   * @property {string} screen - The name of the screen to toggle to.
   */
    emits: ['togglePage'],
    methods: {
        /**
     * Displays the 'holders' screen.
     * Emits a 'togglePage' event with 'holders' as data.
     * @public
     */
        showHolders() {
            console.log("showHolders");
            this.screen = 'holders';
            this.$emit('togglePage', 'holders');
        },
        /**
     * Displays the 'flavors' screen.
     * Emits a 'togglePage' event with 'flavors' as data.
     * @public
     */
        showFlavors() {
            console.log("showFlavors"); 
            this.screen = 'flavors';
            this.$emit('togglePage', 'flavors');
        },
        /**
     * Displays the 'toppings' screen.
     * Emits a 'togglePage' event with 'toppings' as data.
     * @public
     */
        showToppings() {
            console.log("showToppings");
            this.screen = 'toppings';
            this.$emit('togglePage', 'toppings');
        },
        /**
     * Displays the 'extras' screen.
     * Emits a 'togglePage' event with 'extras' as data.
     * @public
     */
        showExtras() {
            console.log("showExtras");
            this.screen = 'extras';
            this.$emit('togglePage', 'extras');
        }
    }
}
</script>
  
<style>
.navContainer {
    position: relative;
    width: 9vw;
    max-height: 130px;
    height: 4vh;
    top: 3%;

}

.navContainer .customerButton {
    background-color: #f55856;
    color: white;
    margin: 5px;
    /* Ensure the button adjusts its size based on content */
    flex: 0 0 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 80px; /* Adjust this value as needed */
    max-width: 200px; /* Adjust this value as needed */
}
</style>