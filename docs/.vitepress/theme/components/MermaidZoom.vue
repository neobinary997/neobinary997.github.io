<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isOpen = ref(false)
const svgUrl = ref('')
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const baseWidth = ref(1000)
const baseHeight = ref(600)
const overlay = ref(null)
const viewport = ref(null)
const closeButton = ref(null)
const boundDiagrams = new Set()

let observer
let bindTimer
let previousFocus
let activeSvgUrl
const dragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0

const canvasStyle = computed(() => ({
  width: `${baseWidth.value}px`,
  height: `${baseHeight.value}px`,
  transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0) scale(${scale.value})`,
}))

const scaleLabel = computed(() => `${Math.round(scale.value * 100)}%`)

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getSvgSize(svg) {
  const viewBox = svg.viewBox?.baseVal
  const rect = svg.getBoundingClientRect()
  return {
    width: viewBox?.width || rect.width || 1000,
    height: viewBox?.height || rect.height || 600,
  }
}

function createSvgUrl(svg, size) {
  const clone = svg.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('translate', 'no')
  clone.classList.add('notranslate')
  clone.setAttribute('width', size.width)
  clone.setAttribute('height', size.height)
  // outerHTML uses the HTML serializer, which emits tags such as <br> inside
  // Mermaid foreignObject labels. That markup is invalid when loaded as an
  // SVG image and results in a blank zoom viewer. XMLSerializer preserves the
  // required XML closing syntax.
  const source = new XMLSerializer().serializeToString(clone)
  return URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }))
}

async function openDiagram(diagram) {
  const svg = diagram.querySelector('svg')
  if (!svg) return

  const size = getSvgSize(svg)
  baseWidth.value = size.width
  baseHeight.value = size.height
  activeSvgUrl = createSvgUrl(svg, size)
  svgUrl.value = activeSvgUrl
  previousFocus = document.activeElement
  isOpen.value = true
  document.documentElement.classList.add('mermaid-zoom-open')

  await nextTick()
  fitToScreen()
  closeButton.value?.focus()
}

function closeViewer() {
  isOpen.value = false
  svgUrl.value = ''
  if (activeSvgUrl) URL.revokeObjectURL(activeSvgUrl)
  activeSvgUrl = undefined
  dragging.value = false
  document.documentElement.classList.remove('mermaid-zoom-open')
  previousFocus?.focus?.()
}

function fitToScreen() {
  const rect = viewport.value?.getBoundingClientRect()
  if (!rect) return

  const availableWidth = Math.max(160, rect.width - 96)
  const availableHeight = Math.max(120, rect.height - 128)
  scale.value = clamp(
    Math.min(availableWidth / baseWidth.value, availableHeight / baseHeight.value),
    0.15,
    2,
  )
  offsetX.value = (rect.width - baseWidth.value * scale.value) / 2
  offsetY.value = (rect.height - baseHeight.value * scale.value) / 2
}

function zoomAt(factor, clientX, clientY) {
  const rect = viewport.value?.getBoundingClientRect()
  if (!rect) return

  const nextScale = clamp(scale.value * factor, 0.15, 6)
  const pointX = clientX - rect.left
  const pointY = clientY - rect.top
  const ratio = nextScale / scale.value

  offsetX.value = pointX - (pointX - offsetX.value) * ratio
  offsetY.value = pointY - (pointY - offsetY.value) * ratio
  scale.value = nextScale
}

function zoomFromCenter(factor) {
  const rect = viewport.value?.getBoundingClientRect()
  if (!rect) return
  zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

function actualSize() {
  const rect = viewport.value?.getBoundingClientRect()
  if (!rect) return
  scale.value = 1
  offsetX.value = (rect.width - baseWidth.value) / 2
  offsetY.value = (rect.height - baseHeight.value) / 2
}

function handleWheel(event) {
  event.preventDefault()
  zoomAt(event.deltaY < 0 ? 1.15 : 1 / 1.15, event.clientX, event.clientY)
}

function handlePointerDown(event) {
  if (event.button !== 0 || event.target.closest('.mermaid-zoom-toolbar')) return
  dragging.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOriginX = offsetX.value
  dragOriginY = offsetY.value
  viewport.value?.setPointerCapture(event.pointerId)
}

function handlePointerMove(event) {
  if (!dragging.value) return
  offsetX.value = dragOriginX + event.clientX - dragStartX
  offsetY.value = dragOriginY + event.clientY - dragStartY
}

function handlePointerUp(event) {
  dragging.value = false
  if (viewport.value?.hasPointerCapture(event.pointerId)) {
    viewport.value.releasePointerCapture(event.pointerId)
  }
}

function handleGlobalKeydown(event) {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeViewer()
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    zoomFromCenter(1.2)
  } else if (event.key === '-') {
    event.preventDefault()
    zoomFromCenter(1 / 1.2)
  } else if (event.key === '0') {
    event.preventDefault()
    fitToScreen()
  } else if (event.key === 'Tab') {
    const controls = [...overlay.value.querySelectorAll('button:not([disabled])')]
    if (!controls.length) return
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

function handleDiagramClick(event) {
  if (event.target.closest('a, button')) return
  openDiagram(event.currentTarget)
}

function handleDiagramKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  openDiagram(event.currentTarget)
}

function bindDiagrams() {
  document.querySelectorAll('.vp-doc .mermaid').forEach((diagram) => {
    if (boundDiagrams.has(diagram)) return
    boundDiagrams.add(diagram)
    diagram.classList.add('is-zoomable')
    diagram.setAttribute('role', 'button')
    diagram.setAttribute('tabindex', '0')
    diagram.setAttribute('aria-label', '点击放大图表')
    diagram.addEventListener('click', handleDiagramClick)
    diagram.addEventListener('keydown', handleDiagramKeydown)
  })
}

function scheduleBind() {
  window.clearTimeout(bindTimer)
  bindTimer = window.setTimeout(bindDiagrams, 80)
}

watch(() => route.path, async () => {
  if (isOpen.value) closeViewer()
  await nextTick()
  scheduleBind()
})

onMounted(() => {
  bindDiagrams()
  observer = new MutationObserver(scheduleBind)
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', fitToScreen)
})

onBeforeUnmount(() => {
  if (activeSvgUrl) URL.revokeObjectURL(activeSvgUrl)
  observer?.disconnect()
  window.clearTimeout(bindTimer)
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', fitToScreen)
  document.documentElement.classList.remove('mermaid-zoom-open')

  boundDiagrams.forEach((diagram) => {
    diagram.removeEventListener('click', handleDiagramClick)
    diagram.removeEventListener('keydown', handleDiagramKeydown)
  })
  boundDiagrams.clear()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="overlay"
      class="mermaid-zoom-overlay notranslate"
      translate="no"
      role="dialog"
      aria-modal="true"
      aria-label="图表查看器"
    >
      <div class="mermaid-zoom-toolbar">
        <button type="button" title="缩小（-）" aria-label="缩小" @click="zoomFromCenter(1 / 1.2)">−</button>
        <output aria-live="polite">{{ scaleLabel }}</output>
        <button type="button" title="放大（+）" aria-label="放大" @click="zoomFromCenter(1.2)">+</button>
        <button type="button" title="适应屏幕（0）" @click="fitToScreen">适应</button>
        <button type="button" title="实际大小" @click="actualSize">1:1</button>
        <button ref="closeButton" type="button" class="close" title="关闭（Esc）" aria-label="关闭" @click="closeViewer">×</button>
      </div>

      <div
        ref="viewport"
        class="mermaid-zoom-viewport"
        :class="{ dragging }"
        @wheel="handleWheel"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @dblclick="fitToScreen"
      >
        <div class="mermaid-zoom-canvas notranslate" translate="no" :style="canvasStyle">
          <img :src="svgUrl" alt="放大的图表" draggable="false" />
        </div>
      </div>

      <p class="mermaid-zoom-help">滚轮或按钮缩放 · 拖动画布 · 双击复位 · Esc 关闭</p>
    </div>
  </Teleport>
</template>

<style scoped>
.mermaid-zoom-overlay {
  position: fixed;
  z-index: 10000;
  inset: 0;
  background: rgba(12, 18, 28, 0.94);
  color: #fff;
}

.mermaid-zoom-viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.mermaid-zoom-viewport.dragging {
  cursor: grabbing;
}

.mermaid-zoom-canvas {
  position: absolute;
  transform-origin: 0 0;
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  will-change: transform;
  margin: 0;
  padding: 0 !important;
  text-align: initial;
}

.mermaid-zoom-canvas img {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.mermaid-zoom-toolbar {
  position: absolute;
  z-index: 2;
  top: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(25, 32, 44, 0.92);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.24);
}

.mermaid-zoom-toolbar button {
  min-width: 36px;
  height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.mermaid-zoom-toolbar button:hover,
.mermaid-zoom-toolbar button:focus-visible {
  outline: none;
  background: rgba(255, 255, 255, 0.14);
}

.mermaid-zoom-toolbar .close {
  margin-left: 4px;
  font-size: 22px;
}

.mermaid-zoom-toolbar output {
  min-width: 50px;
  color: rgba(255, 255, 255, 0.78);
  text-align: center;
  font-size: 12px;
}

.mermaid-zoom-help {
  position: absolute;
  z-index: 2;
  bottom: 16px;
  left: 50%;
  margin: 0;
  padding: 6px 12px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(25, 32, 44, 0.78);
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  pointer-events: none;
}

@media (max-width: 640px) {
  .mermaid-zoom-toolbar {
    top: 10px;
    right: 10px;
  }

  .mermaid-zoom-toolbar button {
    min-width: 32px;
    padding: 0 7px;
  }

  .mermaid-zoom-help {
    width: max-content;
    max-width: calc(100vw - 24px);
  }
}
</style>
