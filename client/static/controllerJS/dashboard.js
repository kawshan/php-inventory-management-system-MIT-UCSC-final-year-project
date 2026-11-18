window.addEventListener('load', async function () {


    changePassword();

    await checkAuth();
    // console.log(authenticated.user.role_name)
    customizeDashboard();
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


function changePassword() {


    document.getElementById('changePasswordForm').addEventListener('submit', async function (event) {

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

}


async function checkAuth() {
    authenticated = await checkSession();

    if (!authenticated || !authenticated.success) {
        return;
    } else {
        console.log(authenticated);
    }

    const user = authenticated.user;
    console.log(user);
    document.getElementById('welcomeUserName').textContent = user.user_name;
    document.getElementById('welcomeRoleName').textContent = user.role_name;

    document.body.style.display = "block";
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function customizeDashboard() {

    let roleName = authenticated.user.role_name;

    if (roleName == "Admin") {

    } else if (roleName == "Owner") {

    } else if (roleName == "Operation_manager") {
        divInvoice.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divGoodReceiveNoticeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    } else if (roleName == "Delivery_person") {
        divItemCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divItemMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divProduction.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockTransfer.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divInvoice.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockAdjustment.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialCategory.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divGoodReceiveNoticeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divJobMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divIssueNoteMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        // divPurchaseOrder
        divAssetCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssignToPeopleMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divMaintenanceMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divDisposeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divEmployeeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divUserMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    }else if (roleName == "Stock") {
        divItemCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divItemMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divProduction.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockTransfer.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divInvoice.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockAdjustment.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialCategory.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        // divGoodReceiveNoticeMaster
        divJobMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divIssueNoteMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPurchaseOrder.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssignToPeopleMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divMaintenanceMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divDisposeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divEmployeeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divUserMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    }else if (roleName == "Finance") {
        divItemCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divItemMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divProduction.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockTransfer.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divInvoice.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockAdjustment.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialCategory.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divGoodReceiveNoticeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divJobMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divIssueNoteMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPurchaseOrder.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        // divAssetCategoryMaster
        // divAssetMaster
        // divAssignToPeopleMaster
        // divMaintenanceMaster
        // divDisposeMaster
        divEmployeeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divUserMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    }else if (roleName == "Store_manager") {
        divItemCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divItemMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divProduction.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockTransfer.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divInvoice.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockAdjustment.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialCategory.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divGoodReceiveNoticeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divJobMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divIssueNoteMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPurchaseOrder.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssignToPeopleMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divMaintenanceMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divDisposeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divEmployeeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divUserMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    }else if (roleName == "Cashier") {
        divItemCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divItemMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divProduction.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divStockTransfer.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        // divInvoice
        divStockAdjustment.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialCategory.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divRawMaterialMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divGoodReceiveNoticeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divJobMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divIssueNoteMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPurchaseOrder.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetCategoryMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssetMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divAssignToPeopleMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divMaintenanceMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divDisposeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divEmployeeMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divUserMaster.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
        divPrivilege.classList.add('opacity-50','cursor-not-allowed','pointer-events-none');
    }


}