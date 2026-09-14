import { saveState, loadState } from "./data.js";

const state = loadState();
const tasksList = document.getElementById("tasks");

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
}

render();
