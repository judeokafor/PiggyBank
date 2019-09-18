// init Github
const http = new HTTP();
// init UI
const ui = new UI();
const storedUser = localStorage.getItem('user');
const user = JSON.parse(storedUser);
const userId = parseInt(user.id, 10);
let userAccounts;
function jude(value) {
	return document.querySelector(value);
}
(async function getUserProfile() {
	await getWalletBalance(userId);
	appendSelect('#deposit_account_name');
	appendSelect('#withdraw_account_name');
	await allTransactions();
})();
async function getWalletBalance(userId) {
	try {
		const res = await http.get(
			`http://localhost:3000/accounts?userId=${userId}`
		);
		let walletBalance = 0;
		userAccounts = res;
		console.log(userAccounts);

		res.forEach(res => {
			walletBalance += parseInt(res.account_balance, 10);
		});
		jude('#walletBalance').textContent = walletBalance;
		return walletBalance;
	} catch (error) {
		console.log(error);
	}
}
function appendSelect(selector) {
	const select = jude(selector);
	let option;
	userAccounts.forEach((element, i) => {
		if (selector === '#withdraw_account_name') {
			if (element.account_balance > 0) {
				option = document.createElement('option');
				option.setAttribute('value', element.id);
				option.appendChild(
					document.createTextNode(
						`${element.account_name}  -- ${element.account_number}`
					)
				);
			}
		} else {
			option = document.createElement('option');
			option.setAttribute('value', element.id);
			option.appendChild(
				document.createTextNode(
					`${element.account_name}  -- ${element.account_number}`
				)
			);
		}
		select.appendChild(option);
	});
}
function randHex(len) {
	const maxlen = 8,
		min = Math.pow(16, Math.min(len, maxlen) - 1);
	(max = Math.pow(16, Math.min(len, maxlen)) - 1),
		(n = Math.floor(Math.random() * (max - min + 1)) + min),
		(r = n.toString(16));
	while (r.length < len) {
		r = r + randHex(len - maxlen);
	}
	console.log(r);
	return r;
}
function saveDeposit() {
	typeObject = {
		amountSelector: '#deposit_amount',
		select: '#deposit_account_name',
		transaction_type: 'credit',
		form: '#depositForm',
		modal: '#depositModal',
	};
	transaction(typeObject);
}
function saveWithdrawal() {
	typeObject = {
		amountSelector: '#withdraw_amount',
		select: '#withdraw_account_name',
		transaction_type: 'debit',
		form: '#withdrawForm',
		modal: '#withdrawModal',
	};
	transaction(typeObject);
}
async function transaction(typeObject) {
	// check if amount to withdraw is not less than the amount available -not implemented
	// check for password aunthentication
	try {
		const amount = parseInt(jude(typeObject.amountSelector).value, 10);
		const select = jude(typeObject.select);
		const account_id = select.options[select.selectedIndex].value;
		const account_details = await http.get(
			`http://localhost:3000/accounts/${account_id}`
		);
		account_details.account_balance =
			typeObject.transaction_type === 'credit'
				? parseInt(account_details.account_balance, 10) + amount
				: parseInt(account_details.account_balance, 10) - amount;
		const result = await http.put(
			`http://localhost:3000/accounts/${account_id}`,
			account_details
		);
		if (result) {
			const data = {
				userId,
				amount,
				accountId: account_id,
				transaction_type: typeObject.transaction_type,
				transaction_id: randHex(16),
				date: new Date().toDateString(),
			};
			const transaction = await http.post(
				`http://localhost:3000/transaction`,
				data
			);
			if (transaction) {
				ui.showAlert('transaction success', 'alert alert-success');
				$(document).ready(function() {
					setTimeout(() => {
						$(typeObject.form).trigger('reset');
						$(typeObject.modal).modal('hide');
					}, 3000);
				});
			} else {
				ui.showAlert('Error in Transaction, try again', 'alert alert-danger');
			}
		} else {
			ui.showAlert('Error in transaction, try again', 'alert alert-danger');
		}
	} catch (error) {
		console.log(error);
	}
}
function logout() {
	localStorage.removeItem('user');
	setTimeout(() => {
		location.href = '../views/signin.html';
	}, 1000);
}
function createAccountNumber(account_type) {
	let result = '';
	let acctNumber;
	const myNumber = parseInt(Math.random() * 1000000000, 10);
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	characters.split('').forEach((element, i) => {
		if (i < 2) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
	});
	if (account_type === 'savings') {
		acctNumber = `SV/${result}/${myNumber}`;
	} else {
		acctNumber = `PR/${result}/${myNumber}`;
	}
	return acctNumber;
}
async function createAccount() {
	try {
		const select = jude('#account_type');
		const account_type = select.options[select.selectedIndex].value;
		const account_name = jude('#account_name').value;
		const purpose = jude('#purpose').value;
		const account_number = createAccountNumber(account_type);
		const data = {
			userId,
			account_name,
			purpose,
			account_type,
			account_number,
			account_balance: 0,
		};

		const result = await http.post('http://localhost:3000/accounts', data);
		if (result) {
			ui.showAlert('Account created successfully', 'alert alert-success');
			$(document).ready(function() {
				setTimeout(() => {
					$('#createAccountForm').trigger('reset');
					$('#createModal').modal('hide');
				}, 3000);
			});
		} else {
			ui.showAlert('Error Creating Account, try again', 'alert alert-danger');
		}
	} catch (error) {
		console.log(error);
	}
}
async function allTransactions() {
	try {
		let transactions;
		const res = await http.get('http://localhost:3000/transaction');

		console.log(res);
		const tableBody = jude('#alltransaction');
		tableBody.innerHTML;
	} catch (error) {
		console.log(error);
	}
}
