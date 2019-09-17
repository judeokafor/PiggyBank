async function jude() {
	try {
		const response = await fetch('http://localhost:3000/users');
		const res = await response.json();
		console.log(res);
	} catch (error) {
		console.log(error);
	}
}

jude();
