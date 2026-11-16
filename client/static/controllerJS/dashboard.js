window.addEventListener('load',async function (){








    const authenticated = await checkSession();

    if (!authenticated || !authenticated.success) {
        return;
    }else{
        console.log(authenticated);
    }

    const user = authenticated.user;
    console.log(user);
    document.getElementById('welcomeUserName').textContent = user.user_name;
    document.getElementById('welcomeRoleName').textContent = user.role_name;

    document.body.style.display = "block";
    updateDateTime();
    setInterval(updateDateTime, 1000);





//

    document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {

        event.preventDefault();

        const data = {

            current_password: document.getElementById('currentPassword').value,

            new_password: document.getElementById('newPassword').value,

            confirm_password: document.getElementById('confirmPassword').value

        };

        try {

            const response = await changePasswordService(data);

            if (response.success) {

                alert(response.message);

                closeChangePasswordModal();

            } else {

                alert(response.message);

            }

        } catch (error) {

            console.error("Change password error:", error);

            alert("Something went wrong!");

        }

    });


})


function updateDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    document.getElementById('currentDate').textContent = date;
    document.getElementById('currentTime').textContent = time;
}

function toggleCard(cardId) {

    const card = document.getElementById(cardId);

    card.classList.toggle('hidden');

}





async function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    try {

        const response = await logoutService();

        if (response.success) {

            window.location.href = "login.html";

        } else {

            alert("Unable to logout. Please try again.");

        }

    } catch (error) {

        console.error("Logout error:", error);

        alert("Something went wrong while logging out.");

    }
}





function openChangePasswordModal() {

    const modal = document.getElementById('changePasswordModal');
    const content = document.getElementById('changePasswordModalContent');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Small delay for opening animation
    setTimeout(() => {

        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');

    }, 10);

}


function closeChangePasswordModal() {

    const modal = document.getElementById('changePasswordModal');
    const content = document.getElementById('changePasswordModalContent');

    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {

        modal.classList.remove('flex');
        modal.classList.add('hidden');

        document.getElementById('changePasswordForm').reset();

    }, 300);

}








