// init Github
const http = new HTTP();
// init UI
const ui = new UI();
function $(value) {
	return document.querySelector(value);
}

$('form').addEventListener(
	'submit',
	async e => {
		try {
			e.preventDefault();
			const email = $('#email').value;
			const password = $('#password').value;
			if ($('form').checkValidity() === false) {
				e.preventDefault();
			} else {
				$('form').classList.add('was-validated');
				const data = {
					email,
					password,
				};
				const result = await http.get(
					`http://localhost:3000/users?email=${data.email}`
				);
				if (result.length !== 0) {
					if (result[0].password === password) {
						localStorage.setItem('user', JSON.stringify(result[0]));
						ui.showAlert('Login Successfully', 'alert alert-success');
						setTimeout(() => {
							location.href = '../views/dashboard.html';
						}, 3000);
					} else {
						ui.showAlert('Invalid password', 'alert alert-danger');
					}
				} else {
					ui.showAlert(
						'Failed attempt, user does not exist',
						'alert alert-danger'
					);
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
	false
);
