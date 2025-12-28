<script setup>
// Run locally with npm run dev
import { computed, onMounted, ref } from 'vue'
import { dateToSolarParemeters } from './calculator.js'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import LineChart from './components/LineChart.vue';

const timezone = ref(0)
const startDate = ref(new Date())
const endDate = ref(new Date(
    startDate.value.getFullYear() + 1,
    startDate.value.getMonth(),
    startDate.value.getDate()
))

const location = ref({
    latitude : 67.0,
    longitude : -50.0
})

const dates = ref([])
const sunlightData = ref([])

function calculate() {

    var temp_dates = []
    var temp_sunlight = []

    var cdate = new Date();
    cdate.setDate(startDate.value.getDate()); 

    var day = 0;
    
    while (cdate <= endDate.value) {
        temp_dates.push(day++);
        temp_sunlight.push(dateToSolarParemeters(
            cdate, 
            location.value.latitude, 
            location.value.longitude, 
            timezone
        ).sunlightDuration)
        cdate.setDate(cdate.getDate() + 1)
    }

    dates.value = temp_dates
    sunlightData.value = temp_sunlight

    console.log("Rendering")
    console.log(temp_sunlight.length)

}

calculate()

</script>

<template>

<div class="m-3">
<h1>CHIL - Solar power calculator</h1>
<form class="row g-3">
  <div class="col-md-6">
    <label for="latitude" class="form-label">Latitude</label>
    <input type="number" class="form-control" id="latitude" v-model="location.latitude" @change="calculate">
  </div>
  <div class="col-md-6">
    <label for="longitude" class="form-label">Longitude</label>
    <input type="number" class="form-control" id="longitude" v-model="location.longitude" @change="calculate">
  </div>
  <div class="col-12">
    <label for="deploymentStart" class="form-label">Deployment start</label>
    <VueDatePicker :formats="{ input: 'dd/MM/yyyy' }" :time-config="{ enableTimePicker: false, startTime: { hours: 12, minutes: 0 } }" :max-date="endDate" v-model="startDate" @update:model-value="calculate"></VueDatePicker>
  </div>
  <div class="col-12">
    <label for="deploymentend" class="form-label">Deployment end</label>
    <VueDatePicker :formats="{ input: 'dd/MM/yyyy' }" :time-config="{ enableTimePicker: false, startTime: { hours: 12, minutes: 0 } }" :min-date="startDate" v-model="endDate" @update:model-value="calculate"></VueDatePicker>
  </div>

  <div class="col-3">
    <button type="button" class="btn btn-primary" @click="calculate">Calculate</button>
  </div>
  
</form>
<!-- <span class="my-3">{{  solarParams.sunlightDuration }} mins</span> -->
</div>

<div>
  <LineChart :data="sunlightData" :labels="dates" />
</div>

</template>