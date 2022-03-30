const URL = `http://localhost:8081/users/${localStorage.getItem('user_id')}/reimbursements`;

window.addEventListener('load', (event) => {
  populateTable();
});

let submitReimbursement = document.querySelector('#reimb-form-submit');

submitReimbursement.addEventListener('click', async () => {
  let reimbAmount = document.querySelector('#reimb-form-amount');
  let reimbDescription = document.querySelector('#reimb-form-description');
  let reimbType = document.querySelector('#reimb-form-type');
  let reimbReceipt = document.querySelector('reimb-form-receipt');


  let formData = new FormData();
  formData.append('remitAmount', reimbAmount);
  formData.append('remitDescription', reimbDescription);
  formData.append('remitType', reimbType);
  formData.append('receipt', reimbReceipt);

  try {
    let res = await fetch(URL, {
      method: 'POST',
      body: formData,
      headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    })
  } catch (e) {
    console.log(e);
  }
})

async function populateTable() {
  let res = await fetch(URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
  })

  if (res.status === 200) {
    let reimbursements = await res.json();
    let tbody = document.querySelector('#e-reimb-table > tbody');

    for (let reimbursement of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerText = reimbursement.id;

      let td2 = document.createElement('td');
      td2.innerText = reimbursement.remitAmount;

      // let td3 = document.createElement('td');
      // td3.innerText = reimbursement.remitSubmitted;

      // let td4 = document.createElement('td');
      // td4.innerText = reimbursement.remitResolved;

      let td5 = document.createElement('td');
      td5.innerText = reimbursement.remitDescription;

      let td6 = document.createElement('td');
      td6.innerText = reimbursement.type;

      let td7 = document.createElement('td');
      td7.innerText = (reimbursement.status);
      
      let td8 = document.createElement('td');
      td9.innerText = (reimbursement.employeeFirstName + " " + reimbursement.employeeLastName);
      
      let td9 = document.createElement('td');    
      td10.innerText = (reimbursement.managerUsername ? (reimbursement.managerFirstName + " " +reimbursement.managerLastName) : "Not reviewed");

      tr.appendChild(td1);
      tr.appendChild(td2);
      // tr.appendChild(td3);
      // tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);
      tr.appendChild(td9);

      let td10 = document.createElement('td');
      let receiptImg = document.createElement('img');
      receiptImg.setAttribute('src', `http://localhost:8081/reimbursements/${reimbursement.id}/receipt`);
      receiptImg.style.height = '100px';
      td10.appendChild(receiptImg);
      tr.appendChild(td10);

      tbody.appendChild(tr);
    }
  }
}