function login() {
	
	var response = "";
	
	var jsonData = new Object();
	jsonData.email = document.getElementById("email").value;
	jsonData.password = document.getElementById("password").value;
	
	if (jsonData.email == "" || jsonData.password == "") {
		document.getElementById("error").innerHTML = 'All fields are required!';
		return;
	} 

	var request = new XMLHttpRequest();
	
	request.open("POST", "/login", true);
	request.setRequestHeader('Content-Type', 'application/json');

	request.onload = function() {
		response = JSON.parse(request.responseText);

		if (response.message == "Login successful!") {
			sessionStorage.setItem("email", jsonData.email)
            window.location.href = 'main.html';
		}
		else {
			alert('Login Unsuccessful')
			document.getElementById("error").innerHTML = 'Invalid credentials!';
		}
	};
	
	request.send(JSON.stringify(jsonData));
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa fa-eye';
    }
}