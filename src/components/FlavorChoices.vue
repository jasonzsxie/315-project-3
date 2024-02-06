<template>
    <!-- <div class="scrollLol"> -->
    <div class="customerContainer">

        <v-btn @click=handleItemClick(item) :disabled="noMoreFlavor" class="customerButton" v-for="item in this.buttons" :key=item.id> {{ item.name }}</v-btn>

    </div> 
    <!-- </div> -->
    
</template>

<script>
    /**
 * Component representing a container of customer buttons for flavors.
 * @module CustomerButtonContainer
 * @vue
 */
export default {


    props: {
        buttons: Array,
        noMoreFlavor: Boolean,
    },
    data() {
        return {
        }
    },
    emits: ['addItem'],
    components: {
        
    },
    methods: {
            /**
     * Handles the click event of a customer button.
     * Emits the 'addItem' event with the selected item.
     * @param {Object} item - The selected item.
     * @public
     */
     
        handleItemClick(item) {
            console.log("handleItemClick");
            console.log(item);
            this.$emit('addItem', item)
        }
    }

}

</script>

<style>
/* .scrollLol {
    max-height: 73vh; 
    overflow-y: auto; 
    width: 60vw;
    position: relative;
    left: 15%;
    top: -10%;
} */

</style>