const signupForm = document.getElementById('signup-form');

        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let password = document.getElementById('password').value;
            let confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                displayAlert("Passwords do not match.",1);
                return;
            }
            else if (password.length < 6) {
                displayAlert("Password must be at least 6 characters.",1);
                return;
            }
            else{
                displayAlert("Account created Successfully !",0);
                const username = document.getElementById('username').value;
                localStorage.setItem('username', username);
                setTimeout(function() {
                    window.location.href = "Dashboard.html"; 
                }, 1000);
                return;
            }

            
        });

function displayAlert(message , type){
    let alertContainer = document.querySelector(".alert-status");
    alertContainer.textContent = message ;
    alertContainer.style.visibility = "visible" ;
    if(type == 0){
        alertContainer.classList.toggle("active");
    }
}