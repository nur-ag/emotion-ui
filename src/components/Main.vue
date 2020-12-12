<template>
  <div>
    <div class="container is-max-desktop">
      <NavBar>
      </NavBar>
      <div class="container">
        <div class="columns">
          <div class="column is-5">
            <div class="box">
              <h2 class="subtitle">Emotion Detection Parameters:</h2>

              <hr/>

              <div class="field">
                <div class="is-pulled-right">
                  <b-switch v-model="isBulkMode" :disabled="disableInputs">
                    Bulk Mode
                  </b-switch>
                </div>
              </div>

              <div v-if="!isBulkMode">
                <b-field label="Input Text">
                  <b-input maxlength="200" rows="5" type="textarea" v-model="query" :disabled="disableInputs"></b-input>
                </b-field>
              </div>

              <div class="pb-3" v-else>
                <b-field label="Input Files">
                  <b-upload v-model="dropFiles" multiple expanded drag-drop :disabled="disableInputs">
                    <section class="section">
                      <div class="content has-text-centered is-small">
                        <p>
                          <b>Drop your files here or click to upload.</b>
                          <br/>
                          We will detect emotion on every line, on every file.
                        </p>
                      </div>
                    </section>
                  </b-upload>
                </b-field>

                <div class="tags">
                  <span v-for="(file, index) in dropFiles"
                      :key="index"
                      class="tag is-primary" >
                      {{file.name}}
                    <button class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)">
                    </button>
                  </span>
                </div>
              </div>

              <b-field>
                <template slot="label">
                  Dataset
                  <b-tooltip multilined position="is-right" label="Data source used to train the emotion detection model.">
                    <b-icon size="is-small" icon="info-circle"></b-icon>
                  </b-tooltip>
                </template>
                <b-select placeholder="Select the source data set" expanded v-model="dataset" :disabled="disableInputs">
                  <option value="GoEmotions">GoEmotions</option>
                  <option value="Vent">Vent</option>
                </b-select>
              </b-field>

              <b-field>
                <template slot="label">
                  Representation
                  <b-tooltip multilined label="Text representation method to use as input to the learning algorithm.">
                    <b-icon size="is-small" icon="info-circle"></b-icon>
                  </b-tooltip>
                </template>
                <b-select placeholder="Select the text representation" expanded v-model="extractor" :disabled="disableInputs">
                  <option value="Bag of Words">Bag of Words</option>
                  <option value="TF-IDF">TF-IDF</option>
                  <option value="FastText">FastText</option>
                  <option value="BERT">BERT</option>
                </b-select>
              </b-field>

              <b-field>
                <template slot="label">
                  Model
                  <b-tooltip multilined position="is-right" label="Learning algorithm to recognise emotions from the text representations.">
                    <b-icon size="is-small" icon="info-circle"></b-icon>
                  </b-tooltip>
                </template>
                  <b-select placeholder="Select the classification model" expanded v-model="model" :disabled="disableInputs">
                      <option value="Naive Bayes">Naive Bayes</option>
                      <option value="Logistic Regression">Logistic Regression</option>
                      <option value="Random Forest">Random Forest</option>
                      <option value="DNN with Pooling">DNN with Pooling</option>
                      <option value="Pooled Bi-LSTM">Pooled Bi-LSTM</option>
                  </b-select>
              </b-field>

              <div class="buttons">
                <b-button type="is-primary" expanded v-on:click="submit" :disabled="isButtonDisabled">
                  Submit
                </b-button>
              </div>

              <div class="notification" v-if="disableInputs">
                <b-loading :is-full-page="false" v-model="isBulkMode"></b-loading>
                <br>
              </div>
            </div>
          </div>

          <div class="column is-8">
            <DataDisplay ref="display">
            </DataDisplay>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import DataDisplay from './DataDisplay.vue'

export default {
  name: 'Main',
  data () {
    return {
      query: '',
      dataset: null,
      extractor: null,
      model: null,
      isBulkMode: false,
      disableInputs: false,
      dropFiles: [],
      filesToProcess: 0
    }
  },
  computed: {
    isButtonDisabled () {
      const hasQueryContent = !(this.cleanQuery.length > 0 ||
                                this.dropFiles.length > 0)
      return hasQueryContent ||
             this.dataset === null ||
             this.extractor === null ||
             this.model === null ||
             this.disableInputs
    },
    cleanQuery () {
      return this.normalizeInput(this.query)
    }
  },
  methods: {
    submit () {
      if (this.isBulkMode) {
        this.disableInputs = true
        this.filesToProcess = this.dropFiles.length
        this.extractDropFileLines()
      } else {
        const queryObject = this.buildQueryObject(this.query)
        this.$refs.display.submitQuery(queryObject)
      }

      // Set the variables back to the default state
      this.query = ''
      this.dropFiles = []
    },
    normalizeInput (text) {
      const trimmedText = text.trim()
      const whitespaceRemoved = trimmedText.replace(/\s+/g, ' ')
      return whitespaceRemoved
    },
    extractDropFileLines () {
      this.dropFiles.forEach(this.extractFileLines)
    },
    buildQueryObject (query) {
      const queryObject = {
        query: this.normalizeInput(query),
        dataset: this.dataset,
        extractor: this.extractor,
        model: this.model
      }
      return queryObject
    },
    extractFileLines (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const file = event.target.result
        const allLines = file.split(/\r\n|\n/)
        const normLines = allLines.map(this.buildQueryObject)
        const validLines = normLines.filter(x => x.query.length > 0)
        validLines.forEach(this.$refs.display.submitQuery)
        this.filesToProcess -= 1

        if (this.filesToProcess === 0) {
          this.disableInputs = false
        }
      }
      reader.onerror = (event) => {
        alert(event.target.error.name)
      }
      reader.readAsText(file)
    }
  },
  components: {
    NavBar,
    DataDisplay
  }
}
</script>
