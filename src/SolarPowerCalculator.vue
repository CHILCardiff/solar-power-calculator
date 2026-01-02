<script setup>
// Run locally with npm run dev
import { computed, onMounted, ref } from 'vue'
import { calculateBatteryCharging, dateToSolarParemeters } from './calculator.js'
import Load from './components/Load.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import LineChart from './components/LineChart.vue';
import Regulator from './components/Regulator.vue';

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

const panel = ref({
    power : 20.0,
    derating : 10
})

const regulator = ref({
  consumptionDay : 10,
  consumptionNight : 15
})

const load = ref({
  calcParameter : 'load',
  type : "continuous",
  consumptionContinuous : 5.0,
  activeConsumption     : 5.0,
  sleepConsumption      : 0.1,
  activeInterval        : 10, // seconds
  sleepInterval         : 590 // seconds
})

const battery = ref({
  voltage : 12.0,
  capacity : 26.0,
  derating : 50,
  efficiency : 85,
  initialCapacity : 50
})

const dates = ref([])
const sunlightData = ref([])

const minDischarge = ref(100)

function calculate() {

    var temp_dates = []
    var temp_sunlight = []

    var cdate = new Date();
    cdate.setDate(startDate.value.getDate()); 

    var day = 0;
    
    while (cdate <= endDate.value) {
        temp_dates.push(cdate.toLocaleDateString());
        temp_sunlight.push(dateToSolarParemeters(
            cdate, 
            location.value.latitude, 
            location.value.longitude, 
            timezone
        ).sunlightDuration)
        cdate.setDate(cdate.getDate() + 1)
    }

    var capacities = calculateBatteryCharging(
      temp_sunlight, battery, panel, regulator, load
    )

    dates.value = temp_dates
    sunlightData.value = capacities

}

function updateCalc(event, data) {
  
  console.log("updateCalc triggered")
  if (data != undefined) {
    console.log(data.calcParameter)
    if (data.calcParameter == "load") {
      console.log("updating load")
      load.value = data;
    }
    else if (data.calcParameter == "regulator") {
      console.log(regulator.value)
      console.log(data.value)
      console.log("updating regulator")
      regulator.value.consumptionDay = data.consumptionDay;
      regulator.value.consumptionNight = data.consumptionNight;
      console.log(regulator.value)
    }
  }

  calculate()

  minDischarge.value = Math.min(...sunlightData.value)

}

updateCalc()

</script>

<template>

<div class="p-3 container-fluid">
<div class="d-flex mb-3 pb-3 border-bottom align-items-center">
    <img src="@/assets/img/cardiff-logo.webp" alt="" height="64" class="d-inline-block align-text-top"/>
    <h1 class="d-none d-flex-md ms-3">Solar power calculator</h1>
    <h3 class="d-flex d-none-md ms-3">Solar power calculator</h3>
</div>
<p>
  This tool is designed to help plan power system requirements for deployments of solar-powered instrumentation and is based on the spreadsheet tool described in <a href="https://gi.copernicus.org/articles/14/503/2025/">this paper</a>.
</p>
<div class="row">
<div class="col-xl-6">
  <!-- Tab navigation bar -->
  <ul class="nav nav-tabs" id="parameterTabs" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="deployment-tab" data-bs-toggle="tab" data-bs-target="#deployment-tab-pane" type="button" role="tab" aria-controls="deployment-tab-pane" aria-selected="true">Deployment</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="battery-tab" data-bs-toggle="tab" data-bs-target="#battery-tab-pane" type="button" role="tab" aria-controls="battery-tab-pane" aria-selected="false">Battery</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="solar-tab" data-bs-toggle="tab" data-bs-target="#solar-tab-pane" type="button" role="tab" aria-controls="solar-tab-pane" aria-selected="false">Solar panel</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="regulator-tab" data-bs-toggle="tab" data-bs-target="#regulator-tab-pane" type="button" role="tab" aria-controls="regulator-tab-pane" aria-selected="false">Solar regulator</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="load-tab" data-bs-toggle="tab" data-bs-target="#load-tab-pane" type="button" role="tab" aria-controls="load-tab-pane" aria-selected="false">Instrument load</button>
    </li>
  </ul>
  <div class="tab-content" id="">
    <!-- Deployment parameters tab -->
    <div class="tab-pane fade show active p-3" id="deployment-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
      <form class="row g-3">
        <div class="col-6">
        <label for="latitude" class="form-label">Latitude</label>
        <!-- -->
        <div class="input-group mb-3">
          <input min="-90" max="90" type="number" class="form-control" id="latitude" v-model.lazy="location.latitude" @change="updateCalc">
          <span class="input-group-text" id="basic-addon2">&deg;N</span>
        </div>
        
        </div>
        <div class="col-6">
          <label for="longitude" class="form-label">Longitude</label>
          <div class="input-group mb-3">
            <input min="-180" max="180" type="number" class="form-control" id="longitude" v-model.lazy="location.longitude" @change="calculate">
            <span class="input-group-text" id="basic-addon2">&deg;W</span>
          </div>
        </div>
        <div class="col-6">
          <label for="deploymentStart" class="form-label">Deployment start</label>
          <VueDatePicker :formats="{ input: 'dd/MM/yyyy' }" :time-config="{ enableTimePicker: false, startTime: { hours: 12, minutes: 0 } }" :max-date="endDate" v-model.lazy="startDate" @update:model-value="updateCalc"></VueDatePicker>
        </div>
        <div class="col-6">
          <label for="deploymentend" class="form-label">Deployment end</label>
          <VueDatePicker :formats="{ input: 'dd/MM/yyyy' }" :time-config="{ enableTimePicker: false, startTime: { hours: 12, minutes: 0 } }" :min-date="startDate" v-model.lazy="endDate" @update:model-value="updateCalc"></VueDatePicker>
        </div>
      </form>
      <div class="alert alert-info mt-3">
        <p>
          <svg class="bi flex-shrink-0 me-1" width="16" height="16" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
          The location of the deployment affects the solar powered delivered from the panel to the battery due to changing elevation of the sun above the horizon. In polar regions, this can result in periods where no charging takes place.
        </p>
      </div>
    </div>
    <div class="tab-pane fade p-3" id="battery-tab-pane" role="tabpanel" aria-labelledby="battery-tab" tabindex="0">
      <form class="row g-3">
        <div class="col-md-3">
          <label for="voltage" class="form-label">Nominal voltage</label>
          <div class="input-group mb-3">
            <input min="0" type="number" class="form-control" id="voltage" v-model.lazy="battery.voltage">
            <span class="input-group-text" id="basic-addon2">V</span>
          </div>
        </div>
        <div class="col-md-3">
          <label for="capacity" class="form-label">Current capacity</label>
          <div class="input-group mb-3">
            <input min="0" type="number" class="form-control" id="capacity" v-model.lazy="battery.capacity">
            <span class="input-group-text" id="basic-addon2">Ah</span>
          </div>
        </div>
        <div class="col-md-3">
          <label for="battDerating" class="form-label">Temperature derating</label>
          <div class="input-group mb-3">
            <input min="0" max="100" type="number" class="form-control" id="battDerating" v-model.lazy="battery.derating">
            <span class="input-group-text" id="basic-addon2">%</span>
          </div>
        </div>
        <div class="col-md-3">
          <label for="chargeEfficiency" class="form-label">Charge efficiency</label>
          <div class="input-group mb-3">
            <input min="0" max="100" type="number" class="form-control" id="chargeEfficiency" v-model.lazy="battery.efficiency">
            <span class="input-group-text" id="basic-addon2">%</span>
          </div>
        </div>
      </form>
      <div class="mt-3 alert alert-info">
        <p>
          <svg class="bi flex-shrink-0 me-1" width="16" height="16" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
          The depth of discharge depends on the battery's power capacity, determined by its nominal voltage (V) and current capacity (Ah).
        </p>
        <p>
          In low temperatures, the total available capacity of a battery is reduced. This effect is modelled with the "temperature derating" field below, which dictates the fraction of the nominal capacity which is available.
        </p>
        <p>
          Energy is lost during the charging of a lead-acid battery through heat and gassing, which reduces the amount of energy from the solar panel stored in the battery during charging. This is modelled with the "charge efficiency" parameter.
        </p>
      </div>
    </div>
    <div class="tab-pane fade p-3" id="solar-tab-pane" role="tabpanel" aria-labelledby="solar-tab" tabindex="0">
      <form class="row g-3">      
        <div class="col-md-3">
          <label for="panelPower" class="form-label">Power</label>
          <div class="input-group mb-3">
            <input type="number" class="form-control" id="panelPower" v-model.lazy="panel.power">
            <span class="input-group-text" id="basic-addon2">W</span>
          </div>
        </div>
        <div class="col-md-3">
          <label for="panelDerating" class="form-label">Panel derating</label>
          <div class="input-group mb-3">
            <input type="number" class="form-control" id="panelDerating" v-model.lazy="panel.derating">
            <span class="input-group-text" id="basic-addon2">%</span>
          </div>
        </div><div class="col-md-6"></div>
      </form>
      <div class="mt-3 alert alert-info">
        <p>
        <svg class="bi flex-shrink-0 me-1" width="16" height="16" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
        The power delivered from a solar panel depends on its surface area. Solar panels are typically sold with a rated maximum power (specified here) but are unlikely to deliver this power unless in direct sunlight. The panel derating factor models the impact of suboptimal weather conditions by delivering only a specified fraction of the rated power. Anecdotally, we have found 10% to be a reasonable value for this for a range of expected weather conditions.
      </p>
      </div>
    </div>
    <!-- Regulator panel -->
    <div class="tab-pane fade p-3" id="regulator-tab-pane" role="tabpanel" aria-labelledby="regulator-tab" tabindex="0">
        <Regulator @update-calc="updateCalc"/>
      <div class="mt-3 alert alert-info">
        <p>
          <svg class="bi flex-shrink-0 me-1" width="16" height="16" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
          Solar regulators are not a free lunch and will also require an electrical current to operate correctly. This current can change depending on whether the regulator is operated while the solar panel is illuminated or in the dark. As such, we provide two parameters to describe the "self-consumption" current of the solar regulator: one for 'day' when the panel is illuminated, and one for 'night' when the panel is in the dark.
        </p>
      </div>
    </div>
    <div class="tab-pane fade p-3" id="load-tab-pane" role="tabpanel" aria-labelledby="load-tab" tabindex="0">
        <Load @update-calc="updateCalc"/>
    </div>
  </div>

  <button type="button" class="btn btn-primary" @click="updateCalc">Calculate</button>

  <div v-if="minDischarge < 40" class="mt-3 alert alert-danger" role="alert">
    The depth of discharge is below 40% - this risks limiting the longevity of the lead acid battery! 
  </div>
</div>

<div class="col-xl-6">
  <LineChart style="height: 480px" :data="sunlightData" :labels="dates" />
</div>

</div><!-- end row -->

<div class="row mt-3">
<h3>Cryospheric and Hydrological Instrumentation Laboratory</h3>
<p>
  The original spreadsheet tool was developed by Mike Prior-Jones and modified by Jonathan Hawkins from the CHIL research group at Cardiff University. It is based on the NOAA Global Monitoring Laboratory and equations from <em>Astronomical Algorithms</em>, by Jean Meeus. The sunrise/sunset times are accurate to within 10 minutes across all latitudes, and within a minute for latitudes between &plusmn;72&deg;.
</p>
</div><!-- end row -->

</div>


<svg class="d-none">
  <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </symbol>
</svg>

</template>