<script>
/**
 * Represents a component managing inventory data and computing extra items based on the store data prop.
 * @module InventoryExtras
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
        // computed value for flavorList is used instead of a mount because the inventory is passed in as a prop.
        // we are reactively computing the flavorList based on the inventory prop.
        extrasList() {
            return this.storedata.filter(item => item.item_type == 'flavor')
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