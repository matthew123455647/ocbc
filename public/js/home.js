function loadBalance() {
    var response = '';
    var request = new XMLHttpRequest();

    request.open('GET', '/balance/' + sessionStorage.getItem("email"), true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        transactions = response.transactions;

        document.getElementById('accountName').innerHTML = "Welcome " + response.name +"!";

        document.getElementById('accountID').innerHTML = "<h5>" + response.type +"<h5>";
        document.getElementById('accountID').innerHTML += "<h5>" + response.id +"<h5>";

        document.getElementById('accountBalance').innerHTML = "<h5>Account Balance: $" + response.balance +"<h5>";
        
        var html = ''
        for (var i = 0; i < transactions.length; i++)
        {
            var cssClass = ""
            var amountSign = ""
            if (transactions[i].type == "W") {
                cssClass = " class = 'withdrawal'";
                amountSign = "-";
            }

            html += '<tr>' +
                '<td>' + transactions[i].datetime + '</td>' +
                '<td>' + transactions[i].desc + '</td>' +
                '<td' + cssClass + '>' + amountSign + transactions[i].amount + '</td>' +
            '</tr>'
        }

        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}

function isFloat(str) {
    return /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(str);
  }

function transferFunds() {
	var response = "";

	var jsonData = new Object();
	jsonData.receiver = document.getElementById("recipient").value;
	jsonData.amount = document.getElementById("amount").value;
	jsonData.desc = document.getElementById("desc").value;
	jsonData.sender = sessionStorage.getItem("email");

    if (jsonData.receiver == "" || jsonData.amount == "" || jsonData.desc == "") {
		document.getElementById("message").innerHTML = 'All fields are required!';
		document.getElementById("message").setAttribute("class", "text-danger");
		return;
	}

    if (!isFloat(jsonData.amount)) {
		document.getElementById("message").innerHTML = 'Amount must be numeric!';
		document.getElementById("message").setAttribute("class", "text-danger");
		return;
	}

    if (jsonData.receiver == jsonData.sender) {
		document.getElementById("message").innerHTML = 'Receiver and sender cannot be the same person!';
		document.getElementById("message").setAttribute("class", "text-danger");
		return;
	}

	var request = new XMLHttpRequest();

	request.open("POST", "/transfer", true);
	request.setRequestHeader('Content-Type', 'application/json');

	request.onload = function () {
		response = JSON.parse(request.responseText);

        if (response.message == "Transfer successful!") {
			document.getElementById("message").innerHTML = 'Transfer successful!';
			document.getElementById("message").setAttribute("class", "text-success");

			window.location.href = 'home.html';
		}
		else {
			document.getElementById("message").innerHTML = 'Unable to transfer funds!';			
			document.getElementById("message").setAttribute("class", "text-danger");
		}
	};

	request.send(JSON.stringify(jsonData));
}

