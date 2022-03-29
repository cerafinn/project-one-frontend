const URL = 'http://localhost:8081/reimbursements';


async function resolveStatus() {
  const statusType = ['pending', 'approved', 'denied'];

  if(reimbursement.status === 'pending') {
    let statusInput = document.createElement('input');
    statusInput.setAttribute('type', 'select');

    let statusOption = document.createElement('option');

    for(let i = 1; i < statusType.length + 1; i++) {
      statusOption.setAttribute('value', i);
      statusOption.innerHTML = statusType[i - 1];
      statusInput.appendChild(statusOption);
    };

    let confirmBtn = document.createElement('button');
    confirmBtn.setClass('confirm-btn');
    confirmBtn.innerText = 'Confirm';
  }

  let confirmBtn = document.querySelector('confirm-btn');
  confirmBtn.addEventListener('click', async () => {
    let statusVal = statusOption.value;

    try {
      let res = await fetch(`${URL}/${reimb.id}?/status=${statusVal}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
      });

      if (res.status === 200) {
        populateTable();
      }
    } catch (e) {
      console.log(e)
    }
  })
}


async function populateTable() {
  let res = await fetch(URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}`} 
  })

  if (res.status === 200) {
    let reimbursements = await res.json();
    let tbody = document.querySelector('reimb-table > tbody');

    for (let reimb of reimbursements) {
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerHTML = reimb.id;
      
      let td2 = document.createElement('td');
      td2.innerHTML = reimb.remitAmount;
      
      let td3 = document.createElement('td');
      let receiptImg = document.createElement('img');
      receiptImg.setAttribute('src', `${URL}/${reimb.id}/receipt`);
      receiptImg.style.height = '100px';
      td3.appendChild(receiptImg);
      
      // let td4 = document.createElement('td');
      // td4.innerHTML = reimb.remitSubmitted;
      
      // let td5 = document.createElement('td');
      // td5.innerHTML = reimb.remitResolved;
      
      let td6 = document.createElement('td');
      td6.innerHTML = reimb.remitDescription;
      
      let td7 = document.createElement('td');
      td7.innerHTML = reimb.type;
      
      let td8 = document.createElement('td');
      td8.innerHTML = (reimb.status);
      
      let td9 = document.createElement('td');
      td9.innerHTML = (reimb.employeeFirstName + " " + reimb.employeeLastName);
      
      let td10 = document.createElement('td');    
      td10.innerHTML = (reimb.managerUsername ? (reimb.managerFirstName + " " + reimb.managerLastName) : "Not reviewed");

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
      
      if(!reimb.managerUsername) {
        resolveStatus();
      }

      tbody.appendChild(tr);
    }
  }
}