<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Welcome Section -->
      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="row items-center q-gutter-md">
            <div class="col">
              <div class="text-h4 q-mb-sm">
                Welcome, {{ authStore.user?.first_name || 'User' }}! 👋
              </div>
              <div class="text-body1 text-grey-7">
                Manage your tasks and stay organized
              </div>
            </div>
            <div>
              <q-btn
                color="primary"
                icon="edit"
                label="Edit Name"
                @click="showEditNameDialog = true"
                outline
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Tasks Section -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Your Tasks</div>
            
            <!-- Task Input -->
            <TaskInput class="q-mb-md" />

            <!-- Task List -->
            <TaskList />

            <!-- Task Filters -->
            <TaskFilters />

            <!-- Task Stats -->
            <div v-if="taskStore.tasksCount > 0" class="q-mt-md text-center text-caption text-grey-6">
              {{ taskStore.activeTasksCount }} active task{{ taskStore.activeTasksCount !== 1 ? 's' : '' }}
              <span v-if="taskStore.completedTasksCount > 0">
                • {{ taskStore.completedTasksCount }} completed
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Edit Name Dialog -->
    <EditNameDialog v-model="showEditNameDialog" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useTaskStore } from 'stores/task'
import EditNameDialog from 'components/EditNameDialog.vue'
import TaskInput from 'components/TaskInput.vue'
import TaskList from 'components/TaskList.vue'
import TaskFilters from 'components/TaskFilters.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const showEditNameDialog = ref(false)

onMounted(() => {
  // Load tasks when component mounts
  taskStore.fetchTasks('all')
})
</script>
