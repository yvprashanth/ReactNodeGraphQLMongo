const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const app = express();
 
const events = [];

app.listen(3000);

app.get('/', (req, res, next) => {
    res.send("This is Prashanth Yerramilli");
});

app.get('/documents/:format/:type', function (req, res) {
    var format = req.params.format,
        type = req.params.type;
});

app.get('/test', function(req, res){
    var myJson = {};
    myJson.format = req.query.format;
    myJson.type = req.query.type;
    res.json(myJson);
});

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        } 

        type RootQuery {
            events: [Event!]!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), 
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: args.eventInput.date
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
})
);

app.use(express.urlencoded({extended: true}));

// app.use(bodyParser.json());