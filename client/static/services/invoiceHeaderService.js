async function createInvoiceService(data){
    let baseURL = "../../server/controller/InvoiceHeaderController.php";
    const response = await fetch(`${baseURL}?method=create`,
        {method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    const result = await response.json();
    if (!response.ok || !result.success){
        throw new Error(result.message || "failed to create Invoice")
    }
return result;
}