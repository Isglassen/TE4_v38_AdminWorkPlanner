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
const profileForm = document.getElementById('profile-form');
const confirmForm = document.getElementById('confirmation-form');

const confirmName = document.getElementById('confirm-name');
const confirmEmail = document.getElementById('confirm-email');
const confirmAge = document.getElementById('confirm-age');

const confirmationMessage = document.getElementById('confirmation-message');

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
	if (users.some(user => user.email === email)) {
		this.write('This email is already registered.', true);
		return { error: true };
	}
	return { value: email };
});

const passwordHandler = createFormHanler('password', function (password) {
	if (!password) {
		this.write("Password is required.", true);
		return { error: true };
	}
	if (password.length < 8) {
		this.write('Password must be at least 8 characters long.', true);
		return { error: true };
	}
	return { value: password };
}, false);

const confirmPasswordHandler = createFormHanler('confirm-password', function (confirmPassword) {
	if (!confirmPassword) {
		this.write("Please confirm your password.", true);
		return { error: true };
	}
	if (passwordHandler.input.value.trim() !== confirmPassword) {
		this.write('Passwords do not match.', true);
		return { error: true };
	}
	return { value: confirmPassword };
}, false);

const firstNameHandler = createFormHanler('first-name', function (firstName) {
	if (!firstName) {
		this.write('First name is required.', true);
		return { error: true };
	}
	if (firstName.length < 2) {
		this.write('First name must be at least 2 characters long.', true);
		return { error: true };
	}
	return { value: firstName };
});

const lastNameHandler = createFormHanler('last-name', function (lastName) {
	if (!lastName) {
		this.write('Last name is required.', true);
		return { error: true };
	}
	if (lastName.length < 2) {
		this.write('Last name must be at least 2 characters long.', true);
		return { error: true };
	}
	return { value: lastName };
});

const ageHandler = createFormHanler('age', function (age) {
	if (!age) {
		this.write('Age is required.', true);
		return { error: true };
	}
	const ageNumber = parseInt(age, 10);
	if (isNaN(ageNumber)) {
		this.write('Age must be a number.', true);
		return { error: true };
	}
	if (ageNumber < 18) {
		this.write('You must be at least 18 years old.', true);
		return { error: true };
	}
	if (ageNumber > 120) {
		this.write('Age must be less than or equal to 120.', true);
		return { error: true };
	}
	return { value: ageNumber };
});

let accountFormResult, profileFormResult;

accountForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const email = emailHandler.validate();
	const password = passwordHandler.validate();
	const passwordConfirm = confirmPasswordHandler.validate();

	if (email.error || password.error || passwordConfirm.error) {
		return;
	}

	accountFormResult = {
		email: email.value,
		password: password.value,
	};

	accountForm.parentElement.classList.add('hidden');
	profileForm.parentElement.classList.remove('hidden');
});

profileForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const firstName = firstNameHandler.validate();
	const lastName = lastNameHandler.validate();
	const age = ageHandler.validate();

	if (firstName.error || lastName.error || age.error) {
		return;
	}

	profileFormResult = {
		firstName: firstName.value,
		lastName: lastName.value,
		age: age.value,
	}

	profileForm.parentElement.classList.add('hidden');
	confirmForm.parentElement.classList.remove('hidden');

	confirmName.textContent = `${profileFormResult.firstName} ${profileFormResult.lastName}`;
	confirmEmail.textContent = accountFormResult.email;
	confirmAge.textContent = profileFormResult.age;
});

confirmForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const newUser = {
		...accountFormResult,
		...profileFormResult,
	};

	if (users.some(user => user.email === newUser.email)) {
		confirmationMessage.textContent = 'This email is already registered. Enter a different email';
		confirmationMessage.classList.add('error');
		return;
	}

	confirmationMessage.classList.remove('error');

	users.push(newUser);
	saveUsers(users);

	localStorage.setItem('session', JSON.stringify({
		user: {
			email: newUser.email,
			firstName: newUser.firstName,
		},
		sessionStart: Temporal.Now.instant().epochMilliseconds / 1000,
		method: "creation"
	}));

	confirmationMessage.textContent = 'Signup successful! Redirecting to home page...';

	setTimeout(() => {
		window.location.href = 'index.html';
	}, 1000);
});
