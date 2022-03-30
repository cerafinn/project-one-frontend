const URL = `http://localhost:8081/users/${localStorage.getItem('user_id')}/reimbursements`;

window.addEventListener('load', (event) => {
  populateTable();
});

async function populateTable() {
  let res = await fetch(URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
  })

  if(res.status === 200) {
    let reimbursements = await res.json();
    let tbody = document.createElement('#reimb-table > tbody');
    tbody.remove();

    for(let reimbursement of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerText = reimbursement.id;
      
      let td2 = document.createElement('td');
      td2.innerText = reimbursement.remitAmount;
      
      // let td3 = document.createElement('td');
      // let receiptImg = document.createElement('img');
      // receiptImg.setAttribute('src', `${URL}/${reimbursement.id}/receipt`);
      // receiptImg.style.height = '100px';
      // td3.appendChild(receiptImg);
      
      // let td4 = document.createElement('td');
      // td4.innerText = reimbursement.remitSubmitted;
      
      // let td5 = document.createElement('td');
      // td5.innerText = reimbursement.remitResolved;
      
      let td6 = document.createElement('td');
      td6.innerText = reimbursement.remitDescription;
      
      let td7 = document.createElement('td');
      td7.innerText = reimbursement.type;
      
      let td8 = document.createElement('td');
      td8.innerText = (reimbursement.status);
      
      let td9 = document.createElement('td');
      td9.innerText = (reimbursement.employeeFirstName + " " + reimbursement.employeeLastName);
      
      let td10 = document.createElement('td');    
      td10.innerText = (reimbursement.managerUsername ? (reimbursement.managerFirstName + " " + reimbursement.managerLastName) : "Not reviewed");

      tr.appendChild(td1);
      tr.appendChild(td2);
      // tr.appendChild(td3);
      // tr.appendChild(td4);
      // tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);
      tr.appendChild(td9);
      tr.appendChild(td10);

      tbody.appendChild(tr);
    }
  }
}