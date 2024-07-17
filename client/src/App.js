import Client from "./components/Client";
import Project from "./components/Project";

import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Header />
          <div>
            <Client />
          </div>
          <div>
            <Project />
          </div>
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
