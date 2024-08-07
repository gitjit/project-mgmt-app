# Project Management App with GraphQL and MongoDB

In this project, we will build a project management application using GraphQL and MongoDB. The application will allow users to manage clients and projects. We will use GraphQL to define the API for the application and MongoDB to store the data.

## Setting up the project

```bash
$ npm init -y
$ npm install express express-graphql graphql mongoose cors colors
$ npm install -D nodemon dotenv // dev dependencies
```

### Setting up the Server

Let us create a folder for the server and create a file `index.js` in it. Also create an `.env` file to store the environment variables.

```bash
NODE_ENV='development'
PORT=5001
```

Now let us initialize and start the server

```javascript
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 6000;

const app = express();
app.listen(port, console.log(`App listening on port : ${port}`));
```

Now let us test the server by running the command `npm run dev` which will start the server on port ## Defining GraphQL Schema

Before we switch our focus to MongoDB, let us setup the GraphQL server with some sample data.
I have created a file called sampleData.js in the server folder and added some sample data to it. It holds the data for the clients and projects.It contains arrays of client and project objects.

```javascript
const projects = [
  {
    id: "1",
    clientId: "1",
    name: "eCommerce Website",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.",
    status: "In Progress",
  },
  ....
];

// Clients
const clients = [
  {
    id: "1",
    name: "Tony Stark",
    email: "ironman@gmail.com",
    phone: "343-567-4333",
  },
  ...
]
```

Now we have some sample data to work with. Let us create a schema for the GraphQL server. I have created a file called schema.js in the server folder and added the schema for the clients and projects.

The GraphQL schema for the project management app is defined in `server/schema/schema.js`. It outlines the structure of the data and the types of queries that can be executed against the GraphQL server.

### Types

We start the schema by defining the types that represent the data in the application. The schema defines two types: `ClientType` and `ProjectType`.

#### ClientType

Represents a client with the following fields:

- `id`: A unique identifier for the client. (GraphQLID)
- `name`: The name of the client. (GraphQLString)
- `email`: The email address of the client. (GraphQLString)
- `phone`: The phone number of the client. (GraphQLString)

#### ProjectType

Represents a project with the following fields:

- `id`: A unique identifier for the project. (GraphQLID)
- `clientId`: The identifier of the client associated with the project. (GraphQLID)
- `name`: The name of the project. (GraphQLString)
- `description`: A brief description of the project. (GraphQLString)
- `status`: The current status of the project. (GraphQLString)
- `client`: A reference to the client associated with the project. (ClientType)

### Root Query

The root query defines the entry points for the API:

- `clients`: Retrieves a list of all clients. Returns `[ClientType]`.
- `client`: Retrieves a single client by ID. Accepts `id` (GraphQLID) as an argument. Returns `ClientType`.
- `projects`: Retrieves a list of all projects. Returns `[ProjectType]`.
- `project`: Retrieves a single project by ID. Accepts `id` (GraphQLID) as an argument. Returns `ProjectType`.

## Starting the GraphQL Server

Now with our schema ready let us run our graphql endpoint. We will use express-graphql to create the graphql server.

```javascript
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
const port = process.env.PORT || 6000;
const schema = require("../server/schema/schema.js");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`App listening on port : ${port}`));
```

Now with all these changes let us restart our server and test the graphql endpoint by running the command `npm run dev`. To see the graphiql interface visit `http://localhost:5001/graphql`.

![](_images/2024-07-10-06-38-09.png)

## Setting up MongoDB

Now that we have our GraphQL server setup, let us switch our focus to MongoDB. We will be using Mongoose to interact with MongoDB. Let us start by creating a connection to MongoDB. I am using mongoDB Atlas for this project.

First go to MongoDB Atlas and create a new project. (proj_mgt). Then create a new cluster in the free tier and keep defaulsts for the rest of the options. Once the cluster is created, click on connect and whitelist your IP address. Then create a new user and password for the database. Once the user is created, click on connect and choose the connection method of Drivers to access from your application. Choose Node.js and copy the connection string and paste it in the .env file.

Now we have a Project and a Cluster setup in MongoDB Atlas. Go to cluster and bring your own data and create a db called `mgmt_db`. Now we have a database setup in MongoDB Atlas and a collection called clients. Ensure to append ur connection string with db name at end as shown below.

````bash
MONGO_URI = 'mongodb+srv://jitheshc:aio1test@cluster0.kc5wx7u.mongodb.net/mgmt_db?retryWrites=true&w=majority&appName=Cluster0'


![](_images/2024-07-10-07-16-20.png)



```javascript
const mongoose = require("mongoose");
require("dotenv").config();

````

Ensure that you have whitelisted your ip address or did 0.0.0.0/0 so that any one with connection string can access this database.

![](_images/2024-07-10-10-35-09.png)

Now with mongo database ready let us try to connect to mongo using this connection string. I created a file db.js in the config folder and added following code to connect to mongo.

```js
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    console.log("mongo connection...");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
```

Also let us try to connect in our server as shown below.

```js
const app = express();

// Connect to MongoDB
connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
})
```

If succeeded you will see following line in terminal..

```bash
[nodemon] starting `node server/index.js`
mongo connection...
App listening on port : 5001
MongoDB connected: ac-nylntus-shard-00-02.kc5wx7u.mongodb.net
```

## Creating Mongoose Models

Now that we have connected to MongoDB, let us create Mongoose models for the clients and projects. I have created a folder called models in the server folder and created two files Client.js and Project.js. The Client.js file contains the schema for the client and the Project.js file contains the schema for the project.

```js
const mongoose = require("mongoose");

// Client Schema
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Client", clientSchema);
```

```js
// Project Schema
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
```

## Mongoose and Singleton Pattern

Mongoose acts as a singleton within a Node.js application. This means that when you require Mongoose in different parts of your application, you are essentially importing the same instance of Mongoose due to Node.js's module caching mechanism. Once a module is loaded, it is cached, and subsequent calls to `require` that module will return the same instance.

### Benefits of Mongoose Singleton Pattern

- **Efficiency**: Utilizing a single connection pool managed by Mongoose across your application reduces overhead and improves performance.
- **Consistency**: Ensures that your application's data layer is consistent, as all parts of your application interact with the database through the same Mongoose instance.
- **Simplicity**: Simplifies connection management, as you only need to establish a connection to your MongoDB database once, and then you can reuse that connection throughout your application.

### Implementing Mongoose Singleton

Here's a typical pattern for connecting to MongoDB using Mongoose in a way that leverages its singleton nature:

**Define a Connection Function in `db.js`**:
Create a file (e.g., `db.js`) that exports a function to connect to MongoDB using Mongoose. This function should call `mongoose.connect`.

**Call the Connection Function Early**:
Import and call this connection function early in your application's entry point. This ensures that Mongoose connects to MongoDB when your application starts.

**Reuse Mongoose**:
Anywhere else in your application, simply require Mongoose using `require('mongoose')`. You'll be working with the same Mongoose instance, and thus, the same database connection.

By following this pattern, you leverage the singleton nature of Mongoose to efficiently and consistently manage your application's data layer.

## Now let us update our graphql schema to use these models

```js
//Query : Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: GraphQLList(ClientType),
      resolve(parent, args) {
        //return clients;
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return clients.find((client) => client.id === args.id);
        return Client.findById(args.id);
      },
    },
    projects: {
      type: GraphQLList(ProjectType),
      resolve(parent, args) {
        //return projects;
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return projects.find((project) => project.id === args.id);
        return Project.findById(args.id);
      },
    },
  },
});
```

### Sample queries

```js
# # Query Clients
# {
  clients{
    id,
    name,
    email,
    phone
#   }
# }

# #Query a Client
# {
   client(id:"668fddcd1fedb010fdaeccf9"){
     name,
     email,
     phone
   }
# }

```

## Adding Mutation

Now let us add mutation to our graphql schema. I have added the following mutation to the schema.js file.
Let us start with adding a new client and deleting a client.

```js
//Mutations
const mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    // Add a new client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findOneAndDelete({ _id: args.id });
      },
    },
  });

```

Now let us add sample client and delete client to our graphiql interface and test it using Graphiql interface.

```js
mutation{
   addClient(name:"Tony Stark", email:"ironman@gmail.com",phone:"123-555-3333"){
     id,
     name,
     email,
     phone
   }
 }
```

Now let us update our mutation to support adding Projects and deleting projects. In this case we have to create an enum to support the status of the project.

```js
const ProjectStatusEnum = new GraphQLEnumType({
  name: "ProjectStatus",
  description: "The possible statuses for a project",
  values: {
    NEW: { value: "Not Started" },
    IN_PROGRESS: { value: "In Progress" },
    COMPLETED: { value: "Completed" },
  },
});
```

Now let us add the mutation to add a project and delete a project.

```js
// Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        clientId: { type: GraphQLNonNull(GraphQLString) },
        status: { type: ProjectStatusEnum, default: ProjectStatusEnum.NEW },
        // status: { type: ProjectStatusEnum, default: "Not Started" },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          clientId: args.clientId,
          status: args.status,
        });
        return project.save();
      },
    },
    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Project.findOneAndDelete(args.id);
      },
    },
    // Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: { type: ProjectStatusEnum },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              clientId: args.clientId,
              status: args.status,
            },
          },
          { new: true } //// This option returns the document after update was applied.
        );
      }
    }
```

Now let us test the add project and delete project mutation in the graphiql interface.

```js
        mutation{
        addProject(name:"Desktop",description:"UWP Project",clientId:"6690a7de1ad0c281bb6837d6", status:COMPLETED){
          name,
          id,
          clientId
        }
      }

      {
        projects{
          id,
          name,
          description
          client{
            name
          }
        }
      }

      mutation{
        updateProject(id:"6690ae751f2c6875a85eb215",
                      name:"Desktop2",
                      description:"WinApp Project",
                      status:IN_PROGRESS){
            id
        }
      }

    mutation{
      deleteProject(id:"6690ae651f2c6875a85eb213"){
        name
      }

```

## Setting up the Client App with React

Now that we have our GraphQL server setup, let us create a client application using React to interact with the server. We will use Apollo Client to make requests to the GraphQL server and fetch data from it.

```bash
$ npx create-react-app client
$ cd client
$  npm i @apollo/client graphql react-router-dom react-icons
```

Now let us create an Apollo client and wrap our application with the ApolloProvider in the App.js file.

```js
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
        <div className="container">
          <Header />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
```

## Configure concurrently to run both server and client

```bash
// From the root folder
npm install concurrently --save-dev
```

Update the root package.json

```json
"scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "client": "npm start --prefix client",
    "dev:all": "concurrently \"npm run dev\" \"npm run client\""
  },

```

## Reference

https://www.youtube.com/watch?v=BcLNfwF04Kw
