<script>
/**
 * Represents a component managing inventory data and computing featured items.
 * @module InventoryFeatured
 * @vue
 */
export default {
    props: {
        featuredList: Array
    },
}
</script>

<template>
    <div>
        <h1>Popular Items</h1>
        <v-container fluid v-if=this.featuredList.length>
            <v-row>
                <v-col
                v-for="item in this.featuredList" :key="item.item_id"
                :cols="3">
                    <v-card width="100%" height="100%" hover class="flex">
                        <v-card-item justify="center">
                            <img :src="item.img_url" alt="Featured Item Image" style="max-width: 200px; max-height: 200px; padding: 15px" />
                        </v-card-item>
                        <v-card-title class="text-wrap" style="word-break: normal" height="100%">
                            {{ item.combination }} <br />
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-else>Loading featured items...</p>
        <p v-if="featuredList == error">Error: {{ error }}</p>
    </div>
</template>