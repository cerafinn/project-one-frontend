const prefixURL = 'http://localhost:8081/reimbursements';
let URL = prefixURL;

window.addEventListener('load', (event) => {
  populateTable();
});

let filter = document.querySelector('#filter');
filter.addEventListener('change', (event) => {
  populateTable();
});

async function populateTable() {
  let filterValue = filter.value;

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
    let tbody = document.querySelector('#reimb-table > tbody');
    tbody.innerHTML = '';

    for (let reimbursement of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerText = reimbursement.id;
      
      let td2 = document.createElement('td');
      td2.innerText = reimbursement.remitAmount;
      
      let td3 = document.createElement('td');
      let formatSubmitted = moment(reimbursement.remitSubmitted).format('hh:mm A YYYY-MM-DD');
      td3.innerText = formatSubmitted;

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
      // td8.innerText = (reimbursement.status);
      
      let td8 = document.createElement('td');
      td8.innerText = (reimbursement.employeeFirstName + " " + reimbursement.employeeLastName);
      
      let td9 = document.createElement('td');    
      td9.innerText = (reimbursement.managerUsername ? (reimbursement.managerFirstName + " " +reimbursement.managerLastName) : "Not reviewed");

      let td10 = document.createElement('td');
      let receiptImg = document.createElement('img');
      receiptImg.setAttribute('src', `${prefixURL}/${reimbursement.id}/receipt`);
      receiptImg.style.height = '100px';
      td10.appendChild(receiptImg);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);
      // tr.appendChild(td4);
      // tr.appendChild(td5);
      tr.appendChild(td9);
      tr.appendChild(td10);
      
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
            let res = await fetch(`${prefixURL}/${reimbursement.id}?status=${status}`, {
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