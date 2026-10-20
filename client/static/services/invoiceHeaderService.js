async function createInvoiceService(data) {
    let baseURL = "../../server/controller/InvoiceHeaderController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "failed to create Invoice")
    }
    return result;
}


async function getAllInvoiceService() {
    let baseURL = "../../server/controller/InvoiceHeaderController.php";
    const response = await fetch(`${baseURL}?method=findAll`);
    if (!response.ok) {
        throw new Error("Failed to get invoices")
    } else {
        return await response.json();
    }
}


async function deleteInvoiceService(id) {
    let baseURL = "../../server/controller/InvoiceHeaderController.php";
    const response = await fetch(`${baseURL}?method=delete&id=${encodeURIComponent(id)}`,
        {method: "DELETE"}
    );

    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete invoice");
    }

    return result;
}

async function updateInvoiceHeaderService(id,data){
    let baseURL = "../../server/controller/InvoiceHeaderController.php";
    const response = await fetch(`${baseURL}?method=update&id=${encodeURIComponent(id)}`,
        {
            method:"PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
    const result =await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "Failed to Update Invoice")
    }
    return result;



}

