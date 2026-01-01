<script setup>

    import { ref } from 'vue'

    const load = ref({
        calcParameter : 'load',
        type : "continuous",
        consumptionContinuous : 5.0,
        activeConsumption     : 5.0,
        sleepConsumption      : 0.1,
        activeInterval        : 10, // seconds
        sleepInterval         : 590 // seconds
    })

    defineEmits(['updateCalc'])

</script>

<template>
    <label for="loadType" class="form-label">Load type</label>
    <select id="loadType" class="mb-3 form-select" @change="$emit('updateCalc', $event, load)" v-model="load.type">
        <option selected value="continuous">Continuous</option>
        <option value="burst">Burst</option>
    </select>
    <!-- continuous mode selection -->
    <div v-if="load.type == 'continuous'">
        <label for="load" class="form-label">Load consumption (continuous)</label>
        <div class="input-group mb-3">
            <input type="number" class="form-control" id="load" v-model.lazy="load.consumptionContinuous" @change="$emit('updateCalc', $event, load)">
          <span class="input-group-text" id="basic-addon2">mA</span>
        </div>
    </div>
    <div v-else>
        <form class="row g-3">
            <div class="col-md-6">
                <label for="activeConsumption" class="form-label">Active consumption</label>
                <div class="input-group mb-3">
                    <input type="number" class="form-control" id="activeConsumption" v-model.lazy="load.activeConsumption">
                    <span class="input-group-text" id="basic-addon2">mA</span>
                </div>
                <label for="activeInterval" class="form-label">Active interval</label @change="$emit('updateCalc', $event, load)">
                <div class="input-group mb-3">
                    <input type="number" class="form-control" id="activeInterval" v-model.lazy="load.activeInterval" @change="$emit('updateCalc', $event, load)">
                    <span class="input-group-text" id="basic-addon2">s</span>
                </div>
            </div>
            <div class="col-md-6">
                <label for="sleepConsumption" class="form-label">Sleep consumption</label>
                <div class="input-group mb-3">
                    <input type="number" class="form-control" id="sleepConsumption" v-model.lazy="load.sleepConsumption" @change="$emit('updateCalc', $event, load)">
                    <span class="input-group-text" id="basic-addon2">mA</span>
                </div>
                <label for="sleepInterval" class="form-label">Sleep interval</label>
                <div class="input-group mb-3">
                    <input type="number" class="form-control" id="sleepInterval" v-model.lazy="load.sleepInterval" @change="$emit('updateCalc', $event, load)">
                    <span class="input-group-text" id="basic-addon2">s</span>
                </div>
            </div>
        </form>
    </div>
</template>