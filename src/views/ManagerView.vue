<template>
<div v-if="$store.state.userName === 'Admin' || $store.state.userName === 'Manager'" >
    <!-- <button @click="toggleFontSize">Toggle Font Size</button> -->


      <div class="button-container">
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/orderlog')">Order Log</button>
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/salesrevenue')">Sales & Revenue</button>
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/inventorymanagement')">Inventory Management</button>
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/productusage')">Product Usage</button>
        <button style="--c: black; --b: 5px; --s: 12px;" @click="navigateTo('/menumanagement')">Menu Management</button> 
      </div> 
</div>
<div v-else>
    <h1>Sorry, you don't have access to this page.</h1>
</div>
</template>
  
<script>
/**
 * View for manager
 * @module ManagerView
 */
export default {
  data() {
    return {
      isFontSizeIncreased: false,
    };
  },
  methods: {
    /**
     * Navigates to a specified path using Vue Router.
     * @param {string} path - The path to navigate to.
     * @public
     */
    navigateTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style>
  /* Container for the buttons */
  .button-container {
    display: flex;
    flex-direction: column; /* Arrange buttons vertically */
    align-items: center; /* Center buttons horizontally */
    margin-top: 5px;
  }

  /* Common styles for buttons */
  button {
    --b: 3px;   /* Border thickness */
    --s: .15em; /* Size of the corner */
    --c: black; 

    /* Button styles using custom properties */
    width: 900px;
    /* padding: calc(.5em + var(--s)) calc(3em + var(--s));   */
    padding: 18px;
    color: var(--c);
    --_p: var(--s);
    background:
      conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--c) 0)
      var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
    transition: .3s linear, color 0s, background-color 0s;
    outline: var(--b) solid #0000;
    outline-offset: .2em;
    font-family: system-ui, sans-serif;
    /* font-weight: bold; */
    font-weight: bolder;
    /* font-size: 4rem; */
    font-size: 30px;
    cursor: pointer;
    border: none;
    margin: .1em;
  }

  /* Button hover and focus styles */
  button:hover,
  button:focus-visible {
    --_p: 0px;
    outline-color: var(--c);
    outline-offset: .05em;
  }

  /* Button active state styles */
  button:active {
    background: var(--c);
    color: white;
  }
</style>