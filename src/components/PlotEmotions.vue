<template>
  <div>
    <b-field label="Chart Selection">
      <b-select placeholder="Visualization method" v-model="activePlot" expanded>
        <option value="BarPlot">Probability Bar Chart</option>
        <option value="RadarPlot">Category Radar Chart</option>
      </b-select>
    </b-field>

    <b-field grouped>
      <b-field label="Sort By" expanded>
        <b-select v-model="sortingMode" expanded>
          <option value="score">Score</option>
          <option value="emotion">Name</option>
          <option value="category">Category</option>
        </b-select>
      </b-field>

      <b-field label="Variable" expanded>
        <b-select v-model="targetColumn" expanded>
          <option value="emotion">Emotion</option>
          <option value="category">Category</option>
        </b-select>
      </b-field>

      <b-field label="Order" expanded>
        <b-select v-model="order" expanded>
          <option value="ascending">
            ▲ Ascending
          </option>
          <option value="descending">
            ▼ Descending
          </option>
        </b-select>
      </b-field>
    </b-field>

    <ScoreBarChart
      v-if="activePlot=='BarPlot'"
      :key="drawState"
      :height="600"
      :scores="sortedScores"
      :sortingColumn="sortingMode"
      :reverse="order == 'descending'"/>
    <EmotionRadar
      v-if="activePlot=='RadarPlot'"
      :key="drawState"
      :scores="sortedScores"
      :sortingColumn="sortingMode"
      :reverse="order == 'descending'"/>
  </div>
</template>

<script>
import ScoreBarChart from './ScoreBarChart.vue'
import EmotionRadar from './EmotionRadar.vue'

export default {
  name: 'PlotEmotions',
  props: {
    scores: null
  },
  data () {
    return {
      activePlot: null,
      sortingMode: 'score',
      targetColumn: 'emotion',
      order: 'ascending'
    }
  },
  computed: {
    drawState () {
      return this.activePlot + this.sortingMode + this.order + this.targetColumn
    },
    groupedScores () {
      const target = this.targetColumn
      const groupedByVariable = this.scores.reduce(function (acc, row) {
        const propValue = row[target]
        if (propValue in acc === false) {
          acc[propValue] = []
        }
        acc[propValue].push(row)
        return acc
      }, {})

      return Object.entries(groupedByVariable).map(function (pair) {
        return {
          score: Math.max(...pair[1].map(x => x.score)),
          label: pair[0],
          emotion: pair[0],
          category: pair[1][0].category,
          color: pair[1][0].color
        }
      })
    },
    sortedScores () {
      const groupedScores = this.groupedScores
      var scoresToRevert = groupedScores
      if (this.sortingMode === 'score') {
        scoresToRevert = [...groupedScores].sort((x, y) => x.score < y.score)
      } else if (this.sortingMode === 'emotion') {
        scoresToRevert = [...groupedScores].sort((x, y) => x.emotion > y.emotion)
      } else if (this.sortingMode === 'category') {
        scoresToRevert = [...groupedScores].sort((x, y) => x.category > y.category || (x.category === y.category && x.score < y.score))
      }

      if (this.order === 'ascending') {
        return scoresToRevert
      } else {
        return scoresToRevert.reverse()
      }
    }
  },
  components: {
    ScoreBarChart,
    EmotionRadar
  }
}
</script>
