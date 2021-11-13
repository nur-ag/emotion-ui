<template>
  <section>
    <p>
      The Emotion UI lets you type text to annotate it following two different emotional annotation models: <b>GoEmotions</b> or <b>Vent</b>. GoEmotions is an explicit model based on text annotations from human judges in an English Reddit dataset into <b>28 different emotional classes including Neutral</b>. Vent is an implicit model built from the homonymous social network. Vent users send messages tagging them with their current emotional state into <b>88 different emotional classes and 9 emotion categories</b>.
    </p>

    <hr/>

    <div class="level">
      <div class="is-pulled-left">
        <h2 class="subtitle"><a href="https://aclanthology.org/2021.findings-emnlp.219/">Uncovering the Limits of Text-based Emotion Detection</a></h2>
      </div>
    </div>

    <div class="container">
      <div class="buttons has-addons is-right">
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.models.innerText">
          Copy BibTex
        </b-button>
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.modelsApa.innerText">
          Copy APA-Style
        </b-button>
      </div>
    </div>

    <h4>BibTex:</h4>

    <div class="level">
      <pre ref="models">
@inproceedings{alvarez-gonzalez-etal-2021-uncovering-limits,
    title = "Uncovering the Limits of Text-based Emotion Detection",
    author = "Alvarez-Gonzalez, Nurudin  and
      Kaltenbrunner, Andreas  and
      G{\'o}mez, Vicen{\c{c}}",
    booktitle = "Findings of the Association for Computational Linguistics: EMNLP 2021",
    month = nov,
    year = "2021",
    address = "Punta Cana, Dominican Republic",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2021.findings-emnlp.219",
    pages = "2560--2583",
    abstract = "Identifying emotions from text is crucial for a variety of real world tasks. We consider the two largest now-available corpora for emotion classification: GoEmotions, with 58k messages labelled by readers, and Vent, with 33M writer-labelled messages. We design a benchmark and evaluate several feature spaces and learning algorithms, including two simple yet novel models on top of BERT that outperform previous strong baselines on GoEmotions. Through an experiment with human participants, we also analyze the differences between how writers express emotions and how readers perceive them. Our results suggest that emotions expressed by writers are harder to identify than emotions that readers perceive. We share a public web interface for researchers to explore our models.",
}     </pre>
    </div>

    <h4>APA:</h4>

    <div class="level">
      <pre ref="modelsApa">
Alvarez-Gonzalez, N., Kaltenbrunner, A., & Gómez, V. (2021, November). Uncovering the Limits of Text-based Emotion Detection. Findings of the Association for Computational Linguistics: EMNLP 2021, 2560–2583. Opgehaal van https://aclanthology.org/2021.findings-emnlp.219
      </pre>
    </div>

    <hr/>

    <div class="level">
      <div class="is-pulled-left">
        <h2 class="subtitle">Emotion UI</h2>
      </div>
    </div>

    <div class="container">
      <div class="buttons has-addons is-right">
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.tool.innerText">
          Copy BibTex
        </b-button>
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.toolApa.innerText">
          Copy APA-Style
        </b-button>
      </div>
    </div>

    <h4>BibTex:</h4>

    <div class="level">
      <pre ref="tool">
@online{emotionui,
   title={Emotion{UI}: {A} {W}eb {I}nterface to {E}xplore {E}motion {D}etection {M}odels.},
   url={http://emotionui.nur.systems/},
   note = {{P}ublic {R}elease at \url{http://emotionui.nur.systems/}.},
   year={2021},
   author={Alvarez-Gonzalez, Nurudin and Kaltenbrunner, Andreas and Gómez, Vicenç}
}     </pre>
    </div>

    <h4>APA:</h4>

    <div class="level">
      <pre ref="toolApa">
Alvarez-Gonzalez, N., Kaltenbrunner, A., & Gómez, V. (2021). EmotionUI: A Web Interface to Explore Emotion Detection Models. Public Release at http://emotionui.nur.systems/. 
      </pre>
    </div>
  </section>
</template>
