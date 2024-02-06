<template>
     <div class="customerContainer">

        <v-btn @click=handleItemClick(item) class="customerButton" v-for="item in this.buttons" :key=item.id> {{ item.name }} </v-btn>

    </div> 
</template>

<script>
/**
 * Represents a Vue component responsible for managing customer buttons.
 * @exports CustomerButtonComponent
 * @type {object}
 */

export default {

    props: {
        buttons: Array
    },
    data() {
        return {
        }
    },
    emits: ['addItem'],
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

<style>

</style>