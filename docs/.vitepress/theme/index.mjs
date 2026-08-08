import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import LatestPosts from './components/LatestPosts.vue'
import PostList from './components/PostList.vue'
import CategoryBadge from './components/CategoryBadge.vue'
import AuthorCard from './components/AuthorCard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LatestPosts', LatestPosts)
    app.component('PostList', PostList)
    app.component('CategoryBadge', CategoryBadge)
    app.component('AuthorCard', AuthorCard)
  },
}
