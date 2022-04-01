const prefixURL = `http://localhost:8081/users/${localStorage.getItem('user_id')}/reimbursements`;

window.addEventListener('load', (event) => {
  populateTable();
});

let submitReimbursement = document.querySelector('#reimb-submit');

submitReimbursement.addEventListener('click', async () => {
  let reimbAmount = document.querySelector('#reimb-form-amount').value;
  let reimbDescription = document.querySelector('#reimb-form-description').value;
  let reimbType = document.querySelector('#reimb-form-type').value;
  let reimbReceipt = document.querySelector('#reimb-form-receipt').files[0];
  
  let formData = new FormData();
  formData.append('remitAmount', reimbAmount);
  formData.append('remitDescription', reimbDescription);
  formData.append('remitType', reimbType);
  formData.append('receipt', reimbReceipt);

  try {
    let res = await fetch(`http://localhost:8081/users/${localStorage.getItem('user_id')}/reimbursements`, {
      method: 'POST',
      body: formData,
      headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
    })
    populateTable();
  } catch (e) {
    console.log(e);
  }
});

let filter = document.querySelector('#filter');
filter.addEventListener('change', (event) => {
  populateTable();
});

async function populateTable() {
  let filterValue = filter.value;
  console.log(filterValue);

  if (filterValue == 0) {
    URL = prefixURL;
  } else if (filterValue !== 0) {
    URL = prefixURL + '?status=' + filterValue;
  } else {
    URL = prefixURL;
  }

  let res = await fetch(URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
  })

  if (res.status === 200) {
    let reimbursements = await res.json();
    let tbody = document.querySelector('#e-reimb-table > tbody');
    tbody.innerHTML = '';

    for (let reimbursement of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerText = reimbursement.id;

      let td2 = document.createElement('td');
      td2.innerText = reimbursement.remitAmount;

      let td3 = document.createElement('td');
      let formatSubmitted = moment(reimbursement.remitSubmitted).format('hh:mm A YYYY-MM-DD');
      td3.innerText = remitSubmitted;

      let td4 = document.createElement('td');
      let formatResolved;
      if (reimbursement.remitResolved !== null) {
        formatResolved = moment(reimbursement.remitResolved).format('hh:mm A YYYY-MM-DD');
      };
      td4.innerText = (reimbursement.remitResolved ? formatResolved : "Pending review");

      let td5 = document.createElement('td');
      td5.innerText = reimbursement.remitDescription;

      let td6 = document.createElement('td');
      if(reimbursement.status == 1) {
        td6.innerText = "Lodging";
      } else if(reimbursement.status == 2) {
        td6.innerText = "Travel";
      } else if(reimbursement.status == 3) {
        td6.innerText = "Food";
      } else if(reimbursement.status == 4) {
        td6.innerText = "Other";
      } else {
        td6.innerText = "Type of reimbursement not defined";
      }

      let td7 = document.createElement('td');
      if(reimbursement.status == 1) {
        td7.innerText = "Pending";
      } else if(reimbursement.status == 2) {
        td7.innerText = "Approved";
      } else if(reimbursement.status == 3) {
        td7.innerText = "Denied";
      } else {
        td7.innerText = "Status not defined";
      }
      
      let td8 = document.createElement('td');
      td8.innerText = (reimbursement.employeeFirstName + " " + reimbursement.employeeLastName);
      
      let td9 = document.createElement('td');    
      td9.innerText = (reimbursement.managerUsername ? (reimbursement.managerFirstName + " " +reimbursement.managerLastName) : "Not reviewed");

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      // tr.appendChild(td3);
      // tr.appendChild(td4);
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