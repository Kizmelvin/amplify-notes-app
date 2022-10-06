import { useState, useEffect } from "react";
import {
  CreateNote,
  NavBar,
  NoteUICollection,
  UpdateNote,
} from "./ui-components";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { DataStore, Hub } from "aws-amplify";

function App({ signOut }) {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState();
  useEffect(() => {
    Hub.listen(
      "ui",
      (capsule) => {
        if (capsule.payload.event === "actions:datastore:create:finished") {
          setShowCreateModel(false);
        }
        if (capsule.payload.event === "actions:datastore:update:finished") {
          setShowUpdateModel(false);
        }
      },
      []
    );
  });
  return (
    <>
      <NavBar
        width="100%"
        marginBottom="20px"
        overrides={{
          Button31632483: { onClick: () => setShowCreateModel(true) },
          Button31632487: {
            onClick: async () => {
              signOut();
              await DataStore.clear();
            },
          },
        }}
      />

      <div className="container">
        <NoteUICollection
          overrideItems={({ item, idx }) => {
            return {
              overrides: {
                Vector31472745: {
                  onClick: () => {
                    setShowUpdateModel(true);
                    setNoteToUpdate(item);
                  },
                },
              },
            };
          }}
        />
      </div>
      <div
        className="modal"
        style={{ display: showCreateModel === false && "none" }}
      >
        <CreateNote
          overrides={{
            MyIcon: { as: "button", onClick: () => setShowCreateModel(false) },
          }}
        />
      </div>
      <div
        className="modal"
        style={{ display: showUpdateModel === false && "none" }}
      >
        <UpdateNote
          notes={noteToUpdate}
          overrides={{
            MyIcon: { as: "button", onClick: () => setShowUpdateModel(false) },
          }}
        />
      </div>
    </>
  );
}

export default withAuthenticator(App);
