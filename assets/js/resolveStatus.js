function resolveStatus() {
  const statusType = ['pending', 'approved', 'denied'];

  if(reimbursement.status === 'pending') {
    let statusInput = document.createElement('input');
    statusInput.setAttribute('type', 'select');
  }
}