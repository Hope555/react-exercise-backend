var express = require('express');
var morgan = require('morgan');
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
    var content = "<h3>Phonebook has info for ".concat(persons.length, " people</h3>");
    var date = "<h3>".concat(new Date(), "</h3>");
    res.send(content + date);
});
app.get('/api/persons', function (req, res) {
    res.json(persons);
});
app.get('/api/persons/:id', function (request, response) {
    var id = Number(request.params.id);
    var person = persons.find(function (person) { return person.id === id; });
    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
});
app["delete"]('/api/persons/:id', function (request, response) {
    var id = Number(request.params.id);
    persons = persons.filter(function (person) { return person.id !== id; });
    response.status(204).end();
});
function getRandomId() {
    return Math.floor(Math.random() * 1000);
}
app.post('/api/persons', function (request, response) {
    var _a = request.body, name = _a.name, number = _a.number;
    if (name && number && !persons.find(function (person) { return person.name == name; })) {
        var person = {
            id: getRandomId(),
            name: name,
            number: number
        };
        persons = persons.concat(person);
        response.json(person);
    }
    else {
        response.status(400).json({ error: 'name must be unique' });
    }
});
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
