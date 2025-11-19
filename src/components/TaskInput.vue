<template>
  <div class="task-input">
    <q-input
      v-model="taskTitle"
      placeholder="What needs to be done?"
      outlined
      dense
      @keyup.enter="handleSubmit"
      :loading="taskStore.loading"
      class="full-width"
    >
      <template v-slot:prepend>
        <q-icon name="add_task" />
      </template>
      <template v-slot:append>
        <q-btn
          v-if="taskTitle"
          flat
          dense
          round
          icon="send"
          @click="handleSubmit"
          :loading="taskStore.loading"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTaskStore } from 'stores/task'

const taskStore = useTaskStore()
const taskTitle = ref('')

async function handleSubmit() {
  if (!taskTitle.value.trim()) {
    return
  }

  const title = taskTitle.value
  taskTitle.value = ''
  
  await taskStore.createTask(title)
  // Refresh tasks to get updated list
  await taskStore.fetchTasks(taskStore.filter)
}
</script>

<style scoped>
.task-input {
  width: 100%;
}
</style>

