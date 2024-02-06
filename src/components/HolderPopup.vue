<script>
/**
 * Represents a Vue component managing store data and displaying a list of items of type 'holder'.
 * @module ExtrasList
 * @vue
 */
export default {
    props: {
      /**
     * Array containing store data.
     * @type {Array<Object>}
     */
        storedata: []
    },
    watch: {
      /**
     * Watches changes in the storedata prop.
     * @function
     * @name storedata
     * @param {Array<Object>} newVal - The new value of storedata.
     */
      storedata(newVal) {
        console.log('storedata changed:', newVal);
      },
    },
    computed: {
      /**
     * Computes a list of extra items based on the storedata prop filtered by item type 'holder'.
     * @function
     * @name extrasList
     * @returns {Array<Object>} - Filtered list of items of type 'holder'.
     */
        // computed value for flavorList is used instead of a mount because the inventory is passed in as a prop.
        // we are reactively computing the flavorList based on the inventory prop.
        extrasList() {
            return this.storedata.filter(item => item.item_type == 'holder')
        }
    }
}
</script>

<template>
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