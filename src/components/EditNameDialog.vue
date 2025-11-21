<template>
  <q-dialog v-model="showDialog" @hide="resetForm">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Edit Name</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="firstName"
            label="First Name"
            outlined
            :rules="[(val) => !!val || 'First name is required']"
            autofocus
          />

          <q-input
            v-model="lastName"
            label="Last Name"
            outlined
            :rules="[(val) => !!val || 'Last name is required']"
          />

          <div class="row q-gutter-sm justify-end">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              @click="showDialog = false"
              :disable="loading"
            />
            <q-btn label="Save" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from 'stores/auth'
// import { Notify } from 'quasar'

const authStore = useAuthStore()
const showDialog = defineModel('modelValue', { type: Boolean, default: false })

const firstName = ref('')
const lastName = ref('')
const loading = ref(false)

// Initialize form with current user data
watch(showDialog, (newVal) => {
  if (newVal && authStore.user) {
    firstName.value = authStore.user.first_name || ''
    lastName.value = authStore.user.last_name || ''
  }
})

function resetForm() {
  firstName.value = ''
  lastName.value = ''
}

async function onSubmit() {
  if (!firstName.value || !lastName.value) {
    return
  }

  loading.value = true
  try {
    const success = await authStore.updateName({
      first_name: firstName.value,
      last_name: lastName.value,
    })

    if (success) {
      showDialog.value = false
    }
  } finally {
    loading.value = false
  }
}
</script>
