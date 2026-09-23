import type { RouteRecord } from 'vite-react-ssg'

/**
 * file based routing.
 *
 * every `.tsx` file under `src/pages` becomes a route and its own chunk:
 *
 *   pages/index.tsx            ->  /
 *   pages/terms.tsx            ->  /terms
 *   pages/app/_layout.tsx      ->  layout wrapping everything under /app
 *   pages/app/feed/index.tsx   ->  /app/feed
 *   pages/u/[username].tsx     ->  /u/:username
 *   pages/[...notFound].tsx    ->  catch all
 *
 * a page default-exports its component. it may also export `getStaticPaths`
 * so a dynamic route can be prerendered.
 */
const modules = import.meta.glob('../pages/**/*.tsx')

type Loader = () => Promise<unknown>

interface Dir {
  layout?: string
  index?: string
  leaves: Map<string, string>
  dirs: Map<string, Dir>
}

function emptyDir(): Dir {
  return { leaves: new Map(), dirs: new Map() }
}

/** `[id]` -> `:id`, `[...rest]` -> `*`, anything else passes through. */
function toSegment(name: string): string {
  if (name.startsWith('[...') && name.endsWith(']')) return '*'
  if (name.startsWith('[') && name.endsWith(']')) return `:${name.slice(1, -1)}`
  return name
}

function buildTree(): Dir {
  const root = emptyDir()

  for (const key of Object.keys(modules)) {
    const relative = key.replace('../pages/', '').replace(/\.tsx$/, '')
    const parts = relative.split('/')

    let cursor = root
    for (let i = 0; i < parts.length - 1; i += 1) {
      const name = parts[i]!
      let next = cursor.dirs.get(name)
      if (!next) {
        next = emptyDir()
        cursor.dirs.set(name, next)
      }
      cursor = next
    }

    const last = parts[parts.length - 1]!
    if (last === '_layout') cursor.layout = key
    else if (last === 'index') cursor.index = key
    else cursor.leaves.set(last, key)
  }

  return root
}

/**
 * react-router's `lazy` wants `{ Component }`, our pages default-export.
 * `entry` lets vite-react-ssg find the route's css in the manifest so the
 * prerendered html ships its styles and nothing flashes before hydration.
 */
function lazyRoute(key: string) {
  const load = modules[key] as Loader
  return {
    lazy: async () => {
      const mod = (await load()) as Record<string, unknown>
      return { ...mod, Component: mod.default as React.ComponentType }
    },
    entry: key.replace('../', 'src/'),
  }
}

function toRoutes(dir: Dir): RouteRecord[] {
  const routes: RouteRecord[] = []

  for (const [name, key] of dir.leaves) {
    routes.push({ path: toSegment(name), ...lazyRoute(key) } as RouteRecord)
  }

  for (const [name, child] of dir.dirs) {
    const children = toRoutes(child)
    if (child.index) {
      children.unshift({ index: true, ...lazyRoute(child.index) } as RouteRecord)
    }
    if (children.length === 0) continue

    routes.push({
      path: toSegment(name),
      ...(child.layout ? lazyRoute(child.layout) : {}),
      children,
    } as RouteRecord)
  }

  return routes
}

const tree = buildTree()

const children = toRoutes(tree)
if (tree.index) {
  children.unshift({ index: true, ...lazyRoute(tree.index) } as RouteRecord)
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    ...(tree.layout ? lazyRoute(tree.layout) : {}),
    children,
  } as RouteRecord,
]
