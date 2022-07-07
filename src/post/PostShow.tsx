import { Datagrid, ReferenceManyField, Show, SimpleShowLayout, TextField } from "react-admin";

export const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceManyField label="Comments" reference="comments" target="post_id">
        <Datagrid>
          <TextField source="author" />
          <TextField source="body" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
