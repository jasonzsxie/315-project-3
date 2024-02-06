<script>
/**
 * Represents a Vue component that filters storedata for items of type 'topping'.
 * @exports ToppingListComponent
 * @type {object}
 */
export default {
    props: {
      /**
     * The array of storedata items passed as a prop to filter for toppings.
     * @type {Array.<object>}
     */
        storedata: []
    },
    computed: {
        /**
     * Computes the list of items categorized as 'topping' from the storedata prop.
     * @function
     * @returns {Array.<object>} Filtered list of items categorized as 'topping'.
     */
        extrasList() {
            return this.storedata.filter(item => item.item_type == 'topping')
        }
    }
}
</script>

<template>
    <!-- <div>
        <ul v-if="true">
        <li v-for="item in this.extrasList" :key="item.item_id">
            {{ item.product_name }}
        </li>
        </ul>
        <p v-else>Loading inventory...</p>
        <p v-if="error">Error: {{ error }}</p>
    </div> -->
    <div>
    <ul v-if="extrasList.length > 0">
      <li v-for="item in extrasList" :key="item.item_id">
        <strong>{{ item.product_name }}</strong>
        <ul>
          <li>Quantity: {{ item.quantity }} - Minimum Threshold: {{ item.minimum_threshold }}</li>
          <li>Price: ${{ item.price }} - Reorder Price: ${{ item.reorder_price }} </li>
          <!-- Add more attributes as needed -->
        </ul>
      </li>
    </ul>
    <p v-else>Loading inventory...</p>
    <p v-if="error">Error: {{ error }}</p>
  </div>
</template>