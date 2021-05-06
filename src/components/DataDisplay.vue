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
                      {{ query.model }}
                    </small>

                    <span class="is-pulled-right">
                      <small>
                        <timeago :datetime="query.timestamp" :auto-update="60"></timeago>
                      </small>
                      <span>·</span>
                      <a v-on:click="activeQueryIndex = index + (currentPage - 1) * perPage" v-if="query.status === 'Ready'">
                        <b-tooltip multiline label="View query results">
                          <b-icon
                            icon="eye"
                            size="is-small">
                          </b-icon>
                        </b-tooltip>
                      </a>
                      <a v-on:click="resendQuery(index)" v-else>
                        <b-tooltip multiline label="Resend query">
                          <b-icon
                            icon="sync-alt"
                            size="is-small">
                          </b-icon>
                        </b-tooltip>
                      </a>
                      <span>·</span>
                      <a v-on:click="showDeletePrompt(index)">
                        <b-tooltip multiline label="Delete query results">
                          <b-icon
                            icon="trash"
                            size="is-small">
                          </b-icon>
                        </b-tooltip>
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
    }
  },
  methods: {
    downloadHistory () {
      let jsonContent = 'data:text/json;charset=utf-8,'
      const queries = this.queries.filter(x => (x.scores.length > 0) && (x.status === 'Ready'))
      const rows = queries.map(JSON.stringify)
      rows.forEach(function (row) {
        jsonContent += row + '\n'
      })
      const asURI = encodeURI(jsonContent)

      // Create the download link
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.download = 'EmotionUI-' + Date.now() + '.json'
      a.href = asURI
      a.click()
    },
    queryAsRow (query) {
      let emotionScores = ''
      if (query.scores.length > 0) {
        const allEmotions = [...query.scores].sort((x, y) => x.emotion > y.emotion)
        emotionScores = allEmotions.map(x => (x.score + '>' + x.threshold + '=' + x.active)).join('\t')
      }
      return query.query + '\t' +
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
    resendQuery (index) {
      const queryIndex = index + (this.currentPage - 1) * this.perPage
      const queryObject = this.queries[queryIndex]
      this.deleteIndex(index)
      this.submitQuery({
        query: queryObject.query,
        model: queryObject.model
      })
    },
    deleteIndex (index) {
      if (index < this.activeQueryIndex) {
        this.activeQueryIndex -= 1
      }
      this.queries.splice(index, 1)
      this.queries = [...this.queries]
    },
    submitQuery (queryObject) {
      this.currentId += 1
      this.activeTab = 0
      const newQuery = {
        id: this.currentId,
        query: queryObject.query,
        model: queryObject.model,
        status: 'Running',
        error: null,
        timestamp: Date.now(),
        scores: []
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: queryObject.query, model: queryObject.model })
      }
      fetch(this.$hostname + '/predict/', requestOptions)
        .then(async response => {
          const data = await response.json()
          if (!response.ok) {
            newQuery.status = 'Error'
          } else {
            newQuery.status = 'Ready'
          }
          newQuery.scores = data.emotions
        })
        .catch(error => {
          newQuery.status = 'Error'
          newQuery.error = error
        })
      this.queries.unshift(newQuery)
      this.queries = [...this.queries]
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
