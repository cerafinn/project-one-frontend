const URL = 'http://localhost:8081/reimbursements';

window.addEventListener('load', (event) => {
  populateTable();
});

async function populateTable() {
  let res = await fetch(URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
  })

  if (res.status === 200) {
    let reimbursements = await res.json();
    let tbody = document.querySelector('#reimb-table > tbody');
    tbody.innerHTML = '';

    for (let reimbursement of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerText = reimbursement.id;
      
      let td2 = document.createElement('td');
      td2.innerText = reimbursement.remitAmount;
      
      let td3 = document.createElement('td');
      let receiptImg = document.createElement('img');
      receiptImg.setAttribute('src', `${URL}/${reimbursement.id}/receipt`);
      receiptImg.style.height = '100px';
      td3.appendChild(receiptImg);
      
      // let td4 = document.createElement('td');
      // td4.innerText = reimbursement.remitSubmitted;
      
      // let td5 = document.createElement('td');
      // td5.innerText = reimbursement.remitResolved;
      
      let td6 = document.createElement('td');
      td6.innerText = reimbursement.remitDescription;
      
      let td7 = document.createElement('td');
      if(reimbursement.status == 1) {
        td7.innerText = "Lodging";
      } else if(reimbursement.status == 2) {
        td7.innerText = "Travel";
      } else if(reimbursement.status == 3) {
        td7.innerText = "Food";
      } else if(reimbursement.status == 4) {
        td7.innerText = "Other";
      } else {
        td7.innerText = "Type of reimbursement not defined";
      }
      
      let td8 = document.createElement('td');
      if(reimbursement.status == 1) {
          td8.innerText = "Pending";
      } else if(reimbursement.status == 2) {
        td8.innerText = "Approved";
      } else if(reimbursement.status == 3) {
        td8.innerText = "Denied";
      } else {
        td8.innerText = "Status not defined";
      }
      // td8.innerText = (reimbursement.status);
      
      let td9 = document.createElement('td');
      td9.innerText = (reimbursement.employeeUsername);
      
      let td10 = document.createElement('td');    
      td10.innerText = (reimbursement.managerUsername ? (reimbursement.managerUsername) : "Not reviewed");

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      // tr.appendChild(td4);
      // tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);
      tr.appendChild(td9);
      tr.appendChild(td10);
      
      let userRole = localStorage.getItem('user_role')
      
      if(!reimbursement.managerUsername) {
        let statusInput = document.createElement('select');
        statusInput.setAttribute('name', 'status');

        let statusOpDefault = document.createElement('option');
        statusOpDefault.setAttribute('selected', "true");
        statusOpDefault.setAttribute('disabled', 'disabled');
        statusOpDefault.innerText = "Select from list";

        let statusOp1 = document.createElement('option');
        statusOp1.setAttribute('value', "2");
        statusOp1.innerText = "Approved";

        let statusOp2 = document.createElement('option');
        statusOp2.setAttribute('value', "3");
        statusOp2.innerText = "Denied";

        statusInput.appendChild(statusOpDefault);
        statusInput.appendChild(statusOp1);
        statusInput.appendChild(statusOp2);

        let confirmBtn = document.createElement('button');
        confirmBtn.innerText = 'Confirm';

        confirmBtn.addEventListener('click', async () => {
          let status = statusInput.value;

          try {
            let res = await fetch(`${URL}/${reimbursement.id}?status=${status}`, {
              method: 'PATCH',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
            });

            if (res.status === 200) {
              populateTable();
            }
          } catch (e) {
            console.log(e);
          }
        });

        tr.appendChild(statusInput);
        tr.appendChild(confirmBtn);
      }

      tbody.appendChild(tr);
    }
  }
}