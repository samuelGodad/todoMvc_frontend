<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        v-if="authStore.isAuthenticated"
      />

      <q-toolbar-title> TodoMVC </q-toolbar-title>

      <div class="q-mr-md text-caption text-grey-5">v{{ version }}</div>

      <div v-if="authStore.isAuthenticated" class="cursor-pointer">
        Logged in as
        <b>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</b>
        <q-icon size="xs" name="arrow_drop_down" />
        <q-menu fir anchor="bottom right" self="top right">
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="showEditNameDialog = true">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section>Edit Name</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="authStore.logout()">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-if="authStore.isAuthenticated"
    v-model="leftDrawerOpen"
    show-if-above
    :width="280"
    class="bg-grey-1"
    :bordered="false"
  >
    <div class="user-info-section bg-primary text-white">
      <div class="text-h6 q-mb-xs">
        {{ authStore.user?.first_name || 'User' }} {{ authStore.user?.last_name || '' }}
      </div>
      <div class="text-caption text-grey-3">
        {{ authStore.user?.email || '' }}
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="navigation-menu">
      <q-list padding class="q-pt-sm">
        <EssentialLink v-for="link in mainLinks" :key="link.title" v-bind="link" />
      </q-list>
    </div>
  </q-drawer>

  <!-- Edit Name Dialog -->
  <EditNameDialog v-model="showEditNameDialog" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useTaskStore } from 'stores/task'
import versionData from '@/version.json'
import EssentialLink from 'components/EssentialLink.vue'
import EditNameDialog from 'components/EditNameDialog.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const mainLinks = computed(() => [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
    caption: `${taskStore.tasksCount} total tasks`,
  },
  {
    title: 'Active Tasks',
    icon: 'pending_actions',
    link: '/dashboard?filter=active',
    caption: `${taskStore.activeTasksCount} pending`,
  },
  {
    title: 'Completed',
    icon: 'check_circle',
    link: '/dashboard?filter=completed',
    caption: `${taskStore.completedTasksCount} done`,
  },
])

const version = versionData.version

const leftDrawerOpen = ref(false)
const showEditNameDialog = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
:deep(.q-drawer) {
  border: none !important;
  margin-top: 0 !important;
}

:deep(.q-drawer__content) {
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  width: 280px !important;
  max-width: 280px !important;
  box-sizing: border-box !important;
}

.user-info-section {
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
}

.navigation-menu {
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 8px;
}

.navigation-menu::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  display: none;
}

.navigation-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.navigation-menu .q-scrollarea__content) {
  overflow: hidden !important;
}

:deep(.q-scrollarea__thumb) {
  display: none !important;
}
</style>
