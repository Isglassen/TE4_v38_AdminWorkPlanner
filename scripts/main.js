import { saveState, loadState } from "./data.js";

const state = loadState();
const tasksList = document.getElementById("tasks");
const taskProgress = document.getElementById("task-progress");
const doneString = document.getElementById("done-string");

function render() {
	tasksList.innerHTML = "";
	for (const task of state.tasks) {
		const li = tasksList.appendChild(document.createElement("li"));
		const label = li.appendChild(document.createElement("label"));
		const checkbox = label.appendChild(document.createElement("input"));
		label.appendChild(document.createTextNode(task.title));

		const id = "task" + task.id;

		label.for = id;
		checkbox.id = id;
		checkbox.type = "checkbox";

		checkbox.checked = task.done;
	}

	const done = state.tasks.filter(v => v.done);

	taskProgress.max = state.tasks.length;
	taskProgress.value = done.length;

	taskProgress.textContent = `${Math.round(done.length / state.tasks.length)}%`;
	doneString.textContent = `${done.length}/${state.tasks.length}`;
}

render();
