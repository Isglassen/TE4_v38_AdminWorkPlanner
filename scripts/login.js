import { getUsers, saveUsers } from './data.js';

// Creates a object that includes a form input, error message box,
// a function to write to that message box, and a validate function which invokes the passed function.
// The passed function has access to this, and should return { value: data } or { error: true };
// The passed function will receive the trimmed input as an argument.
function createFormHanler(id, validator, trim = true) {
	const input = document.getElementById(id);
	const messageBox = document.getElementById(id + '-message');

	if (!input || !messageBox) {
		throw new Error(`Elements with ids "${id}" and "${id}-message" not found.`);
	}

	return {
		input: input,
		messageBox: messageBox,
		write(message = '', error = false) {
			this.messageBox.textContent = message;
			if (error) {
				this.messageBox.classList.add('error');
				this.input.classList.add('error');
			} else {
				this.messageBox.classList.remove('error');
				this.input.classList.remove('error');
			}
		},
		validate() {
			this.write();
			let input = this.input.value;
			if (trim) input = input.trim();
			return this._validate.call(this, input);
		},
		_validate: validator,
	}
}

const accountForm = document.getElementById('account-form');
const loginMessage = document.getElementById('login-message');
const methodSelection = document.getElementById('method-selection');
const methodError = document.getElementById('method-error');

const users = getUsers();

const emailHandler = createFormHanler('email', function (email) {
	if (!email) {
		this.write('Email is required.', true);
		return { error: true };
	}
	if (!email.includes('@')) {
		this.write('Email must contain "@" symbol.', true);
		return { error: true };
	}
	return { value: email };
});

const passwordHandler = createFormHanler('password', function (password) {
	if (!password) {
		this.write("Password is required.", true);
		return { error: true };
	}
	return { value: password };
}, false);

let loginUser;

accountForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const email = emailHandler.validate();
	const password = passwordHandler.validate();

	if (email.error || password.error) {
		return;
	}

	const foundUser = users.find(user => user.email === email.value)
	if (!foundUser || foundUser.password !== password.value) {
		loginMessage.textContent = 'Incorrect email or password';
		return;
	}

	loginMessage.textContent = '';
	loginUser = {
		email: foundUser.email,
		firstName: foundUser.firstName,
	};

	accountForm.parentElement.classList.add('hidden');
	methodSelection.classList.remove('hidden');
});

methodSelection.addEventListener('click', function (event) {
	const el = event.target;
	if (!el.dataset.method) return;

	const method = el.dataset.method;

	if (method !== "2fa") {
		methodError.textContent = 'Verification failed. Only 2FA method is currently supported.';
		return;
	}

	methodError.textContent = '';

	localStorage.setItem('session', JSON.stringify({
		user: loginUser,
		method: method,
		sessionStart: Temporal.Now.instant().epochMilliseconds / 1000,
	}));

	window.location.href = 'index.html';
});
