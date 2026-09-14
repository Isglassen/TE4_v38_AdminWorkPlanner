const tasks = [
	{ id: 1, title: "Kontrollera inventarielistan för IT-utrustning", done: false, priority: "medium" },
	{ id: 2, title: "Uppdatera veckans supportstatistik", done: false, priority: "low" },
	{ id: 3, title: "Granska nya användarkonton före aktivering", done: false, priority: "medium" },
	{ id: 4, title: "Kontrollera att mötesrummens skärmar fungerar", done: true, priority: "high" },
	{ id: 5, title: "Sammanställa felrapporter från helpdesk", done: false, priority: "high" },
	{ id: 6, title: "Arkivera avslutade serviceärenden", done: true, priority: "low" },
	{ id: 7, title: "Verifiera backup-loggen från natten", done: false, priority: "high" },
	{ id: 8, title: "Uppdatera kontaktlistan för externa leverantörer", done: false, priority: "high" },
	{ id: 9, title: "Kontrollera licenser som går ut denna månad", done: false, priority: "medium" },
	{ id: 10, title: "Förbereda sammanfattning till veckomötet", done: false, priority: "medium" }
];

export function saveState(state) {
	localStorage.setItem("state", JSON.stringify(state));
}

export function loadState({ reset } = { reset: false }) {
	const data = JSON.parse(localStorage.getItem("state")) ?? { tasks };

	if (reset ?? false) {
		return { tasks }
	}

	return data;
}
