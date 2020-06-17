const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
console.log(process.argv);

function loadData() {
	const buffer = fs.readFileSync("data.json"); // doc noi dung file
	const data = buffer.toString(); //doi lai thanh string
	const dataObj = JSON.parse(data); // to js object
	return dataObj;
}

function saveData(data) {
	fs.writeFileSync("data.json", JSON.stringify(data));
}

function addTodo(todo, status) {
	const data = loadData();
	const newTodo = { todo: todo, status: status };
	data.push(newTodo);
	saveData(data);
}

yargs.command({
	command: "list", // goi ra bang lenh node app.js list
	describe: "Listing all todos",
	handler: function () {
		console.log(chalk.green.bold("Listing todos"));
		const data = loadData();
		console.log(data);
		data.forEach(({ todo, status }, index) =>
			console.log(`
        index:${index}
		todo: ${todo}
		status: ${status}`)
		);
	},
});

yargs.command({
	command: "add", // add bang lenh  node app.js add --todo="eat cake" status=true
	describe: "add a new todo again",
	builder: {
		todo: {
			describe: "todo content",
			demandOption: true,
			type: "string",
			alias: "t",
		},
		status: {
			describe: "status of your todo",
			demandOption: false,
			type: "boolean",
			alias: "s",
			default: false,
		},
	},
	handler: function ({ id, todo, status }) {
		addTodo(todo, status);
		console.log(chalk.underline.green("finished adding"));
	},
});

//xoa 1 dong todo
yargs.command({
	command: "delete", // add bang lenh  node app.js delete --id=4
	describe: "Delete one todo item",
	builder: {
		id: {
			describe: "id number",
			demandOption: true,
			type: "string",
			type: "number",
		},
	},
	handler: function (builder) {
		let data = loadData();
		data.splice(builder.id, 1);
		saveData(data);
	},
});

//xoa toan bo todo list
yargs.command({
	command: "delete-all", // add bang lenh  node app.js delete-all
	describe: "Delete all todo items",

	handler: function (builder) {
		let data = loadData();
		data.splice(0, data.length);
		saveData(data);
	},
});

//tao list complete
yargs.command({
	command: "list-completed", // add bang lenh  node app.js list-completed
	describe: "List completed",

	handler: function (builder) {
		let data = loadData();
		let newData = data.filter((elm) => elm.status === true);
		console.log(newData);
		newData.forEach(({ todo, status }, index) =>
			console.log(`
        index:${index}
		todo: ${todo}
		status: ${status}`)
		);
	},
});

//tao list uncompleted
yargs.command({
	command: "list-uncompleted", // add bang lenh  node app.js list-uncompleted
	describe: "List uncompleted",

	handler: function (builder) {
		let data = loadData();
		let newData = data.filter((elm) => elm.status === false);
		console.log(newData);
		newData.forEach(({ todo, status }, index) =>
			console.log(`
        index:${index}
		todo: ${todo}
		status: ${status}`)
		);
	},
});

yargs.parse();
