<script>
/**
 * Represents a Vue component that filters inventory for items of type 'topping'.
 * @exports ToppingListComponent
 * @type {object}
 */
export default {
    props: {
        /**
     * The array of inventory items passed as a prop to filter for toppings.
     * @type {Array.<object>}
     */
        inventory: []
    },
    computed: {
        /**
     * Computes the list of items categorized as 'topping' from the inventory prop.
     * @function
     * @returns {Array.<object>} Filtered list of items categorized as 'topping'.
     */
        toppingList() {
            return this.inventory.filter(item => item.item_type == 'topping')
        }
    }
}
</script>

<template>
    <div>
        <h1>Toppings</h1>
        <v-container fluid v-if=this.toppingList.length>
            <v-row>
                <v-col
                v-for="item in this.toppingList" :key="item.item_id"
                :cols="3">
                    <v-card width="100%" height="100%" hover class="flex">
                        <v-card-item>
                            <img :src="item.img_url" alt="Topping Image" style="max-width: 200px; max-height: 200px; padding: 15px" />
                        </v-card-item>
                        <v-card-title class="justify-bottom" height="100%" v-if="item.product_name == 'Whipped Cream' || item.product_name == 'Chocolate Cookie Crumble' || item.product_name == 'Chocolate Sauce'">
                            {{ item.product_name }} <br />
                            (Contains Dairy)
                        </v-card-title>
                        <v-card-title class="justify-bottom" v-else-if="item.product_name == 'Toasted Texas Pecans'">
                            {{ item.product_name }} <br />
                            (Dairy Nuts)
                        </v-card-title>
                        <v-card-title class="justify-bottom" v-else>
                            {{ item.product_name }}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-else>Loading toppings...</p>
        <!-- <p v-if="error">Error: {{ error }}</p> -->
    </div>
</template>