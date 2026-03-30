import { List, Datagrid, TextField, NumberField, Edit, Create, SimpleForm, TextInput, NumberInput, EditButton } from 'react-admin';

export const ProductList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="productName" />
            <NumberField source="price" />
            <NumberField source="availability" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="productName" />
            <TextInput source="discription" multiline rows={5} />
            <NumberInput source="price" />
            <NumberInput source="availability" />
        </SimpleForm>
    </Edit>
);

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="productName" required />
            <TextInput source="discription" multiline rows={5} />
            <NumberInput source="price" required />
            <NumberInput source="availability" defaultValue={0} required />
        </SimpleForm>
    </Create>
);
