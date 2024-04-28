import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './ui/Home';
import Error from './ui/Error';
import Menu, { Loader as menuLoader } from './features/menu/Menu';
import AppLayout from './ui/AppLayout';
import Cart from './features/cart/Cart';
import Order, { loader as orderLoader } from './features/order/Order';
import { action as actionData } from './features/order/UpdateOrder';
import CreateOrder, {
  action as createOrderAction,
} from './features/order/CreateOrder';
//  what is outlet in router that main you have children of routes and to render whatever current nested routes may be pages or components so if you how can use outlet in router

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      // your routes as well you add in this array will see in app layout place and you need outlet routes to work
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/order/:orderNumber',
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: actionData,
      },
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
