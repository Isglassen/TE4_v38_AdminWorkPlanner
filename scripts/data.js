const tasks = [
	{ id: 1, title: "Kontrollera inventarielistan för IT-utrustning", done: false },
	{ id: 2, title: "Uppdatera veckans supportstatistik", done: false },
	{ id: 3, title: "Granska nya användarkonton före aktivering", done: false },
	{ id: 4, title: "Kontrollera att mötesrummens skärmar fungerar", done: true },
	{ id: 5, title: "Sammanställa felrapporter från helpdesk", done: false },
	{ id: 6, title: "Arkivera avslutade serviceärenden", done: true },
	{ id: 7, title: "Verifiera backup-loggen från natten", done: false },
	{ id: 8, title: "Uppdatera kontaktlistan för externa leverantörer", done: false },
	{ id: 9, title: "Kontrollera licenser som går ut denna månad", done: false },
	{ id: 10, title: "Förbereda sammanfattning till veckomötet", done: false }
];

export function saveState(state) {

}

export function loadState() {
	return { tasks };
}
