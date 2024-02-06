<script>
/**
 * Component handling display of extra items based on store data.
 * @module ExtrasDisplay
 * @vue
 */
export default {
    props: {
        /**
       * Array containing store data (inventory).
       * @type {Array<Object>}
       */
        storedata: []
    },
    computed: {
      /**
     * Computes a list of extra items based on the inventory.
     * @function
     * @name extrasList
     * @returns {Array<Object>} - Filtered list of extra items.
     * @public
     */
        extrasList() {
            return this.storedata.filter(item => item.item_type == 'extra')
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