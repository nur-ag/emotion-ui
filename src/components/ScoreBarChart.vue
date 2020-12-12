<script>
import { HorizontalBar } from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  name: 'ScoreBarChart',
  props: {
    scores: null,
    sortingColumn: null,
    reverse: true
  },
  computed: {
    chartData: function () {
      const labels = this.scores.map(x => x.emotion)
      const data = this.scores.map(x => 100 * x.score)
      const colors = this.scores.map(x => x.color)
      return {
        labels: labels,
        datasets: [{
          borderWidth: 1,
          borderColor: 'black',
          label: ['GoEmotion Probabilities'],
          backgroundColor: colors,
          data: data
        }]
      }
    }
  },
  data () {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false
            }
          }]
        },
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
