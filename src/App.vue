<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  </head>
  <v-app :dark="isDarkModeEnabled" lang="en">
    <v-card>
    <v-layout>
      <v-app-bar :color="isDarkModeEnabled ? 'blue-darken-1' : 'cyan-accent-2'" height="100">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="title">LICK HONEST ICE CREAMS</v-toolbar-title>

        <v-spacer></v-spacer>
        
        <div id="google_translate_element"></div>

        <v-btn aria-label="Toggle Font Size" color="black" @click="toggleFontSize" variant="text" icon="mdi-format-size"></v-btn>

        <v-btn aria-label="Toggle Dark Mode" color="black" @click="toggleDarkMode" variant="text" icon="mdi-circle-half-full"></v-btn>

      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="left" temporary :style="{ background: isDarkModeEnabled ? '#333' : '#EEEEEE', width: '270px' }">
          <v-list>
            <v-list-item v-for="item in items" :key="item.value" :to="{ name: item.value }">
              <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
              <v-list-item-title :style="{ color: isDarkModeEnabled ? 'white' : 'black', 'font-weight': 'bold' }">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

      <!-- <v-main style="min-height: 100vh; overflow-y: auto;"> -->
      <v-main style="min-height: 100vh; overflow-y: auto;" :style="{ background: isDarkModeEnabled ? '#616161' : '#f5f5f5' }">

        <router-view></router-view>
        
      </v-main>
    </v-layout>
    </v-card>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      isFontSizeIncreased: false,
      isDarkModeEnabled: false,
      drawer: false,
      group: null,
      items: [
        {
          title: 'Home',
          value: 'HomeView',
        },
        {
          title: 'Cashier',
          value: 'CashierView',
        },
        {
          title: 'Manager',
          value: 'ManagerView',
        },
        {
          title: 'Menu',
          value: 'MenuView',
        },
        {

          title: 'Customer',
          value: 'CustomerView',
        },
        {
          title: 'Admin',
          value: 'AdminView',
        },
        {
          title: 'Log in',
          value: 'LoginView'
        }
      ],
    }),

    watch: {
      group() {
        this.drawer = false
      },
    },

    methods: {
      toggleFontSize() {
        // Toggle the font size state
        this.isFontSizeIncreased = !this.isFontSizeIncreased;

        //Apply the new font size to all elements
        const elements = document.querySelectorAll('*');
        elements.forEach((element) => {
          // if (element.tagName.toLowerCase() === 'img') {
          //   element.style.width = this.isFontSizeIncreased ? '110%' : '';
          // } else {
            element.style.fontSize = this.isFontSizeIncreased ? '36px' : ''; // Adjust the font size as needed
          //}
        });
        // Apply the new dimensions to all images
        // const images = document.querySelectorAll('img');
        // images.forEach((image) => {
        //   image.style.width = this.isFontSizeIncreased ? '150%' : '';
        //   image.style.height = this.isFontSizeIncreased ? '150%' : '';
        // });

        // // Apply the new font size to text elements
        // const elements = document.querySelectorAll('*:not(img)');
        // elements.forEach((element) => {
        //   element.style.fontSize = this.isFontSizeIncreased ? '36px' : '';
        // });
      },

      toggleDarkMode() {
        // Toggle the dark mode state
        this.isDarkModeEnabled = !this.isDarkModeEnabled;

        //Change the text color to white when dark mode is enabled
        const elements = document.querySelectorAll('*');
        elements.forEach((element) => {
          element.style.color = this.isDarkModeEnabled ? '#E5E4E2' : ''; 
        });
        
      },

      loadGoogleTranslate() {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        };
      },
      
      
    },

    mounted() {
      this.loadGoogleTranslate();
    },
  };
  
    
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&family=Fugaz+One&display=swap');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.custom-icon {
  font-size: 24px; /* Adjust the font size as needed */
  color: #333; /* Change the color to your desired color */
  cursor: pointer; /* Add a pointer cursor for better interaction */
}

.v-app-bar .title {
  font-family: 'Fugaz One', sans-serif;
  font-size: 28px;
  font-weight: bold;
  text-align: right;
  color: black;
}


</style>
