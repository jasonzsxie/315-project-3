<script>
// import { isTemplateElement, isTemplateLiteral } from '@babel/types';
/**
 * Represents a component managing inventory data and computing flavor items based on the inventory prop.
 * @module FlavorInventory
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
        /**
     * Computes a list of flavor items based on the inventory prop filtered by item type 'flavor'.
     * @function
     * @name flavorList
     * @returns {Array<Object>} - Filtered list of items of type 'flavor'.
     */
        flavorList() {
            return this.inventory.filter(item => item.item_type == 'flavor')
        }
    }
}
</script>

<template>
    <div>
        <h1>Flavors</h1>
        <v-container fluid v-if=this.flavorList.length>
            <v-row>
                <v-col
                v-for="item in this.flavorList" :key="item.item_id"
                :cols="3">
                    <v-card width="100%" height="100%" hover class="flex">
                        <v-spacer />
                        <v-card-item>
                            <img :src="item.img_url" alt="Flavor Image" style="width: 200px; height: 150px; padding: 15px" />
                        </v-card-item>
                        <v-card-title height="100%" v-if="item.product_name == 'Honey Sunbutter' || item.product_name == 'Vanilla Pear Cake'">
                            {{ item.product_name }} <br />
                            (Dairy Free)
                        </v-card-title>
                        <v-card-title v-else>
                            {{ item.product_name }} <br />
                            (Contains Dairy)
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-else>Loading flavors...</p>
        <p v-if="error">Error: {{ error }}</p>
    </div>
</template>