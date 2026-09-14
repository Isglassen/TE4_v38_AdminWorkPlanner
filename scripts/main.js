import { saveState, loadState } from "./data.js";

const state = loadState();
const tasksLists = {
	high: document.getElementById("high-tasks"),
	medium: document.getElementById("medium-tasks"),
	low: document.getElementById("low-tasks")
};
const taskProgress = document.getElementById("task-progress");
const doneString = document.getElementById("done-string");

function render() {
	Object.values(tasksLists).forEach(v => v.innerHTML = "");
	for (const task of state.tasks) {
		const li = tasksLists[task.priority].appendChild(document.createElement("li"));
		const label = li.appendChild(document.createElement("label"));
		const checkbox = label.appendChild(document.createElement("input"));
		label.appendChild(document.createTextNode(task.title));

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
	}

	const done = state.tasks.filter(v => v.done);

	taskProgress.max = state.tasks.length;
	taskProgress.value = done.length;

	taskProgress.textContent = `${Math.round(done.length / state.tasks.length)}%`;
	doneString.textContent = `${done.length}/${state.tasks.length}`;
}

render();
