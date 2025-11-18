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

      <!-- Tasks Section (Placeholder for now) -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Your Tasks</div>
            <div class="text-center q-pa-xl text-grey-6">
              <q-icon name="task_alt" size="64px" class="q-mb-md" />
              <div class="text-h6">No tasks yet</div>
              <div class="text-body2">Tasks will appear here once you start adding them</div>
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
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import EditNameDialog from 'components/EditNameDialog.vue'

const authStore = useAuthStore()
const showEditNameDialog = ref(false)
</script>
