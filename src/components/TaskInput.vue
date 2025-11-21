<template>
  <div class="task-input">
    <q-input
      ref="inputRef"
      v-model="taskTitle"
      placeholder="Add a new task — press Enter to save"
      outlined
      rounded
      dense="false"
      @keyup.enter="handleSubmit"
      :loading="taskStore.loading"
      class="full-width input-pill"
    >
      <template v-slot:prepend>
        <q-icon name="task_alt" class="text-primary" />
      </template>
      <template v-slot:append>
        <q-btn
          v-if="taskTitle"
          flat
          rounded
          color="primary"
          class="add-btn"
          icon="send"
          @click="handleSubmit"
          :loading="taskStore.loading"
        />
        <q-btn
          v-else
          flat
          rounded
          color="primary"
          class="add-btn"
          label="Add"
          @click="focusInput"
          :loading="taskStore.loading"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { useTaskStore } from 'stores/task'

const taskStore = useTaskStore()
const taskTitle = ref('')
const inputRef = ref(null)

function focusInput() {
  try {
    if (inputRef.value && typeof inputRef.value.focus === 'function') {
      inputRef.value.focus()
    } else if (inputRef.value && inputRef.value.$el) {
      // fallback
      const el = inputRef.value.$el.querySelector('input')
      el && el.focus()
    }
  } catch {
    // ignore
  }
}

defineExpose({ focusInput })

async function handleSubmit() {
  if (!taskTitle.value.trim()) {
    return
  }

  const title = taskTitle.value.trim()
  taskTitle.value = ''

  await taskStore.createTask(title)
}
</script>

<style scoped>
.task-input {
  width: 100%;
}

.input-pill .q-field__control {
  padding: 10px 14px;
  font-size: 1rem;
}

.input-pill .q-field {
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.04);
  border-radius: 999px;
}

.add-btn {
  min-width: 56px;
}
</style>
