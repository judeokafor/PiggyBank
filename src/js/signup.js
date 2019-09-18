// init Github
const http = new HTTP();
// init UI
const ui = new UI();
function $(value) {
	return document.querySelector(value);
}

$('form').addEventListener(
	'submit',
	async event => {
		try {
			event.preventDefault();
			const email = $('#email').value;
			const password = $('#password').value;
			const confPassword = $('#confPassword').value;
			if ($('form').checkValidity() === false) {
				event.preventDefault();
			}
			if (password !== confPassword) {
				return ui.showAlert('Password does not match', 'alert alert-danger');
			}
			if (!password || !confPassword || !email) {
				return ui.showAlert('Please fill in all fields', 'alert alert-danger');
			} else {
				$('form').classList.add('was-validated');
				const data = {
					email,
					password,
				};
				const existingUser = await http.get(
					`http://localhost:3000/users?email=${data.email}`
				);
				if (existingUser.length !== 0) {
					ui.showAlert('User already exist', 'alert alert-danger');
				} else {
					const result = await http.post('http://localhost:3000/users', data);
					if (result) {
						ui.showAlert('User registered successfully', 'alert alert-success');
						location.href = '../views/signin.html';
					} else {
						ui.showAlert(
							'Error registering user, please try again',
							'alert alert-danger'
						);
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
	false
);
