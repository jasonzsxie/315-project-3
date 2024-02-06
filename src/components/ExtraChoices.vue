<template>
    <div class="customerContainer">
   <v-btn @click=handleItemClick(item) class="customerButton" v-for="item in this.buttons" :key=item.id> {{ item.name }} </v-btn>
    </div> 
</template>

<script>
/**
 * Component representing a container of customer buttons for extras.
 * @module CustomerButtonContainer
 * @vue
 */
export default {

    props: {
        buttons: Array
    },
    data() {
        return {
        }
    },
    etmits: ['addItem'],
    components: {
        
    },
    methods : {
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