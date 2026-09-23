import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './router/routes'
import './styles/index.css'

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // runs once on both the prerender pass and the client
  },
  {
    rootContainer: '#root',
  },
)
