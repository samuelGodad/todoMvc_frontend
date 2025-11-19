<template>
  <div class="task-list">
    <q-list v-if="tasks.length > 0" separator>
      <TaskItem
        v-for="task in tasks"
        :key="task.entity_id"
        :task="task"
      />
    </q-list>

    <div v-else class="text-center q-pa-xl text-grey-6">
      <q-icon name="task_alt" size="64px" class="q-mb-md" />
      <div class="text-h6">No tasks</div>
      <div class="text-body2">
        <span v-if="taskStore.filter === 'active'">No active tasks</span>
        <span v-else-if="taskStore.filter === 'completed'">No completed tasks</span>
        <span v-else>Start by adding a task above</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from 'stores/task'
import TaskItem from './TaskItem.vue'

const taskStore = useTaskStore()

const tasks = computed(() => {
  return taskStore.filteredTasks
})
</script>

<style scoped>
.task-list {
  min-height: 200px;
}
</style>

