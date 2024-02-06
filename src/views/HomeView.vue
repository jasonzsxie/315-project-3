<template>

  <div class="background">
    <img
      class = "lick-image"
      src = "https://media-cdn.grubhub.com/image/upload/d_search:browse-images:default.jpg/w_300,q_100,fl_lossy,dpr_2.0,c_fit,f_auto,h_300/duf4reb4wb1cx3qltfpo"
      alt="Ice cream from Lick Honest Ice Creams"
      aria-label = "Ice cream from Lick Honest Ice Creams"
    >
    <div class = "container">
      <div class = "carousel-container">
        <v-carousel class = "carousel">
          <v-carousel-item
            src="https://static.wixstatic.com/media/c58e38_6ed4675a23c644b5a6923e89104ebc86~mv2_d_2700_1800_s_2.jpg/v1/fill/w_1606,h_938,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c58e38_6ed4675a23c644b5a6923e89104ebc86~mv2_d_2700_1800_s_2.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://static.wixstatic.com/media/c58e38_6a1a9c0b2349415bb90e6c057275385a~mv2.jpg/v1/fill/w_1001,h_585,al_c,q_85,enc_auto/c58e38_6a1a9c0b2349415bb90e6c057275385a~mv2.jpg"
            cover
          ></v-carousel-item>
        </v-carousel>
      </div>
        <div class = "weather-container" v-if="WeatherData">
          <div class = "location">{{ WeatherData.location.name }}</div> <br>
          <div class="time"> {{ formatDateTime() }}</div> <br>
          <div class="tempblock">
          <div class = "weather">{{ WeatherData.current.temp_f }} °F</div> <br>
          <div class = "condition">{{ WeatherData.current.condition.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
/**
 * Home page view
 * @module HomeView
 */
export default {
  data() {
    return {
      WeatherData: null,
      userLocation: '',
    };
  },
  methods: {
     /**
     * Fetches weather data based on user's geolocation.
     * @async
     * @public
     */
    async fetchWeather() {
      try {

        navigator.geolocation.getCurrentPosition(async (position) => {
          const {latitude, longitude} = position.coords;

          const response = await axios.get(`https://node-backend-project-3-902-04.onrender.com/weather?lat=${latitude}&lon=${longitude}`);
          this.WeatherData = response.data;
        });
        
      }
      catch (err) {
        console.error('Error fetching weather data:', err.message);
      }
    },
    /**
     * Formats time in AM/PM format.
     * @param {Date} date - Date object to format.
     * @returns {string} Formatted time string.
     * @public
     */
    formatAMPM(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours %= 12;
      hours = hours || 12;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      const displayedTime = `${hours}:${minutes} ${ampm}`;
      return displayedTime;
    },
    /**
     * Formats date and time.
     * @returns {string} Formatted date and time string.
     * @public
     */
    formatDateTime() {
      const date = new Date(this.WeatherData.location.localtime);
      const formattedDate = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
      const formattedTime = this.formatAMPM(date);
      return `${formattedDate}, ${formattedTime}`;
    },
    
  },
  mounted() {
    this.fetchWeather();
  },
  
  components: {
    //HelloWorld
  }
}
</script>

<style>
.background {
  background: url('https://static.wixstatic.com/media/c58e38_6b180b1f38dc477abaef762cf515a37c~mv2_d_3526_1911_s_2.jpg/v1/fill/w_2994,h_1674,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c58e38_6b180b1f38dc477abaef762cf515a37c~mv2_d_3526_1911_s_2.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 100vh;

}

.container {
  display: flex;
}

.carousel-container {
  margin: auto;
  width: 55%;
}

.weather-container {
  width: 30%;
  justify-content: center;
  align-items: center;
  margin-right: 60px;
}

.weather-container .location{
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  text-shadow: 1px, 3px rgba(0,0,0,0.25)
}

.weather-container .time{
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  text-align: center;
}

.tempblock {
  text-align: center;
}

.tempblock .weather {
  display: inline-block;
  padding: 10px 25px;
  color: #009999;
  font-size: 102px;
  font-weight: 900;

  text-shadow: 3px 6px rgba(0,0,0,0.25);
  background-color: rgba(243,235,184,0.85);
  border-radius: 16px;
  margin: 30px 0px;

  box-shadow: 3px 6px rgba(0,0,0,0.25);
}

.tempblock .condition {
  font-size: 48px;
  font-style: italic;
  font-weight: 700;
}


.carousel {
  width: 90%;
}

.lick-image {
  max-height: 250px;
  max-width: 250px;
}

</style>
