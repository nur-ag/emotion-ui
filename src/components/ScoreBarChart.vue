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
      const labels = this.scores.map(x => x.label)
      const data = this.scores.map(x => Math.round(10000 * x.score) / 100)
      const colors = this.scores.map(x => x.color)
      return {
        labels: labels,
        datasets: [{
          borderWidth: 0.5,
          borderColor: 'black',
          label: ['Score'],
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
              beginAtZero: true,
              max: 100
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
