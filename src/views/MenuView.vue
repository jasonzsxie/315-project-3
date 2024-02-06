<script>
import FlavorsList from '@/components/FlavorsList.vue'
import ToppingsList from '@/components/ToppingsList.vue'
import ExtrasList from '@/components/ExtrasList.vue'
import FeaturedList from '@/components/FeaturedList.vue'
import axios from 'axios';
/**
 * View for Menu
 * @module MenuView
 */
export default {
  components: {
    FlavorsList,
    ToppingsList,
    ExtrasList,
    FeaturedList
  },
  data() {
    return {
      screen: 0,
      inventory: [],
      featured: [],
      error: null,
    }
  },
  mounted() {
    this.fetchInventory();
    this.fetchFeatured();
  },
  methods: {
   /**
     * Fetches inventory data from the specified endpoint.
     * @public
     */
    async fetchInventory() {
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/menu'); // inventory is stored at this endpoint. TODO: check if this works in AWS deployment.
        this.inventory = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('An error occurred:', error);
      }
    },
    async fetchFeatured() {
      try {
        const response = await axios.get('https://node-backend-project-3-902-04.onrender.com/featured-items'); // inventory is stored at this endpoint.
        this.featured = response.data;
        console.log(this.featured);
      } catch (error) {
        this.error = error.message;
        console.error('An error occurred:', error);
        console.log(error.response.data)
      }
    },
    /**
     * Sets the screen to display flavors.
     * @public
     */
    showFlavors() {
      this.screen = 0
    },
    /**
     * Sets the screen to display toppings.
     * @public
     */
    showToppings() {
      this.screen = 1
    },
    /**
     * Sets the screen to display extras.
     * @public
     */
    showExtras() {
      this.screen = 2
    },
    /**
     * Sets the screen to display featured items.
     * @public
     */
    showFeatured() {
      this.screen = 3
    }
  }
};
</script>

<template>

  <div class="btn-group" style="width:100%">
    <v-container fluid>
      <v-row>
        <v-col width="100%">
          <button @click="showFlavors" id="flavors">Flavors</button>
        </v-col>
        <v-col width="100%">
          <button @click="showToppings" id="toppings">Toppings</button>
        </v-col>
        <v-col width="100%">
          <button @click="showExtras" id="extras">Extras</button> 
        </v-col>
        <v-col width="100%">
          <button @click="showFeatured" id="featured">Popular Items</button>
        </v-col>
      </v-row>
    </v-container>
    
  </div>
  <!-- TODO: see if there is an easier way to pass inventory into the child components. -->
  <FlavorsList :inventory="inventory" v-if="screen==0"/>
  <ToppingsList :inventory="inventory" v-else-if="screen==1"/>
  <ExtrasList :inventory="inventory" v-else-if="screen==2"/>
  <FeaturedList :featuredList="featured" v-else-if="screen==3"/>
</template>



<style>
  .btn-group button {
  background-color: #5653ea; 
  border: 1px solid #5653ea; 
  color: white; 
  width: 100%;
  /* padding: 10px 24px; */
  display: flex;
  /* align-items: stretch; */
  justify-content: center;
  cursor: pointer; 
  }

  .btn-group button:not(:last-child) {
    border-right: none; /* Prevent double borders */
  }

  /* Clear floats (clearfix hack) */
  .btn-group:after {
    content: "";
    clear: both;
    display: table;
  }

    /* Add a background color on hover */
    .btn-group button:hover {
      background-color: #7573e9;
    }
    
  </style>


