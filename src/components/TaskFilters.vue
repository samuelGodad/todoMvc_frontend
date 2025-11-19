<template>
  <div class="task-filters q-pa-md">
    <div class="row q-gutter-sm justify-center">
      <q-btn
        :color="filter === 'all' ? 'primary' : 'grey-7'"
        :outline="filter !== 'all'"
        label="All"
        @click="setFilter('all')"
        :disable="loading"
      />
      <q-btn
        :color="filter === 'active' ? 'primary' : 'grey-7'"
        :outline="filter !== 'active'"
        label="Active"
        @click="setFilter('active')"
        :disable="loading"
      />
      <q-btn
        :color="filter === 'completed' ? 'primary' : 'grey-7'"
        :outline="filter !== 'completed'"
        label="Completed"
        @click="setFilter('completed')"
        :disable="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from 'stores/task'

const taskStore = useTaskStore()

const filter = computed(() => taskStore.filter)
const loading = computed(() => taskStore.loading)

function setFilter(filterType) {
  taskStore.setFilter(filterType)
}
</script>

<style scoped>
.task-filters {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>

