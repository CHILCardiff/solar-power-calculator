<script setup>

    import { ref } from 'vue'

    const emit = defineEmits(['updateCalc'])

    const regulator = ref({
        calcParameter : "regulator",
        model : "custom",
        consumptionDay : 15.0,
        consumptionNight : 10.0
    })

    const models = [ 
        {
            name : "Victron Bluesolar MPPT 75/10",
            day : 23,
            night: 25
        },
        {
            name : "Epever Landstar LS1024EU",
            day : 12.7,
            night: 12.7
        },
        {
            name : "Morningstar Sunguard SG-4",
            day : 6.34,
            night: 6.34
        },
        {
            name : "Phocos ECO-N-10-T",
            day : 4,
            night: 3.6
        },
        {
            name : "Steca Solsum ST-SM6.6F",
            day: 4,
            night: 2.2
        },
        {
            name : "Genasun GV-5",
            day : 0.15,
            night: 0.114
        },
        {
            name : "Genasun GV-4",
            day : 0.125,
            night: 0.076
        },
        {
            name : "Eco Energy ASC30W",
            day: 7,
            night: 0.038
        }
    ]

    function updateRegulator(event) {
        // console.log("Changed regulator " + regulator.value.model)
        if (regulator.value.model != "Custom") {
            models.forEach(function (model) {
                if (model.name == regulator.value.model) {
                    // update regulator values
                    regulator.value.consumptionDay = model.day
                    regulator.value.consumptionNight = model.night
                }
            })
        }
        emit('updateCalc', event, regulator.value)
    }

</script>

<template>

    <form class="row g-3">
        <label for="loadType" class="form-label">Load type</label>
        <select id="loadType" class="mb-3 form-select" @change="updateRegulator" v-model="regulator.model">
            <option selected value="custom">Custom</option>
            <option v-for="reg in models" :value="reg.name">{{reg.name}}</option>
        </select>
        <div class="col-md-3">
            <label for="selfConsDay" class="form-label">Self-consumption (day)</label>
            <div class="input-group mb-3">
            <input type="number" class="form-control" id="selfConsDay" v-model.lazy="regulator.consumptionDay" :disabled="regulator.model != 'custom'">
            <span class="input-group-text" id="basic-addon2">mA</span>
            </div>
        </div>
        <div class="col-md-3">
            <label for="selfConsNight" class="form-label">Self-consumption (night)</label>
            <div class="input-group mb-3">
            <input type="number" class="form-control" id="selfConsNight" v-model.lazy="regulator.consumptionNight" :disabled="regulator.model != 'custom'">
            <span class="input-group-text" id="basic-addon2">mA</span>
            </div>
        </div><div class="col-md-6"></div>
    </form>

</template>