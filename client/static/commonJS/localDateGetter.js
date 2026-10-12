function getMysqlDateTime(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');


    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


//In JavaScript, the getMonth() method is zero-indexed.
// This means that months are counted from 0 to 11 instead of 1 to 12:
//pad start just put 0 in front and ensure 2 digit number for days like 1 -> 01