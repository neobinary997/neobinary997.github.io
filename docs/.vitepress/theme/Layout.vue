<script setup>
import DefaultTheme from 'vitepress/theme'
import MermaidZoom from './components/MermaidZoom.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <MermaidZoom />
    </template>
  </Layout>
</template>
