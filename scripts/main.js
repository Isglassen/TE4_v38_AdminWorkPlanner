import { saveState, loadState } from "./data.js";

const METHODS = {
	"creation": "Account Creation",
	"bankId": "BankID",
	"2fa": "Two-Factor Authentication",
	"securityToken": "Security Token",
}

const state = loadState();
const tasksLists = {
	high: document.getElementById("high-tasks"),
	medium: document.getElementById("medium-tasks"),
	low: document.getElementById("low-tasks")
};
const taskProgress = document.getElementById("task-progress");
const doneString = document.getElementById("done-string");
const resetButton = document.getElementById("reset-button");
const addTaskForm = document.getElementById("new-task-form");
const addTaskFeedback = document.getElementById("new-task-message");

const session = JSON.parse(localStorage.getItem("session"));
const sessionEl = document.getElementById("current-session");

if (session) {
	const sessionFormat = new Intl.DurationFormat("en", {
		style: "digital",
		hoursDisplay: "auto",
	})

	const name = sessionEl.appendChild(document.createElement("p"));
	name.textContent = `Signed in as ${session.user.firstName}`;

	const email = sessionEl.appendChild(document.createElement("p"));
	email.textContent = `Email: ${session.user.email}`;

	const method = sessionEl.appendChild(document.createElement("p"));
	method.textContent = `Signed in via ${METHODS[session.method]}`;

	const timeP = sessionEl.appendChild(document.createElement("p"));
	timeP.appendChild(document.createTextNode("Session: "));

	const timeSpan = timeP.appendChild(document.createElement("span"));
	timeSpan.id = "session-time";

	const sessionStart = Temporal.Instant.fromEpochMilliseconds(session.sessionStart * 1000);
	const updateSessionTime = () => {
		timeSpan.textContent = sessionFormat.format(
			Temporal.Now.instant()
				.since(sessionStart)
				.round({ largestUnit: "hours", smallestUnit: "seconds" })
		);
	}
	setInterval(updateSessionTime, 1000);
	updateSessionTime();

	const button = sessionEl.appendChild(document.createElement("button"));
	button.type = "button";
	button.textContent = "Sign Out";
	button.addEventListener("click", () => {
		localStorage.removeItem("session");
		window.location.reload();
	});
} else {
	const button = sessionEl.appendChild(document.createElement("a"));
	button.className = "button";
	button.textContent = "Sign In";
	button.href = "login.html";
}

function updateTask(event) {
	const li = event.target.closest("li");
	const id = parseInt(li.dataset.id, 10);
	const checkbox = li.querySelector("input");
	const select = li.querySelector("select");

	const task = state.tasks.find(v => v.id == id);
	if (!task) throw new Error("Task not found");

	task.priority = select.value;
	task.done = checkbox.checked;

	saveState(state);
	render();
}

function deleteTask(event) {
	if (!event.target.classList.contains("delete")) return;

	const li = event.target.closest("li");
	const id = parseInt(li.dataset.id, 10);

	const task = state.tasks.find(v => v.id == id);
	if (!task) throw new Error("Task not found");

	state.tasks = state.tasks.filter(v => v.id != id);

	saveState(state);
	render();
}

function resetStorage() {
	localStorage.clear();
	state.tasks = loadState().tasks;
	saveState(state);
	render();
}

resetButton.addEventListener("click", resetStorage);

Object.values(tasksLists).forEach(v => {
	v.addEventListener("input", updateTask);
	v.addEventListener("click", deleteTask);
});

function render() {
	Object.values(tasksLists).forEach(v => v.innerHTML = "");
	for (const task of state.tasks) {
		const li = tasksLists[task.priority].appendChild(document.createElement("li"));
		const label = li.appendChild(document.createElement("label"));
		const checkbox = label.appendChild(document.createElement("input"));
		label.appendChild(document.createTextNode(task.title));

		li.classList.add("task");
		li.dataset.id = task.id;

		const id = "task" + task.id;

		label.for = id;
		checkbox.id = id;
		checkbox.type = "checkbox";

		checkbox.checked = task.done;

		const priorityLabel = li.appendChild(document.createElement("label"));
		const select = priorityLabel.appendChild(document.createElement("select"));
		priorityLabel.appendChild(document.createTextNode(" priority"));

		const highOption = select.appendChild(document.createElement("option"));
		highOption.value = "high";
		highOption.textContent = "High";

		const mediumOption = select.appendChild(document.createElement("option"));
		mediumOption.value = "medium";
		mediumOption.textContent = "Medium";

		const lowOption = select.appendChild(document.createElement("option"));
		lowOption.value = "low";
		lowOption.textContent = "Low";

		select.value = task.priority;

		const button = li.appendChild(document.createElement("button"));
		button.classList.add("delete");
		button.type = "button";
		button.textContent = "Delete";
	}

	const done = state.tasks.filter(v => v.done);

	taskProgress.max = state.tasks.length;
	taskProgress.value = done.length;

	taskProgress.textContent = `${Math.round(100 * done.length / state.tasks.length)}%`;
	doneString.textContent = `${done.length}/${state.tasks.length}`;
}

function findTask(id) {
	const old = document.querySelectorAll("li.highlight")
	for (const li of old) {
		li.classList.remove("highlight");
	}

	const task = state.tasks.find(v => v.id == id);
	if (!task) {
		return alert(`Task ${id} not found`);
	}

	const li = document.querySelector(`li:has(#task${id})`);
	li.classList.add("highlight");
	li.scrollIntoView({ behavior: "smooth" });
}

addTaskForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const data = new FormData(addTaskForm);

	const title = data.get("title").trim();
	const priority = data.get("priority");

	if (!title) {
		addTaskFeedback.textContent = "Task cannot be empty";
		return;
	}

	if (!["low", "medium", "high"].includes(priority)) {
		addTaskFeedback.textContent = "Invalid priority";
		return;
	}

	state.tasks.push({
		id: state.tasks.length ? Math.max(...state.tasks.map(v => v.id)) + 1 : 1,
		title,
		priority,
		done: false,
	});

	saveState(state);
	render();
	addTaskForm.reset();
});

// Access in console;
window.findTask = findTask;

render();
