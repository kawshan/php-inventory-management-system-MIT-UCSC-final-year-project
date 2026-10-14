 async function getAllInvoiceStatuesService() {

     let baseURL = "../../server/controller/InvoiceStatusController.php";
     const response = await fetch(
        `${baseURL}?method=getAllInvoiceStatusesList`
    );

    if (!response.ok) {
        throw new Error("Failed to get invoice statues");
    }

    return await response.json();
}