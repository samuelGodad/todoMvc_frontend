<template>
  <div class="task-list">
    <q-card flat bordered class="task-card">
      <q-card-section class="row items-center justify-between q-px-md q-pt-sm">
        <div>
          <div class="text-h6">Your Tasks</div>
          <div class="text-caption text-grey-6">
            {{ taskStore.activeTasksCount }} active • {{ taskStore.completedTasksCount }} completed
          </div>
        </div>
        <div class="text-subtitle2 text-grey-7">{{ taskStore.tasksCount }} total</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-list v-if="tasks.length > 0" separator>
          <TaskItem v-for="task in tasks" :key="task.entity_id" :task="task" />
        </q-list>

        <div v-else class="text-center q-pa-xl text-grey-6 empty-state">
          <q-icon name="task_alt" size="72px" class="q-mb-md text-primary" />
          <div class="text-h6 q-mb-sm">No tasks yet</div>
          <div class="text-body2 q-mb-md">
            <span v-if="taskStore.filter === 'active'">No active tasks</span>
            <span v-else-if="taskStore.filter === 'completed'">No completed tasks</span>
            <span v-else>Start by adding a task above</span>
          </div>
          <q-btn
            color="primary"
            label="Add your first task"
            unelevated
            @click="$emit('focus-input')"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from 'stores/task'
import TaskItem from './TaskItem.vue'

const taskStore = useTaskStore()

const tasks = computed(() => taskStore.filteredAndSortedTasks)
</script>

<style scoped>
.task-list {
  width: 100%;
}

.task-card {
  border-radius: 10px;
  overflow: hidden;
}

.empty-state {
  min-height: 160px;
}

.empty-state q-icon {
  opacity: 0.95;
}
</style>
