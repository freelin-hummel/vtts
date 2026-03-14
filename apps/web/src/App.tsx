import { routes } from "@vtts/api-client";

export default function App() {
  return (
    <div>
      <h1>vtts</h1>
      <p>API base: {routes.packages}</p>
    </div>
  );
}
