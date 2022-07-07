import { v4 as uuidv4 } from 'uuid';
import { Create, SimpleForm, TextInput } from "react-admin";


const postDefaultValue = () => ({ id: uuidv4() });

export const PostCreate = () => (
    <Create>
        <SimpleForm defaultValues={postDefaultValue}>
            <TextInput source="title" />
        </SimpleForm>
    </Create>
);