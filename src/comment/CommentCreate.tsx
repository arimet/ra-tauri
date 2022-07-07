import { v4 as uuidv4 } from "uuid";
import { Create, ReferenceInput, SelectInput, SimpleForm, TextInput } from "react-admin";

const postDefaultValue = () => ({ id: uuidv4() });

export const CommentCreate = () => (
  <Create>
    <SimpleForm defaultValues={postDefaultValue}>
      <ReferenceInput label="Post" source="post_id" reference="posts">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <TextInput source="author" />
      <TextInput source="body" />
    </SimpleForm>
  </Create>
);
