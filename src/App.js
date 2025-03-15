import "./styles.css";
import json from "./data.json";
import { useState } from "react";

const List = ({ list, addNodeToList, deleteNodeFromList }) => {
  const [expanded, setExpanded] = useState({});
  return (
    <div className="container">
      {list.map((node) => (
        <div key="node.id">
          {node?.isFolder && (
            <span
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [node.name]: !prev[node.name],
                }))
              }
            >
              {expanded?.[node.name] ? <span>-</span> : <span>+</span>}
            </span>
          )}
          <span>
            {node.name}
            {node?.isFolder && (
              <span onClick={() => addNodeToList(node?.id)}>
                <img
                  src="http://cdn3.iconfinder.com/data/icons/file-and-folder-fill-icons-set/144/Folder_Add-1024.png"
                  alt=""
                />
              </span>
            )}

            <span onClick={() => deleteNodeFromList(node?.id)}>
              <img
                src="https://cdn.iconscout.com/icon/free/png-512/free-delete-icon-download-in-svg-png-gif-file-formats--saas-icons-pack-miscellaneous-902124.png?f=webp&w=512"
                alt=""
              />
            </span>
          </span>
          {node?.children && expanded?.[node.name] && (
            <List
              list={node?.children}
              addNodeToList={addNodeToList}
              deleteNodeFromList={deleteNodeFromList}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default function App() {
  const [data, setData] = useState(json);

  const deleteNodeFromList = (itemId) => {
    const updateTree = (list) => {
      return list
        .filter((node) => node?.id !== itemId)
        .map((node) => {
          if (node?.children) {
            return { ...node, children: updateTree(node?.children) };
          }
          return node;
        });
    };

    setData((prev) => updateTree(prev));
  };

  const addNodeToList = (parentId) => {
    const name = prompt("Enter node name");
    const updateTree = (list) => {
      return list.map((node) => {
        if (node?.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(),
                isFolder: true,
                children: [],
                name: name,
              },
            ],
          };
        }
        if (node?.children) {
          return {
            ...node,
            children: updateTree(node?.children),
          };
        }

        return node;
      });
    };

    setData((prev) => updateTree(prev));
  };

  return (
    <div className="App">
      <h1>File/Folder Explorer</h1>
      <List
        list={data}
        addNodeToList={addNodeToList}
        deleteNodeFromList={deleteNodeFromList}
      />
    </div>
  );
}
