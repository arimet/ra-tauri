// in src/App.js
import * as React from "react";
import { Admin, EditGuesser, ListGuesser, Resource, ShowGuesser } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { PostCreate } from "./post/PostCreate";

const dataProvider = localStorageDataProvider({
  defaultData: {
      posts: [
          { id: 0, title: 'Hello, world!' },
          { id: 1, title: 'FooBar' },
      ],
      comments: [
          { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
          { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
      ],
  },
  loggingEnabled: true
});

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={ListGuesser} show={ShowGuesser} edit={EditGuesser} create={PostCreate} />
    </Admin>
);

export default App;