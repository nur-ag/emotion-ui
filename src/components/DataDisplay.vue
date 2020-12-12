<template>
  <div class="box">
    <b-tabs v-model="activeTab" size="is-medium" class="block" :animated=false expanded>
      <b-tab-item label="Summary">
        <SummaryReport :query="activeQuery"/>
        <hr>
        <div>
          <div class="level">
            <div class="is-pulled-left">
              <h2 class="subtitle">
                History:
              </h2>
            </div>

            <div class="is-pulled-right">
              <b-button type="is-primary" size="is-small" icon-left="download" v-on:click="downloadHistory" :disabled="queries.length == 0">
                Download
              </b-button>
            </div>
          </div>

          <div class="is-hidden-desktop pb-4">
            <br>
          </div>

          <div>
            <p v-if="queries.length == 0">
              You need to submit a text snippet or a text file to have a history!
            </p>

            <article class="media" v-for="(query, index) in queries.slice(pageIndex, pageIndex + perPage) " v-bind:key="query.id">
              <div class="media-content">
                <div class="content">
                  <div>
                    <b-tooltip :label="query.status">
                      <b-icon
                          :icon="statusIcon(query.status)"
                          :type="statusType(query.status)"
                          size="is-small">
                        </b-icon>
                    </b-tooltip>
                     ·
                    <strong>
                      {{ query.query }}
                    </strong>
                  </div>

                  <div>
                    <small class="is-pulled-left">
                      {{ query.dataset }} / {{ query.extractor }} / {{ query.model }}
                    </small>

                    <span class="is-pulled-right">
                      <small>
                        <timeago :datetime="query.timestamp" :auto-update="60"></timeago>
                      </small>
                      <span>·</span>
                      <a v-on:click="activeQueryIndex = index + (currentPage - 1) * perPage">
                        <b-icon
                          icon="sync-alt"
                          size="is-small">
                        </b-icon>
                      </a>
                      <span>·</span>
                      <a v-on:click="showDeletePrompt(index)">
                        <b-icon
                          icon="trash"
                          size="is-small">
                        </b-icon>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </article>
            <hr/>

            <b-pagination
              :total="totalQueries"
              v-model="currentPage"
              range-before="2"
              range-after="2"
              :per-page="perPage"
              icon-prev="chevron-left"
              icon-next="chevron-right"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page">
            </b-pagination>
          </div>
        </div>
      </b-tab-item>

      <b-tab-item label="Emotions" :disabled="!activeEmotions">
        <ScoresTable v-if="activeEmotions" :scores="activeQuery.scores"/>
      </b-tab-item>

      <b-tab-item label="Plots" :disabled="!activeEmotions">
        <PlotEmotions v-if="activeEmotions" :scores="activeQuery.scores"/>
      </b-tab-item>

      <b-tab-item label="Information">
        <Information/>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import PlotEmotions from './PlotEmotions.vue'
import ScoresTable from './ScoresTable.vue'

import Information from './Information.vue'
import SummaryReport from './SummaryReport.vue'

export default {
  name: 'DataDisplay',
  data () {
    return {
      activeTab: 0,
      perPage: 6,
      currentPage: 1,
      currentId: 0,
      queries: [],
      activeQueryIndex: 0
    }
  },
  computed: {
    activeQuery () {
      if (this.queries.length === 0) {
        return null
      } else {
        return this.queries[this.activeQueryIndex]
      }
    },
    totalQueries () {
      return this.queries.length
    },
    pageIndex () {
      return (this.currentPage - 1) * this.perPage
    },
    activeEmotions () {
      const query = this.activeQuery
      if (query === null) return false
      if (query.scores === null) return false
      if (query.scores.length === 0) return false
      return true
    },
    headerRow () {
      const allColumns = ['Query', 'Dataset', 'Extractor', 'Model']
      if (this.activeEmotions) {
        const validQueries = this.queries.filter(x => x.status !== 'Error')
        if (validQueries.length !== 0) {
          const allEmotions = validQueries[0].scores.map(x => x.emotion).sort()
          allEmotions.forEach(x => allColumns.push(x))
        }
      }
      return allColumns.join('\t') + '\n'
    }
  },
  methods: {
    downloadHistory () {
      let tsvContent = 'data:text/tsv;charset=utf-8,'
      tsvContent += this.headerRow
      const queries = this.queries.filter(x => x.scores.length > 0)
      const rows = queries.map(this.queryAsRow)
      rows.forEach(function (row) {
        tsvContent += row
      })
      const asURI = encodeURI(tsvContent)

      // Create the download link
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.download = 'EmotionUI-' + Date.now() + '.tsv'
      a.href = asURI
      a.click()
    },
    queryAsRow (query) {
      let emotionScores = ''
      if (query.scores.length > 0) {
        const allEmotions = [...query.scores].sort((x, y) => x.emotion > y.emotion)
        emotionScores = allEmotions.map(x => x.score).join('\t')
      }
      return query.query + '\t' +
             query.dataset + '\t' +
             query.extractor + '\t' +
             query.model + '\t' +
             emotionScores + '\n'
    },
    statusIcon (status) {
      if (status === 'Running') {
        return 'hourglass'
      } else if (status === 'Error') {
        return 'exclamation-triangle'
      } else if (status === 'Ready') {
        return 'check'
      } else {
        return 'question'
      }
    },
    statusType (status) {
      if (status === 'Running') {
        return 'is-dark'
      } else if (status === 'Error') {
        return 'is-danger'
      } else if (status === 'Ready') {
        return 'is-success'
      } else {
        return 'is-warning'
      }
    },
    showDeletePrompt (index) {
      const query = this.queries[index].query
      const message = '<h2 class="subtitle">Are you sure that you want to delete input:</h2><div class="notification"> <div class="content"><b>' + query + '</b></div></div></div><p>This action <strong>cannot</strong> be undone.<p/>'
      this.$buefy.dialog.confirm({
        message: message,
        onConfirm: () => this.deleteIndex(index)
      })
    },
    deleteIndex (index) {
      if (index < this.activeQueryIndex) {
        this.activeQueryIndex -= 1
      }
      this.queries.splice(index, 1)
      this.queries = [...this.queries]
    },
    computeEmotions (queryData) {
      function computeStatusCallback () {
        if (Math.random() < 0.3) {
          queryData.status = 'Error'
          queryData.error = 'Something went wrong with P(Error) < 0.3 while generating the fake data for this demo!'
          return
        }

        queryData.status = 'Ready'
        queryData.scores = [
          {id: 0, emotion: 'Admiration', score: 0.7553462683984468, category: 'Positive', color: 'lightgreen'},
          {id: 1, emotion: 'Amusement', score: 0.025764770838766604, category: 'Positive', color: 'lightgreen'},
          {id: 2, emotion: 'Anger', score: 0.5838975002500222, category: 'Negative', color: 'plum'},
          {id: 3, emotion: 'Annoyance', score: 0.7694561771264429, category: 'Negative', color: 'plum'},
          {id: 4, emotion: 'Approval', score: 0.2466482053715996, category: 'Positive', color: 'lightgreen'},
          {id: 5, emotion: 'Caring', score: 0.387508712556617, category: 'Positive', color: 'lightgreen'},
          {id: 6, emotion: 'Confusion', score: 0.34908573345745364, category: 'Ambiguous', color: 'grey'},
          {id: 7, emotion: 'Curiosity', score: 0.7062971470799727, category: 'Ambiguous', color: 'grey'},
          {id: 8, emotion: 'Desire', score: 0.5396400474525894, category: 'Positive', color: 'lightgreen'},
          {id: 9, emotion: 'Disappointment', score: 0.006589419061046375, category: 'Negative', color: 'plum'},
          {id: 10, emotion: 'Disapproval', score: 0.6247346061502691, category: 'Negative', color: 'plum'},
          {id: 11, emotion: 'Disgust', score: 0.07220075701424788, category: 'Negative', color: 'plum'},
          {id: 12, emotion: 'Embarrassment', score: 0.9050344508137135, category: 'Negative', color: 'plum'},
          {id: 13, emotion: 'Excitement', score: 0.4867998709862663, category: 'Positive', color: 'lightgreen'},
          {id: 14, emotion: 'Fear', score: 0.40533474470415554, category: 'Negative', color: 'plum'},
          {id: 15, emotion: 'Gratitude', score: 0.20723987729942794, category: 'Positive', color: 'lightgreen'},
          {id: 16, emotion: 'Grief', score: 0.5568011503218786, category: 'Negative', color: 'plum'},
          {id: 17, emotion: 'Joy', score: 0.6228143057234771, category: 'Positive', color: 'lightgreen'},
          {id: 18, emotion: 'Love', score: 0.7020810252440777, category: 'Positive', color: 'lightgreen'},
          {id: 19, emotion: 'Nervousness', score: 0.3890938098727208, category: 'Negative', color: 'plum'},
          {id: 20, emotion: 'Optimism', score: 0.4885487647853345, category: 'Positive', color: 'lightgreen'},
          {id: 21, emotion: 'Pride', score: 0.9035032322842532, category: 'Positive', color: 'lightgreen'},
          {id: 22, emotion: 'Realization', score: 0.417520815517466, category: 'Ambiguous', color: 'grey'},
          {id: 23, emotion: 'Relief', score: 0.532291215525602, category: 'Positive', color: 'lightgreen'},
          {id: 24, emotion: 'Remorse', score: 0.2894742349691708, category: 'Negative', color: 'plum'},
          {id: 25, emotion: 'Sadness', score: 0.7184037034641574, category: 'Negative', color: 'plum'},
          {id: 26, emotion: 'Surprise', score: 0.54923785689583, category: 'Ambiguous', color: 'grey'},
          {id: 27, emotion: 'Neutral', score: 0.08899088672030997, category: 'Ambiguous', color: 'grey'}
        ]
      }

      const timeout = Math.round(Math.random() * 1000)
      setTimeout(computeStatusCallback, 200 + timeout)
    },
    submitQuery (queryObject) {
      this.currentId += 1
      const newQuery = {
        id: this.currentId,
        query: queryObject.query,
        dataset: queryObject.dataset,
        extractor: queryObject.extractor,
        model: queryObject.model,
        status: 'Running',
        error: null,
        timestamp: Date.now(),
        scores: []
      }
      this.computeEmotions(newQuery)
      this.queries.unshift(newQuery)
    }
  },
  components: {
    PlotEmotions,
    ScoresTable,
    Information,
    SummaryReport
  }
}
</script>
