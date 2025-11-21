<template>
  <q-item :class="{ 'task-completed': task.completed }" class="task-item" clickable>
    <q-item-section avatar>
      <q-checkbox
        :model-value="task.completed"
        @update:model-value="handleToggle"
        color="primary"
        size="md"
      />
    </q-item-section>

    <q-item-section>
      <q-input
        v-if="isEditing"
        v-model="editTitle"
        @blur="handleSave"
        @keyup.enter="handleSave"
        @keyup.esc="handleCancel"
        dense
        autofocus
        class="task-edit-input"
        outlined
        bg-color="white"
      />
      <q-item-label
        v-else
        :class="{
          'text-strikethrough': task.completed,
          'text-grey-6': task.completed,
          'cursor-pointer': !task.completed,
        }"
        class="task-label"
        @dblclick="handleLabelClick"
      >
        {{ task.title }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row q-gutter-xs task-actions">
        <q-btn
          v-if="!isEditing && !task.completed"
          flat
          dense
          round
          icon="edit"
          color="primary"
          @click="startEditing"
          size="sm"
          class="action-btn"
        >
          <q-tooltip>Edit task</q-tooltip>
        </q-btn>
        <q-btn
          v-if="!isEditing && task.completed"
          flat
          dense
          round
          icon="restore"
          color="primary"
          @click="handleRestore"
          size="sm"
          class="action-btn"
        >
          <q-tooltip>Restore to active</q-tooltip>
        </q-btn>
        <q-btn
          v-if="!isEditing"
          flat
          dense
          round
          icon="delete"
          color="negative"
          @click="showDeleteDialog = true"
          size="sm"
          class="action-btn"
        >
          <q-tooltip>Delete task</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>

  <q-dialog v-model="showDeleteDialog">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="warning" color="negative" size="md" class="q-mr-sm" />
        <span class="text-h6">Delete Task?</span>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">
          Are you sure you want to delete "<strong>{{ task.title }}</strong
          >"?
        </div>
        <div class="text-caption text-grey-6 q-mt-sm">This action cannot be undone.</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useTaskStore } from 'stores/task'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const taskStore = useTaskStore()
const isEditing = ref(false)
const editTitle = ref('')
const showDeleteDialog = ref(false)

function startEditing() {
  if (props.task.completed) {
    return
  }
  isEditing.value = true
  editTitle.value = props.task.title
}

function handleLabelClick() {
  if (!props.task.completed) {
    startEditing()
  }
}

function handleCancel() {
  isEditing.value = false
  editTitle.value = ''
}

async function handleSave() {
  if (!editTitle.value.trim()) {
    handleCancel()
    return
  }

  if (editTitle.value.trim() !== props.task.title) {
    await taskStore.updateTask(props.task.entity_id, editTitle.value.trim())
  }
  isEditing.value = false
}

async function handleToggle() {
  await taskStore.toggleTask(props.task.entity_id)
}

async function handleRestore() {
  await taskStore.toggleTask(props.task.entity_id)
}

async function confirmDelete() {
  showDeleteDialog.value = false
  await taskStore.deleteTask(props.task.entity_id)
}
</script>

<style scoped>
.task-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 14px;
  transition:
    transform 0.12s ease,
    background-color 0.12s ease;
  border-radius: 6px;
}

.task-item:hover {
  background-color: rgba(16, 24, 40, 0.03);
  transform: translateY(-2px);
}

.task-item:hover .task-actions {
  opacity: 1;
}

.task-completed {
  opacity: 0.75;
}

.task-label {
  font-size: 1rem;
  padding: 4px 0;
  word-break: break-word;
}

.task-edit-input {
  font-size: 1rem;
}

.task-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-item:hover .task-actions,
.task-item:focus-within .task-actions {
  opacity: 1;
}

.action-btn {
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.text-strikethrough {
  text-decoration: line-through;
}
</style>
