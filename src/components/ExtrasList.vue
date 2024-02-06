<script>
/**
 * Represents a component managing inventory data and computing extra items.
 * @module InventoryExtras
 * @vue
 */
export default {
    props: {
        /**
     * Array containing inventory data.
     * @type {Array<Object>}
     */
        inventory: []
    },
    computed: {
        // computed value for flavorList is used instead of a mount because the inventory is passed in as a prop.
        // we are reactively computing the flavorList based on the inventory prop.
        extrasList() {
            return this.inventory.filter(item => item.item_type == 'extra')
        }
    }
}
</script>

<template>
    <div>
        <h1>Extras</h1>
        <v-container fluid v-if=this.extrasList.length>
            <v-row>
                <v-col
                v-for="item in this.extrasList" :key="item.item_id"
                :cols="3">
                    <v-card width="100%" height="100%" hover class="flex">
                        <v-card-item justify="center">
                            <img :src="item.img_url" alt="Extra Image" style="max-width: 200px; max-height: 200px; padding: 15px" />
                        </v-card-item>
                        <v-card-title height="100%" v-if="item.product_name == 'Cookie' || item.product_name == 'Chocolate Bar'">
                            {{ item.product_name }} <br />
                            (Contains Dairy)
                        </v-card-title>
                        <v-card-title v-else>
                            {{ item.product_name }}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-else>Loading extras...</p>
        <p v-if="error">Error: {{ error }}</p>
    </div>
</template>