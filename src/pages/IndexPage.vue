<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Welcome Section -->
      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="text-h4 q-mb-sm">Welcome, {{ authStore.user?.first_name || 'User' }}! 👋</div>
          <div class="text-body1 text-grey-7">Manage your tasks and stay organized</div>
        </q-card>
      </div>

      <!-- Tasks Section -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Your Tasks</div>

            <TaskInput ref="taskInputRef" class="q-mb-md" />

            <TaskFilters class="q-mb-md" />

            <TaskList @focus-input="focusTaskInput" />

            <div
              v-if="taskStore.tasksCount > 0"
              class="q-mt-md text-center text-caption text-grey-6"
            >
              {{ taskStore.activeTasksCount }} active task{{
                taskStore.activeTasksCount !== 1 ? 's' : ''
              }}
              <span v-if="taskStore.completedTasksCount > 0">
                • {{ taskStore.completedTasksCount }} completed
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useTaskStore } from 'stores/task'
import TaskInput from 'components/TaskInput.vue'
import TaskList from 'components/TaskList.vue'
import TaskFilters from 'components/TaskFilters.vue'

const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const taskInputRef = ref(null)

function focusTaskInput() {
  if (taskInputRef.value && typeof taskInputRef.value.focusInput === 'function') {
    taskInputRef.value.focusInput()
  }
}

function loadTasksFromQuery() {
  const filter = route.query.filter || 'all'
  taskStore.fetchTasks(filter)
}

onMounted(() => {
  loadTasksFromQuery()
})

watch(
  () => route.query.filter,
  () => {
    loadTasksFromQuery()
  },
)
</script>
