class UI {
	constructor() {}
	// show alert message
	showAlert(message, className) {
		this.clearAlert();
		const div = document.createElement('div');
		div.className = className;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.parent');
		const search = document.querySelector('.children');
		container.insertBefore(div, search);
		setTimeout(() => {
			this.clearAlert();
		}, 3000);
	}
	clearAlert() {
		const currentAlert = document.querySelector('.alert');
		if (currentAlert) {
			currentAlert.remove();
		}
	}
}
