import React from "https://unpkg.com/es-react@latest/dev/react.js";
import ReactDOM from "https://unpkg.com/es-react@latest/dev/react-dom.js";
import htm from "https://unpkg.com/htm@latest?module";
import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js";

const html = htm.bind(React.createElement);

const UI = (props) => {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);
  return false;
  return html`<div id='ui'>Hello World!</div>`;
}

export default function mountUI(){
    ReactDOM.render(
        html`<${UI}/>`,
        document.getElementById("root")
      );
}