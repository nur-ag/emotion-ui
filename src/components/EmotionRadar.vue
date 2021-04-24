<script>
import { Radar } from 'vue-chartjs'

export default {
  extends: Radar,
  name: 'EmotionRadar',
  props: {
    scores: null,
    sortingColumn: null,
    reverse: true
  },
  computed: {
    chartData: function () {
      const labels = this.scores.map(x => x.label)
      const data = this.scores.map(x => Math.round(10000 * x.score) / 100)
      const colors = this.scores.map(x => x.color)
      return {
        labels: labels,
        datasets: [{
          borderWidth: 1,
          borderColor: 'black',
          label: 'Score',
          pointBackgroundColor: colors,
          data: data
        }]
      }
    }
  },
  data () {
    return {
      options: {
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
