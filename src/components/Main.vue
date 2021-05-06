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
                  <b-input :maxlength="maxLineLength" rows="5" type="textarea" v-model="query" :disabled="disableInputs" @keyup.native.ctrl.enter="checkAndSubmit"></b-input>
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
                  Model
                  <b-tooltip multilined position="is-right" label="Data source used to train the emotion detection model.">
                    <b-icon size="is-small" icon="info-circle"></b-icon>
                  </b-tooltip>
                </template>
                <b-select placeholder="Select the source data set" expanded v-model="model" :disabled="disableInputs">
                  <option value="GoEmotions">GoEmotions (27 Emotions + Neutral)</option>
                  <option value="Vent">Vent (88 Emotions)</option>
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
      model: 'Vent',
      isBulkMode: false,
      disableInputs: false,
      dropFiles: [],
      filesToProcess: 0,
      maxLineLength: 1024
    }
  },
  computed: {
    isButtonDisabled () {
      const hasQueryContent = !(this.cleanQuery.length > 0 ||
                                this.dropFiles.length > 0)
      return hasQueryContent ||
             this.model === null ||
             this.disableInputs
    },
    cleanQuery () {
      return this.normalizeInput(this.query)
    }
  },
  methods: {
    checkAndSubmit () {
      if (!this.isButtonDisabled) {
        this.submit()
      }
    },
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
      const maxLength = Math.min(this.maxLineLength, whitespaceRemoved.length)
      const withMaxLength = whitespaceRemoved.slice(0, maxLength)
      return withMaxLength
    },
    extractDropFileLines () {
      this.dropFiles.forEach(this.extractFileLines)
    },
    buildQueryObject (query) {
      const queryObject = {
        query: this.normalizeInput(query),
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
