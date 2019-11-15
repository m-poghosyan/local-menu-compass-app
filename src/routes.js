import Menus from './views/Menus'
import Planner from './views/Planner'
import Recipes from './views/Recipes'
import TopMenu from './components/TopMenu'

const routes = [
  {
    path: '/',
    exact: true,
    main: Menus,
    menu: TopMenu,
    title: 'Menu Selection',
    subtitle: ' ',
    breadcrumbName: 'Home',
  },
  {
    path: '/planner/:menuUUID',
    exact: false,
    main: Planner,
    menu: TopMenu,
    title: 'Planner',
    subtitle: ' ',
    breadcrumbName: 'Planner',
  },
  {
    path: '/recipes',
    exact: false,
    main: Recipes,
    menu: TopMenu,
    title: 'Recipe Search',
    subtitle: ' ',
    breadcrumbName: 'Recipes',
  },
]

export default routes
