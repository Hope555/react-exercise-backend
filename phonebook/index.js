require('dotenv').config();
var Person = require('./models/person');
var express = require('express');
var morgan = require('morgan');
var errorHandler = require('./middlewares/errorHandler');
var app = express();
app.use(express.json());
app.use(express.static('build'));
morgan.token('body', function getId(req) {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     JSON.stringify(req.body),
//   ].join(' ')
// }))
var persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];
app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>');
});
app.get('/api/info', function (req, res) {
    Person.find({}).then(function (result) {
        var content = "<h3>Phonebook has info for ".concat(result.length, " people</h3>");
        var date = "<h3>".concat(new Date(), "</h3>");
        res.send(content + date);
    });
});
app.get('/api/persons', function (req, res) {
    Person.find({}).then(function (result) {
        res.json(result);
    });
});
app.get('/api/persons/:id', function (request, response, next) {
    Person.findById(request.params.id)
        .then(function (person) {
        if (person) {
            response.json(person);
        }
        else {
            console.log('id not found');
            response.status(404).end();
        }
    })["catch"](function (error) { return next(error); });
});
app["delete"]('/api/persons/:id', function (request, response) {
    Person.findByIdAndRemove(request.params.id)
        .then(function (result) {
        response.status(204).end();
    })["catch"](function (error) { return console.log(error); });
});
function getRandomId() {
    return Math.floor(Math.random() * 1000);
}
app.post('/api/persons', function (request, response, next) {
    var _a = request.body, name = _a.name, number = _a.number;
    if (name && number && !persons.find(function (person) { return person.name == name; })) {
        var person = new Person({
            name: name,
            number: number
        });
        person.save()
            .then(function (result) {
            response.json(result);
        })["catch"](function (error) { return next(error); });
    }
    else {
        response.status(400).json({ error: 'name must be unique' });
    }
});
app.put('/api/persons/:id', function (request, response, next) {
    var _a = request.body, name = _a.name, number = _a.number;
    var person = {
        name: name,
        number: number
    };
    var opts = {
        "new": true,
        runValidators: true
    };
    Person.findByIdAndUpdate(request.params.id, person, opts)
        .then(function (updatedPerson) {
        response.json(updatedPerson);
    })["catch"](function (error) { return next(error); });
});
app.use(errorHandler.invalidId);
app.use(errorHandler.unknownEndpoint);
var PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
