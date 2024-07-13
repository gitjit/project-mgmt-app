const { projects, clients } = require("../sampleData.js");

// mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

//Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

//Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        //return clients.find((client) => client.id === parent.clientId);
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const ProjectStatusEnum = new GraphQLEnumType({
  name: "ProjectStatus",
  description: "The possible statuses for a project",
  values: {
    NEW: { value: "Not Started" },
    IN_PROGRESS: { value: "In Progress" },
    COMPLETED: { value: "Completed" },
  },
});

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
      },
      // status: { type: ProjectStatusEnum, default: "Not Started" },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations,
});
