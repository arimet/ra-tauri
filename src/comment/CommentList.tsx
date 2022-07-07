import { Datagrid, List, TextField } from 'react-admin';

export const CommentList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="author" />
            <TextField source="body" />
        </Datagrid>
    </List>
);