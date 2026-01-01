<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
// DataPage.vue
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

export default {
  name: 'LineChart',
  components: { Line },
  computed : {
      chartData() { 
        return {
          labels: this.labels,
          datasets: [{
            label: 'Depth of discharge',
            data: this.data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
      }
      },
      chartOptions() { return { responsive : true, scales : { y : { min : 0, max : 100} } } /* mutable chart options */ }
  },
  props : {
    labels : {
      type: Array,
      default: []
    },
    data : {
      type: Array,
      default: []
    }
  }
}
</script>