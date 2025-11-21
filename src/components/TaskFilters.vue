<template>
  <div class="task-filters q-pa-sm">
    <div class="row items-center justify-between q-gutter-sm">
      <div class="row items-center q-gutter-sm">
        <template v-if="!isMobile">
          <q-btn
            :color="filter === 'all' ? 'primary' : 'grey-7'"
            :outline="filter !== 'all'"
            :label="`All (${taskStore.tasksCount})`"
            @click="setFilter('all')"
            :disable="loading"
            size="md"
            unelevated
            class="filter-btn"
            icon="list"
          />

          <q-btn
            :color="filter === 'active' ? 'primary' : 'grey-7'"
            :outline="filter !== 'active'"
            :label="`Active (${taskStore.activeTasksCount})`"
            @click="setFilter('active')"
            :disable="loading"
            size="md"
            unelevated
            class="filter-btn"
            icon="radio_button_unchecked"
          />

          <q-btn
            :color="filter === 'completed' ? 'primary' : 'grey-7'"
            :outline="filter !== 'completed'"
            :label="`Completed (${taskStore.completedTasksCount})`"
            @click="setFilter('completed')"
            :disable="loading"
            size="md"
            unelevated
            class="filter-btn"
            icon="check_circle"
          />
        </template>

        <template v-else>
          <div class="mobile-filter-btns row items-center q-gutter-xs">
            <q-btn
              dense
              round
              class="mobile-filter-btn"
              :color="filter === 'all' ? 'primary' : 'grey-7'"
              @click="setFilter('all')"
              aria-label="All"
              icon="list"
            />

            <q-btn
              dense
              round
              class="mobile-filter-btn"
              :color="filter === 'active' ? 'primary' : 'grey-7'"
              @click="setFilter('active')"
              aria-label="Active"
              icon="radio_button_unchecked"
            />

            <q-btn
              dense
              round
              class="mobile-filter-btn"
              :color="filter === 'completed' ? 'primary' : 'grey-7'"
              @click="setFilter('completed')"
              aria-label="Completed"
              icon="check_circle"
            />
          </div>
        </template>
      </div>

      <div>
        <q-btn-dropdown
          dense
          flat
          round
          class="sort-btn"
          icon="sort"
          :title="`Sort: ${sortLabel}`"
          auto-close
        >
          <q-list>
            <q-item clickable v-for="opt in sortOptions" :key="opt.key" @click="applySort(opt.key)">
              <q-item-section>{{ opt.label }}</q-item-section>
              <q-item-section side v-if="sort === opt.key">
                <q-icon name="check" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from 'stores/task'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isMobile = computed(() => {
  try {
    if ($q && $q.screen && typeof $q.screen.lt !== 'undefined') {
      return $q.screen.lt.md
    }
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(max-width: 767px)').matches
  }

  return false
})

const taskStore = useTaskStore()

const filter = computed(() => taskStore.filter)
const loading = computed(() => taskStore.loading)
const sort = computed(() => taskStore.sort)


const sortOptions = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'title_asc', label: 'Title A → Z' },
  { key: 'title_desc', label: 'Title Z → A' },
  { key: 'active_first', label: 'Active first' },
  { key: 'completed_first', label: 'Completed first' },
]

const sortLabel = computed(() => {
  const opt = sortOptions.find(o => o.key === sort.value)
  return opt ? opt.label : 'Sort'
})

function setFilter(filterType) {
  taskStore.setFilter(filterType)
}

function applySort(key) {
  taskStore.setSort(key)
}


</script>

<style scoped>
.task-filters {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.filter-btn {
  min-width: 140px;
  border-radius: 999px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.03);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16,24,40,0.06);
}

.mobile-filter-btn {
  min-width: 36px;
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-filter-btn q-icon,
.mobile-filter-btn .q-icon {
  font-size: 20px;
}
</style>

