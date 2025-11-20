<template>
  <q-item 
    clickable 
    tag="router-link" 
    :to="props.link"
    :active="isActive"
    active-class="bg-primary text-white"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label v-if="props.caption" caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})

const route = useRoute()

const isActive = computed(() => {
  // Check if link contains query parameters
  if (props.link.includes('?')) {
    const [path, queryString] = props.link.split('?')
    const queryParams = new URLSearchParams(queryString)
    const filterParam = queryParams.get('filter')
    
    return route.path === path && route.query.filter === filterParam
  }
  
  // For base dashboard link without query params, only active when NO filter is present
  if (props.link === '/dashboard') {
    return route.path === '/dashboard' && !route.query.filter
  }
  
  // Exact path match
  return route.path === props.link
})
</script>
