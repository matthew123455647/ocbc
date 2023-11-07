function loadBalance() {
    var response = '';
    var request = new XMLHttpRequest();

    request.open('GET', '/balance/' + sessionStorage.getItem("email"), true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        transactions = response.transactions;

        document.getElementById('accountName').innerHTML = "Welcome " + response.name + "!";
        document.getElementById('accountBalance').innerHTML = "<h5 style='font-size: 40px; color: white;'>Account Balance: $" + response.balance + "</h5";

        var html = '';
        var allWithdrawals = 0;
        var allDeposits = 0;

        var balanceData = [];
        var withdrawalData = [];
        var depositData = [];

        for (var i = 0; i < transactions.length; i++) {
            var cssClass = "";
            var amountSign = "";

            if (transactions[i].type === "W") {
                cssClass = "withdrawal";
                amountSign = "-";
                allWithdrawals += transactions[i].amount;
                withdrawalData.push(transactions[i].amount);
            } else if (transactions[i].type === "D") {
                cssClass = "deposit";
                amountSign = "+";
                allDeposits += transactions[i].amount;
                depositData.push(transactions[i].amount);
            }

            html += '<tr class="' + cssClass + '">';
            html += '<td>' + transactions[i].datetime + '</td>';
            html += '<td>' + transactions[i].desc + '</td>';
            html += '<td class="amount-column ' + cssClass + '">' + amountSign + transactions[i].amount + '</td>';
            html += '</tr>';
            balanceData.push(transactions[i].balance);
        }

        document.getElementById('tableContent').innerHTML = html;

        // Create arrays for the line chart
        var labels = [];
        var balanceData = [];

        for (var i = 0; i < transactions.length; i++) {
            var transactionDate = new Date(transactions[i].datetime);
            var month = transactionDate.toLocaleString('default', { month: 'short' }); // Get the short month name
            labels.push(month);
            balanceData.push(transactions[i].balance);
        }

        // Create a line chart for balance
        var ctx = document.getElementById('lineChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Transaction',
                        borderColor: 'red',
                        data: withdrawalData,
                    },
                    {
                        label: 'Deposit',
                        borderColor: 'green',
                        data: depositData,
                    },
                ],
            },
            options: {
                scales: {
                    x: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        grid: {
                            display: false, // Remove the grid lines on the X-axis
                        },
                    }],
                    y: {
                        beginAtZero: true,
                    },
                    // grid: {
                    //     display: false, // Remove the grid lines on the Y-axis
                    // },
                },
                elements: {
                    line: {
                        fill: false,
                        backgroundColor: 'black', // Set the background color to black
                    },
                },
            },
        });

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