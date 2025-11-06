import { Link } from "react-router-dom";

export default function App() {
  return (
    <main style={{padding: 32, fontFamily: "system-ui, sans-serif"}}>
      <h1>laboratoire</h1>
      <p>Welcome. Pick a demo:</p>
      <ul>
        <li><a href="/laboratoire/react/">React App</a></li>
        {/* <li><a href="/laboratoire/angular/">Angular App</a></li> */}
      </ul>
    </main>
  );
}
