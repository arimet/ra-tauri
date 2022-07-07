// in src/App.js
import * as React from "react";
import {
  Admin,
  EditGuesser,
  ListGuesser,
  Resource,
  ShowGuesser,
} from "react-admin";

import { PostCreate } from "./post/PostCreate";

// import raDataTauriForage from "./dataProvider/ra-data-local-forage";
import raDataTauriForage from "./dataProvider/ra-data-local-forage-2";
import { CommentCreate } from "./comment/CommentCreate";
import { CommentList } from "./comment/CommentList";
import { PostShow } from "./post/PostShow";

const App = () => {
  const [dataProvider, setDataProvider] = React.useState(null);

  React.useEffect(() => {
    async function createDataProvider() {
      const localForageProvider = await raDataTauriForage({
        defaultData: {
          posts: [
            { id: 0, title: "Hello, world!" },
            { id: 1, title: "FooBar" },
          ],
          comments: [
            { id: 0, post_id: 0, author: "John Doe", body: "Sensational!" },
            { id: 1, post_id: 0, author: "Jane Doe", body: "I agree" },
          ],
        },
      });
      setDataProvider(localForageProvider);
    }
    createDataProvider()
  }, []);

  // hide the admin until the data provider is ready
  if (!dataProvider) return <p>Loading...</p>;

  return (
    // @ts-ignore
    <Admin dataProvider={dataProvider}>
      <Resource
        name="posts"
        list={ListGuesser}
        show={PostShow}
        edit={EditGuesser}
        create={PostCreate}
      />
      <Resource name="comments" list={CommentList} show={ShowGuesser} edit={EditGuesser} create={CommentCreate} />
    </Admin>
  );
};

export default App;
