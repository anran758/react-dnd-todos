import { render} from "react-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Todos from "./pages/Todos";

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Todos />
      </DndProvider>
    </div>
  );
}

render(<App />, document.getElementById("root"));
