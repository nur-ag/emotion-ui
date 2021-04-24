<template>
  <section>
    <p>
      The Emotion UI lets you type text to annotate it following two different emotional annotation models: <b>GoEmotions</b> or <b>Vent</b>. GoEmotions is an explicit model based on text annotations from human judges in an English Reddit dataset into <b>28 different emotional classes including Neutral</b>. Vent is an implicit model built from the homonymous social network. Vent users send messages tagging them with their current emotional state into <b>88 different emotional classes and 9 emotion categories</b>.
    </p>

    <hr/>

    <div class="level">
      <div class="is-pulled-left">
        <h2 class="subtitle">Uncovering the Limits of Text-based Emotion Detection Reference</h2>
      </div>

      <div class="is-pulled-right">
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.models.innerText">
          Copy BibTex
        </b-button>
      </div>
    </div>

    <div class="level">
      <pre ref="models">
@Article{limits-emotion-detection,
  Title   = {Uncovering the Limits of Text-based Emotion Detection},
  Author  = {Anonymous Author},
  Year    = {2021}
}     </pre>
    </div>

    <hr/>

    <div class="level">
      <div class="is-pulled-left">
        <h2 class="subtitle">Citing the Emotion UI</h2>
      </div>

      <div class="is-pulled-right">
        <b-button type="is-primary" size="is-small" icon-left="copy" v-clipboard="() => $refs.tool.innerText">
          Copy BibTex
        </b-button>
      </div>
    </div>

    <div class="level">
      <pre ref="tool">
@Article{emotion-ui,
  Title   = {EmotionUI: A Web Tool For Textual Emotion Recognition Research},
  Author  = {Anonymous Author},
  Year    = {2021}
}     </pre>
    </div>
  </section>
</template>
