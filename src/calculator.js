
function gregorianDateToJulianDate(date) {

    // convert Date to UTC timezone first
    if (date == undefined)
        return undefined;

    const year = date.getFullYear()
    var month = date.getMonth() + 1
    if (month == 1) month = 13;
    if (month == 2) month = 14;
    const day = date.getDate()
    const hour = 12//date.getHours()
    const mins = 0//date.getMinutes()
    const secs = 0//date.getSeconds()

    // Referenced from:
    // https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
    const julianDate = (
        (2 - parseInt(year/100) + parseInt(parseInt(year/100)/4)) + day + parseInt(365.25*(year + 4716)) + parseInt(30.6001 * (month + 1)) - 1524.5 + hour/24 + mins/1440 + secs/86400
    )

    return julianDate
}

function julianDateToJulianCentury(date) {
    return (date-2451545)/36525
}

function deg2rad(deg) {
    return deg * Math.PI / 180
}

function rad2deg(rad) {
    return rad * 180 / Math.PI
}

export function dateToSolarParemeters(date, latitude, longitude, timezone) {

        const julianCentury = julianDateToJulianCentury(gregorianDateToJulianDate(date));
    
// Julian century
// G2 
// Geom mean long sun
// I2
    const geomMeanLongSun = (280.46646 + julianCentury * (36000.76983 + julianCentury *0.0003032)) % 360;
    
// Geom mean anom
// J2
    const geomMeanAnom = 357.52911+ julianCentury * (35999.05029 - 0.0001537 * julianCentury)
    
// Eccent earth orbit
// K2
    const eccentEarthOrbit = 0.016708634 - julianCentury*(0.000042037+0.0000001267*julianCentury)
    
// Sun eq of ct
// L2 =
    const sunEqOfCt = Math.sin(deg2rad(geomMeanAnom))*(1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) + Math.sin(2 * deg2rad(geomMeanAnom))*(0.019993-0.000101* julianCentury)+Math.sin(deg2rad(3*geomMeanAnom))*0.000289
        
// Sun true long
// M2 =
    const sunTrueLong = geomMeanLongSun + sunEqOfCt
    
// Sun true anom
// N2 = 
    const sunTrueAnom =geomMeanAnom + sunEqOfCt
    
// Sun rad vector
// O2 =
    const sunRadVector = (1.000001018*(1-eccentEarthOrbit*eccentEarthOrbit))/(1+eccentEarthOrbit*Math.cos(deg2rad(sunTrueAnom)))
    //(1.000001018*(1-eccentEarthOrbit*eccentEarthOrbit))/(1+eccentEarthOrbit*Math.cos(rad2deg(sunTrueAnom)))
    
// Sun app long
// P2 
    const sunAppLong = sunTrueLong-0.00569-0.00478*Math.sin(deg2rad(125.04-1934.136*julianCentury))
    
// Mean obliq ecliptic
// Q2
    const meanObliqEcliptic =23 + (26 + ((21.448-julianCentury*(46.815+julianCentury*(0.00059-julianCentury*0.001813))))/60)/60
        
// Obliq corr
// R2 
    const obliqCorr = meanObliqEcliptic + 0.00256*Math.cos(deg2rad(125.04-1934.136*julianCentury))
        
// Sun rt ascen
// S2 
    const sunRtAscen = rad2deg(Math.atan2(Math.cos(deg2rad(obliqCorr)),Math.cos(deg2rad(sunAppLong)))*Math.sin(deg2rad(sunAppLong)))
    
// Sun declin
// T2 =
    const sunDeclin = rad2deg(Math.asin(Math.sin(deg2rad(obliqCorr))*Math.sin(deg2rad(sunAppLong))))
        
// Vary
// U2 =
    const vary = Math.pow(Math.tan(deg2rad(obliqCorr/2)), 2)
    
// Eq of time (mins)
// V2 =
    const eqOfTime = 4*rad2deg(vary*Math.sin(2*deg2rad(geomMeanLongSun))-2*eccentEarthOrbit*Math.sin(deg2rad(geomMeanAnom))+4*eccentEarthOrbit*vary*Math.sin(deg2rad(geomMeanAnom))*Math.sin(2*deg2rad(geomMeanLongSun))-0.5*vary*vary*Math.sin(4*deg2rad(geomMeanLongSun))-1.25*eccentEarthOrbit*eccentEarthOrbit*Math.sin(2*deg2rad(geomMeanAnom)))
    
// HA Sunrise cosine
// W2
    const haSunriseCosine = Math.cos(deg2rad(90.833))/(Math.cos(deg2rad(latitude))*Math.cos(deg2rad(sunDeclin)))-Math.tan(deg2rad(latitude))*Math.tan(deg2rad(sunDeclin))
    
// HA Sunrise (deg)
// X2 
    var haSunriseDegrees = 0;
    if (haSunriseCosine < -1) {
        haSunriseDegrees = 180
    } else if (haSunriseCosine > 1) {
        haSunriseDegrees = 0
    } else {
        haSunriseDegrees = rad2deg(Math.acos(haSunriseCosine))
    }

    // Solar noon
// Y2 
    const solarNoon = (720-4*longitude-eqOfTime+timezone*60)/1440

// Sunlight duration 
    const sunlightDuration = 8*haSunriseDegrees

    return {
        solarNoon : solarNoon,
        sunlightDuration : sunlightDuration
    }

}

// export class Battery {

//     #_capacity;
//     #_voltage;
//     #_chargeEfficiency;
//     #_temperatureDerating;

//     constructor(
//         voltage, 
//         capacity, 
//         chargeEfficiency, 
//         temperatureDerating
//     ) {
//         if (voltage == undefined) voltage = 12.0;
//         this.voltage = voltage;

//         if (capacity == undefined) capacity = 26.0;
//         this.capacity = capacity;

//         if (chargeEfficiency == undefined) chargeEfficiency = 100;
//         this.chargeEfficiency = chargeEfficiency;

//         if (temperatureDerating == undefined) temperatureDerating = 50;
//         this.temperatureDerating = temperatureDerating;
//     }

//     // Voltage
//     // -----------------------------------------------------------------------
//     set voltage (v) {
//         if (isNaN(v) || v <= 0)
//             throw Error("Battery voltage should be greater than 0V.");
//         else
//             this._voltage = parseFloat(v);
//     }
//     get voltage () {
//         return this._voltage;
//     }

//     // Capacity
//     // -----------------------------------------------------------------------
//     set capacity(c) {
//         if (isNaN(c) || c <= 0)
//             throw Error("Battery capacity should be greater than 0 Ah.");
//         else
//             this._capacity = parseFloat(c);
//     }
//     get capacity() {
//         return this._capacity;
//     }
    
//     // Charge efficiency
//     // -----------------------------------------------------------------------
//     set chargeEfficiency(ce) {
//         if (isNaN(ce) || ce <= 0 || ce > 100)
//             throw Error("Charge efficiency should be greater than 0% and less than or equal to 100%.")
//         else
//             this._chargeEfficiency = ce;
//     }
//     get chargeEfficiency() {
//         return this._chargeEfficiency;
//     }

//     // Temperature de-rating
//     // -----------------------------------------------------------------------
//     set temperatureDerating(td) {
//         if (isNaN(td) || td <= 0 || td > 100) {
//             throw Error("Temperature derating should be greater than 0% or equal to 100%");
//         } else {
//             this._temperatureDerating = td;
//         }
//     }
//     get temperatureDerating() {
//         return this._temperatureDerating;
//     }

//     // Calculated variables
//     // -----------------------------------------------------------------------
//     get effectiveCapacity() {
//         return this.capacity * this.temperatureDerating / 100;
//     }

//     get powerCapacity() {
//         return this.capacity * this.voltage;
//     }

//     get effectivePowerCapacity() {
//         return this.effectiveCapacity * this.voltage;
//     }  

// }

// export class Panel {

//     #_power;
//     #_derating;

//     constructor(
//         power,
//         derating    
//     ) {
//         if (power == undefined) power = 20.0;
//         this.power = power;

//         if (derating == undefined) derating = 10.0;
//         this.derating = derating;
//     }

//     // Panel rated power
//     // -----------------------------------------------------------------------
//     set power (v) {
//         if (isNaN(v) || v <= 0)
//             throw Error("Panel rated power should be greater than 0W.");
//         else
//             this._power = parseFloat(v);
//     }
//     get power () {
//         return this._power;
//     }

//     // Capacity
//     // -----------------------------------------------------------------------
//     set derating(c) {
//         if (isNaN(c) || c <= 0)
//             throw Error("Panel derating factor should be greater than 0 Ah.");
//         else
//             this._derating = parseFloat(c);
//     }
//     get derating() {
//         return this._derating;
//     }

//     // Calculated variables
//     // -----------------------------------------------------------------------
//     get effectivePower() {
//         return this.power * this.derating / 100;
//     }

// }

// export class Regulator {

//     #_consumptionDark;
//     #_consumptionLight;

//     constructor(consumptionDark, consumptionLight) {

//         if (consumptionDark == undefined) consumptionDark = 0.0;
//         this.consumptionDark = consumptionDark;

//         if (consumptionLight == undefined) consumptionLight = 0.0;
//         this.consumptionLight = consumptionLight;

//     }

//     set consumptionDark(cd) {
//         if (isNaN(cd) || cd < 0)
//             throw Error("Night consumption cannot be less than 0 mA.");
//         else 
//             this._consumptionDark = cd;
//     }
//     get consumptionDark() {
//         return this._consumptionDark;
//     }

//     set consumptionLight(cl) {
//         if (isNaN(cl) || cl < 0)
//             throw Error("Day consumption cannot be less than 0 mA.");
//         else 
//             this._consumptionLight = cl;
//     }
//     get consumptionLight() {
//         return this._consumptionLight;
//     }

// }

export function calculateBatteryCharging(
    sunlightHours, battery, panel, regulator, load
) {

    var batteryCapacities = []
    var batteryCapacity = (battery.value.initialCapacity / 100) * battery.value.capacity *  battery.value.voltage
    const maxCapacity = battery.value.capacity * battery.value.voltage

    var loadTimeRemaining = 0; // start with number of seconds in a day

    sunlightHours.forEach(function (val) {

        // New day, add to loadTime 
        loadTimeRemaining += 24 * 60 * 60;

        // Get day and night fractions
        var dayFraction     = val / 1440
        var nightFraction   = (1440 - val) / 1440

        // Energy consumed (regulator)
        var dayEnergyRegulator = dayFraction * 24 * (regulator.value.consumptionDay / 1000) * battery.value.voltage
        var nightEnergyRegulator = nightFraction * 24 * (regulator.value.consumptionNight / 1000) * battery.value.voltage

        // Energy consumed (load)
        var energyLoad;
        if (load.value.type == 'continuous') {
            // Simple calculation for continuous current draw
            energyLoad = 24 * battery.value.voltage * load.value.consumptionContinuous / 1000
        } else {
            // Calculate total interval from start to end of sleep
            var totalInterval = load.value.activeInterval + load.value.sleepInterval
            // Calculate bursts per day
            var bursts = Math.floor(loadTimeRemaining / totalInterval)
            // Calculate leftover time
            loadTimeRemaining = loadTimeRemaining - bursts * totalInterval
            // Calculate energy used

            energyLoad = bursts * load.value.activeInterval / (24 * 60) * battery.value.voltage * load.value.activeConsumption / 1000 + (24 * 60 * 60 - bursts * load.value.activeInterval) / (24 * 60) * battery.value.voltage * load.value.sleepConsumption / 1000
        }

        // Energy gained (solar)
        var energySolar = 24 * dayFraction * panel.value.power * (panel.value.derating / 100) * (battery.value.efficiency / 100)

        var newCapacity = Math.min(Math.max(0, batteryCapacity - energyLoad - dayEnergyRegulator - nightEnergyRegulator + energySolar), battery.value.capacity * battery.value.voltage)

        batteryCapacities.push(newCapacity / maxCapacity * 100)

        batteryCapacity = newCapacity


    })

    return batteryCapacities

}