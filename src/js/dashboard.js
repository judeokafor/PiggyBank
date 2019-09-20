// init Github
const http = new HTTP();
// init UI
const ui = new UI();
const storedUser = localStorage.getItem('user');
const user = JSON.parse(storedUser);
const userId = parseInt(user.id, 10);
let userAccounts;
let acctIdToUpdate;
function jude(value) {
	return document.querySelector(value);
}
(async function getUserProfile() {
	await getWalletBalance(userId);
	appendSelect('#deposit_account_name');
	appendSelect('#withdraw_account_name');
	appendSelect('#update_account_type');
})();
async function getWalletBalance(userId) {
	try {
		const res = await http.get(
			`http://localhost:3000/accounts?userId=${userId}`
		);
		let walletBalance = 0;
		userAccounts = res;
		console.log('accounts', res);
		res.forEach(element => {
			walletBalance += parseInt(element.account_balance, 10);
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
	try {
		const amount = parseInt(jude(typeObject.amountSelector).value, 10);
		const select = jude(typeObject.select);
		const account_id = select.options[select.selectedIndex].value;
		const account_details = await http.get(
			`http://localhost:3000/accounts/${account_id}`
		);
		if (
			typeObject.transaction_type === 'debit' &&
			amount < parseInt(account_details.account_balance, 10)
		) {
			return ui.showAlert('Exceed account balance', 'alert alert-danger');
		}
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
				accountId: parseInt(account_id),
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
			createdAt: new Date().toLocaleString(),
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
async function allTransactions(type) {
	try {
		let tableBody;
		let url;

		switch (type) {
			case 'all':
				url = `http://localhost:3000/transaction?userId=${userId}&&_expand=account`;
				tableBody = jude('#alltransaction');
				break;
			case 'credit':
				url = `http://localhost:3000/transaction?userId=${userId}&&transaction_type=credit&&_expand=account`;
				tableBody = jude('#creditTransaction');
				break;
			case 'debit':
				url = `http://localhost:3000/transaction?userId=${userId}&&transaction_type=debit&&_expand=account`;
				tableBody = jude('#debitTransaction');
				break;

			default:
				break;
		}
		const res = await http.get(url);
		tableBody.innerHTML = '';
		res.forEach(element => {
			tableBody.innerHTML += `<tr>
      <td scope="row">${element.transaction_id}</td>
      <td>${element.account.account_name}</td>
      <td class="${
				element.transaction_type === 'debit' ? 'text-danger' : 'text-success'
			}">${element.transaction_type}</td>
      <td class="${
				element.transaction_type === 'debit' ? 'text-danger' : 'text-success'
			}">&#8358; ${element.amount}</td>
      <td>${element.date}</td>
      <td id="${element.id}">
        <i class="far fa-trash-alt clickable text-danger" data-toggle="tooltip" data-placement="right"
          title="Delete Transaction" onclick = "deleteTransaction(${
						element.id
					})" ></i>
      </td>
    </tr>`;
		});
	} catch (error) {
		console.log(error);
	}
}
function viewAllAccounts() {
	let newBalance = 0;
	const tableBody = jude('#allaccount');
	tableBody.innerHTML = '';
	userAccounts.forEach((element, i) => {
		newBalance += parseInt(element.account_balance, 10);
		tableBody.innerHTML += `<tr>
		  <td scope="row">${i + 1}</td>
		  <td>${element.account_name}</td>
		  <td>${element.account_number}</td>
		  <td class="${
				element.account_type === 'savings' ? 'text-info' : 'text-warning'
			}">${element.account_type}</td>
		  <td>${element.purpose}</td>
		  <td> &#8358; ${element.account_balance}</td>
		  <td>${element.createdAt}</td>
		  <td id="${element.id}">
		    <i class="far fa-trash-alt clickable text-danger" data-toggle="tooltip" data-placement="right"
		      title="Delete Acount" onclick = "deleteAccount(${element.id})" ></i>
		  </td>
		</tr>`;
	});
	jude('#total').textContent = newBalance;
}
async function deleteTransaction(id) {
	try {
		const res = await http.delete(`http://localhost:3000/transaction/${id}`);
		console.log(res, 'deleted res');
		ui.showAlert('deleted!!!', 'alert alert-success');
		allTransactions('all');
		allTransactions('credit');
		allTransactions('debit');
		$(document).ready(function() {
			setTimeout(() => {
				$('#transactionModal').modal('hide');
			}, 3000);
		});
	} catch (error) {
		console.log(error);
	}
}
async function deleteAccount(id) {
	try {
		const res = await http.delete(`http://localhost:3000/accounts/${id}`);
		console.log(res, 'deleted res');
		ui.showAlert('deleted!!!', 'alert alert-success');
		viewAllAccounts();
		$(document).ready(function() {
			setTimeout(() => {
				$('#viewAcctModal').modal('hide');
			}, 3000);
		});
	} catch (error) {
		console.log(error);
	}
}
jude('#update_account_type').addEventListener('change', function openEditPanel(
	e
) {
	e.preventDefault();
	acctIdToUpdate = e.target.value;
	const presentAcct = userAccounts.find(
		acct => parseInt(acct.id, 10) === parseInt(acctIdToUpdate, 10)
	);
	const acctName = jude('#update_account_name');
	const acctPurpose = jude('#update_purpose');
	acctName.value = presentAcct.account_name;
	acctPurpose.value = presentAcct.purpose;

	jude('#partial-display').classList.remove('d-none');
});
async function updateAcct() {
	console.log('acct to update', acctIdToUpdate);
	const presentAcct = userAccounts.find(
		acct => parseInt(acct.id, 10) === parseInt(acctIdToUpdate, 10)
	);
	const data = {
		...presentAcct,
		purpose: jude('#update_account_name').value,
		account_name: jude('#update_purpose').value,
	};
	const res = await http.put(
		`http://localhost:3000/accounts/${acctIdToUpdate}`,
		data
	);
	console.log(res);
}
