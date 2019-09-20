/* eslint-disable class-methods-use-this */
class HTTP {
	async get(url) {
		try {
			const response = await fetch(url);
			const resData = await response.json();
			return resData;
		} catch (error) {
			console.log(error);
		}
	}

	async post(url, data) {
		try {
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
		} catch (error) {
			console.log(error);
		}
	}

	async put(url, data) {
		try {
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const resData = await response.json();
			return resData;
		} catch (error) {
			console.log(error);
		}
	}

	async delete(url, data) {
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const resData = await response.json();
			return resData;
		} catch (error) {
			console.log(error);
		}
	}
}
