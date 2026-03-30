import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { UserList, UserEdit, UserCreate } from './users';
import { ProductList, ProductEdit, ProductCreate } from './products';
import { OrderList, OrderEdit } from './orders';
import { Dashboard } from './Dashboard';

const App = () => (
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
        <Resource name="products" list={ProductList} edit={ProductEdit} create={ProductCreate} />
        <Resource name="orders" list={OrderList} edit={OrderEdit} />
    </Admin>
);

export default App;
