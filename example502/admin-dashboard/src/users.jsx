import { List, Datagrid, TextField, BooleanField, Edit, Create, SimpleForm, TextInput, BooleanInput, EditButton } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="userName" />
            <TextField source="userDetails.firstName" label="First Name" />
            <TextField source="userDetails.lastName" label="Last Name" />
            <TextField source="userDetails.email" label="Email" />
            <BooleanField source="active" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="userName" />
            <TextInput source="userPassword" type="password" />
            <TextInput source="userDetails.firstName" label="First Name" />
            <TextInput source="userDetails.lastName" label="Last Name" />
            <TextInput source="userDetails.email" label="Email" />
            <BooleanInput source="active" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="userName" required />
            <TextInput source="userPassword" type="password" required />
            <TextInput source="userDetails.firstName" label="First Name" />
            <TextInput source="userDetails.lastName" label="Last Name" />
            <TextInput source="userDetails.email" label="Email" />
            <BooleanInput source="active" defaultValue={true} />
        </SimpleForm>
    </Create>
);
