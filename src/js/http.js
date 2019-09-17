/* eslint-disable class-methods-use-this */
class HTTP {
	async get(url) {
		const response = await fetch(url);
		const resData = await response.json();
		return resData;
	}

	async post(url, data) {
		const response = await fetch(url, {
			method: 'POST',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const resData = await response.json();
		return resData;
	}

	async put(url, data) {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const resData = await response.json();
		return resData;
	}

	async delete(url, data) {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const resData = await response.json();
		return resData;
	}
}
