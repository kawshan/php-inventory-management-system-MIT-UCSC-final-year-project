async function getAllPaymentTypeService() {

    let baseURL = "../../server/controller/PaymentTypeController.php";
    const response = await fetch(
        `${baseURL}?method=getAllPaymentTypes`
    );

    if (!response.ok) {
        throw new Error("Failed to get payment types");
    }

    return await response.json();
}