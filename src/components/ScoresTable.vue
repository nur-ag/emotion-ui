<template>
  <div>
    <b-table
      :data="scores"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      :pagination-rounded="isPaginationRounded"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      default-sort="score"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="emotion" label="Emotion" sortable v-slot="props">
        {{ props.row.emotion }}
      </b-table-column>

      <b-table-column field="category" label="Category" sortable v-slot="props">
        {{ props.row.category }}
      </b-table-column>

      <b-table-column field="score" label="Score" sortable v-slot="props" cellClass="has-text-right">
        {{ Math.round(10000 * props.row.score) / 100 }}
      </b-table-column>

      <b-table-column field="threshold" label="Threshold" sortable v-slot="props" cellClass="has-text-right">
        {{ Math.round(10000 * props.row.threshold) / 100 }}
      </b-table-column>

      <b-table-column field="active" label="S > T" sortable v-slot="props" cellClass="has-text-right">
        <b-icon v-if="props.row.active" icon="check">
        </b-icon>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    scores: null
  },
  data () {
    return {
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'emotion',
          label: 'Emotion'
        },
        {
          field: 'category',
          label: 'Category'
        },
        {
          field: 'score',
          label: 'Score',
          numeric: true
        },
        {
          field: 'threshold',
          label: 'Threshold',
          numeric: true
        },
        {
          field: 'active',
          label: 'S > T'
        }
      ],
      isPaginated: true,
      isPaginationSimple: false,
      isPaginationRounded: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'desc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 16
    }
  }
}
</script>
