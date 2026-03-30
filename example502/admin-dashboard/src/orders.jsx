import { List, Datagrid, TextField, NumberField, DateField, Edit, SimpleForm, SelectInput, TextInput, EditButton } from 'react-admin';

export const OrderList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <DateField source="orderedDate" />
            <TextField source="status" />
            <NumberField source="total" />
            <EditButton />
        </Datagrid>
    </List>
);

export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <SelectInput source="status" choices={[
                { id: 'PAYMENT_EXPECTED', name: 'PAYMENT_EXPECTED' },
                { id: 'SHIPPED', name: 'SHIPPED' },
                { id: 'DELIVERED', name: 'DELIVERED' },
                { id: 'CANCELLED', name: 'CANCELLED' },
            ]} />
        </SimpleForm>
    </Edit>
);
