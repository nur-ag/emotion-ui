<template>
  <div class="container">
    <div v-if="query === null">
      <h2 class="subtitle">
        You have not sent any text yet!
      </h2>

      <p>
        Use the "Emotion Detection Parameters" pannel to <strong>submit a text snippet or file and detect emotions in it</strong>.
      </p>

      <br/>

      <p>
        You can select the source emotion data set (<strong>GoEmotions</strong> or <strong>Vent</strong>), the text representation (<strong>Bag of Words</strong>, <strong>TF-IDF</strong>, <strong>FastText</strong> embeddings or <strong>BERT</strong>, and the classifier (<strong>Naive Bayes</strong>, <strong>Logistic Regression</strong>, <strong>Incremental Random Forest</strong>, <strong>DNN with Pooling</strong> or <strong>Bi-LSTM</strong>.)
      </p>

      <br/>

      <p>
        The "<strong>Emotions</strong>" and "<strong>Plots</strong>" tabs will enable once you submit your first input text for annotation.
      </p>

      <br/>

      <p>
        To read more about the details for every parameter, click on the "<strong>Information</strong>" tab. If you want to cite our work or  read about the academic research project and paper describing the finer modelling aspects, please refer to the <strong>BibTex citations</strong> in the "<strong>Information</strong>" tab.
      </p>
    </div>

    <div v-else>
      <div>
        <b-notification v-if="query.error != null" class="is-danger">
          <h2 class="subtitle">Oops! Something went wrong!</h2>
          <p>
            {{ query.error }}
          </p>
          <p class="is-size-7">
            Please make sure you are connected to the internet. If using a VPN, try disabling it.
          </p>
        </b-notification>

        <h2 class="subtitle">
          Input Text:
        </h2>

        <div class="notification">
          <div class="content">
          {{ query.query }}
          </div>
        </div>

        <section v-if="sortedScores != null">
          <hr/>

          <div class="level">
            <div class="is-pulled-left">
              <h2 class="subtitle" v-if="showOnlyActive">
                Top {{ maxToPredict }} Detected Emotions:
              </h2>

              <h2 class="subtitle" v-else>
                Top {{ maxToPredict }} Emotions by Probability:
              </h2>
            </div>

            <div class="is-pulled-right">
              <b-select v-model="maxToPredict">
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </b-select>
            </div>
          </div>

          <div class="content">
            <ol v-if="sortedScores.length > 0">
              <li v-for="item in sortedScores.slice(0, this.maxToPredict)" :key="item.id">
                <b>{{ item.emotion }}</b> ({{ item.category }}): {{ Math.round(10000 * item.score) / 100 }}%
                <b-tag v-if="item.active && !showOnlyActive" type="is-info">
                  <b-tooltip multilined :label="'This emotion triggered because the score is over the threshold (' + (Math.round(10000 * item.threshold) / 100) + ').'">
                    Triggered
                  </b-tooltip>
                </b-tag>
              </li>
            </ol>
            <ul v-else>
              <li>
                We could not detect any emotions over the activation thresholds!
              </li>
            </ul>
          </div>

          <div class="column">
            <div class="is-pulled-right">
              <b-switch size="is-small" v-model="showOnlyActive">
                Triggered Emotions Only
              </b-switch>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: null
  },
  data () {
    return {
      maxToPredict: 10,
      showOnlyActive: true
    }
  },
  computed: {
    sortedScores () {
      if (this.query == null) {
        return null
      } else if (this.query.status === 'Error') {
        return []
      } else {
        const queryScores = this.query.scores.slice()
        return queryScores.filter(x => x.active || (!this.showOnlyActive)).sort((x, y) => x.score < y.score)
      }
    }
  }
}
</script>
