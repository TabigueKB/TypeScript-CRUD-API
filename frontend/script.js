const API = 'http://localhost:4000';

/* ===== CURRENT SESSION ===== */
window.currentAccount = null;

/* ===== API HELPERS ===== */
async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) { const e = await res.json(); throw e.message || 'API error'; }
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw data.message || 'API error';
  return data;
}
async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw data.message || 'API error';
  return data;
}
async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw data.message || 'API error';
  return data;
}

/* ===== NAVIGATION ===== */
function navigateTo(sectionId) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.add('d-none'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('d-none');

  if (sectionId === 'profile' && window.currentAccount) {
    document.getElementById('profileName').textContent = `${window.currentAccount.firstname} ${window.currentAccount.lastname}`;
    document.getElementById('profileEmail').textContent = window.currentAccount.email;
    document.getElementById('profileRole').textContent = window.currentAccount.role;
  }
  if (sectionId === 'employees') renderEmployees();
  if (sectionId === 'requests') renderRequests();
  if (sectionId === 'accounts') renderAccounts();
  if (sectionId === 'departments') renderDepartments();
}

/* ===== USER DROPDOWN ===== */
function showUserDropdown(account) {
  window.currentAccount = account;
  const authLinks = document.getElementById('authLinks');
  authLinks.innerHTML = `
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown">
        ${account.role === 'Admin' ? 'Admin' : account.firstname}
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#" onclick="navigateTo('profile')">Profile</a></li>
        <li><a class="dropdown-item" href="#" onclick="navigateTo('requests')">My Requests</a></li>
        ${account.role === 'Admin' ? `
          <li><a class="dropdown-item" href="#" onclick="navigateTo('employees')">Employees</a></li>
          <li><a class="dropdown-item" href="#" onclick="navigateTo('accounts')">Accounts</a></li>
          <li><a class="dropdown-item" href="#" onclick="navigateTo('departments')">Departments</a></li>
        ` : ''}
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Logout</a></li>
      </ul>
    </li>`;
}

function logout() {
  window.currentAccount = null;
  document.getElementById('authLinks').innerHTML = `
    <li class="nav-item"><a class="nav-link" href="#" onclick="navigateTo('login')">Login</a></li>
    <li class="nav-item"><a class="nav-link" href="#" onclick="navigateTo('register')">Register</a></li>`;
  navigateTo('home');
}

/* ===== EMPLOYEES ===== */
async function renderEmployees() {
  const tableBody = document.getElementById('employeesTableBody');
  if (!tableBody) return;
  try {
    const employees = await apiGet('/employees');
    tableBody.innerHTML = employees.length === 0
      ? `<tr><td colspan="6" class="text-center">No employees.</td></tr>`
      : employees.map(emp => `
          <tr>
            <td>${emp.empId}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.position}</td>
            <td>${emp.department}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editEmployee(${emp.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button>
            </td>
          </tr>`).join('');
  } catch (err) { tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${err}</td></tr>`; }
}

async function editEmployee(id) {
  try {
    const emp = await apiGet(`/employees/${id}`);
    document.getElementById('empId').value = emp.empId;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empPosition').value = emp.position;
    document.getElementById('empDepartment').value = emp.department;
    document.getElementById('empHireDate').value = emp.hireDate;
    document.getElementById('empForm').dataset.editId = id;
  } catch (err) { alert(err); }
}

async function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  try {
    await apiDelete(`/employees/${id}`);
    renderEmployees();
  } catch (err) { alert(err); }
}

async function saveEmployee() {
  const empId = document.getElementById('empId').value.trim();
  const name = document.getElementById('empName').value.trim();
  const email = document.getElementById('empEmail').value.trim();
  const position = document.getElementById('empPosition').value.trim();
  const department = document.getElementById('empDepartment').value;
  const hireDate = document.getElementById('empHireDate').value;

  if (!empId || !name || !email || !position || !department || !hireDate) {
    alert('Please fill in all fields.'); return;
  }
  const form = document.getElementById('empForm');
  const editId = form.dataset.editId;
  try {
    if (editId) {
      await apiPut(`/employees/${editId}`, { empId, name, email, position, department, hireDate });
      form.dataset.editId = '';
    } else {
      await apiPost('/employees', { empId, name, email, position, department, hireDate });
    }
    renderEmployees();
    form.reset();
  } catch (err) { alert(err); }
}

/* ===== DEPARTMENTS ===== */
async function renderDepartments() {
  const tableBody = document.getElementById('departmentsTableBody');
  if (!tableBody) return;
  try {
    const depts = await apiGet('/departments');
    tableBody.innerHTML = depts.length === 0
      ? `<tr><td colspan="3" class="text-center">No departments.</td></tr>`
      : depts.map(dept => `
          <tr>
            <td>${dept.name}</td>
            <td>${dept.description || '-'}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editDepartment(${dept.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteDepartment(${dept.id})">Delete</button>
            </td>
          </tr>`).join('');
    updateDepartmentDropdown(depts);
  } catch (err) { tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">${err}</td></tr>`; }
}

async function addDepartment() {
  const name = prompt('Enter Department Name:');
  if (!name) return;
  const description = prompt('Enter Department Description:');
  if (description === null || !description.trim()) {
    alert('Description is required.');
    return;
  }
  try {
    await apiPost('/departments', { name, description: description.trim() });
    renderDepartments();
  } catch (err) { alert(err); }
}

async function editDepartment(id) {
  try {
    const dept = await apiGet(`/departments/${id}`);
    const newName = prompt('Edit department name:', dept.name);
    if (newName === null || !newName.trim()) return;
    const newDescription = prompt('Edit department description:', dept.description || '');
    if (newDescription === null || !newDescription.trim()) {
      alert('Description is required.');
      return;
    }
    await apiPut(`/departments/${id}`, { name: newName.trim(), description: newDescription.trim() });
    renderDepartments();
  } catch (err) { alert(err); }
}

async function deleteDepartment(id) {
  if (!confirm('Delete this department?')) return;
  try {
    await apiDelete(`/departments/${id}`);
    renderDepartments();
  } catch (err) { alert(err); }
}

function updateDepartmentDropdown(depts) {
  const dropdown = document.getElementById('empDepartment');
  if (!dropdown) return;
  dropdown.innerHTML = `<option value="">Select Department</option>` +
    depts.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('');
}

/* ===== ACCOUNTS ===== */
async function renderAccounts() {
  const tableBody = document.getElementById('accountsTableBody');
  if (!tableBody) return;
  try {
    const accounts = await apiGet('/accounts');
    tableBody.innerHTML = accounts.map(acc => `
      <tr>
        <td>${acc.firstname} ${acc.lastname}</td>
        <td>${acc.email}</td>
        <td>${acc.role}</td>
        <td>${acc.verified ? '✔' : '✖'}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editAccount(${acc.id})">Edit</button>
          <button class="btn btn-sm btn-warning" onclick="resetPassword(${acc.id})">Reset Password</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAccount(${acc.id})">Delete</button>
        </td>
      </tr>`).join('');
  } catch (err) { if (tableBody) tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err}</td></tr>`; }
}

async function saveAccount(e) {
  e.preventDefault();
  const id = document.getElementById('accountIndex').value;
  const firstname = document.getElementById('accFirstName').value.trim();
  const lastname = document.getElementById('accLastName').value.trim();
  const email = document.getElementById('accEmail').value.trim();
  const password = document.getElementById('accPassword').value.trim();
  const role = document.getElementById('accRole').value;
  const verified = document.getElementById('accVerified').checked;

  if (!firstname || !lastname || !email) { alert('Please fill all fields.'); return; }
  try {
    const body = { firstname, lastname, email, role, verified };
    if (password) body.password = password;
    if (id) {
      await apiPut(`/accounts/${id}`, body);
    } else {
      if (!password) { alert('Password required for new accounts.'); return; }
      await apiPost('/accounts', { ...body, password });
    }
    renderAccounts();
    resetAccountForm();
  } catch (err) { alert(err); }
}

async function editAccount(id) {
  try {
    const acc = await apiGet(`/accounts/${id}`);
    document.getElementById('accountIndex').value = acc.id;
    document.getElementById('accFirstName').value = acc.firstname;
    document.getElementById('accLastName').value = acc.lastname;
    document.getElementById('accEmail').value = acc.email;
    document.getElementById('accPassword').value = '';
    document.getElementById('accRole').value = acc.role;
    document.getElementById('accVerified').checked = acc.verified;
  } catch (err) { alert(err); }
}

async function deleteAccount(id) {
  if (!confirm('Delete this account?')) return;
  try {
    await apiDelete(`/accounts/${id}`);
    renderAccounts();
  } catch (err) { alert(err); }
}

async function resetPassword(id) {
  const password = prompt('Enter new password:');
  if (!password) return;
  try {
    await apiPut(`/accounts/${id}`, { password });
    alert('Password has been reset.');
  } catch (err) { alert(err); }
}

function resetAccountForm() {
  document.getElementById('accountForm').reset();
  document.getElementById('accountIndex').value = '';
}

/* ===== REQUESTS ===== */
function addItemField(name = '', qty = 1) {
  const container = document.getElementById('itemsContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'd-flex mb-2';
  div.innerHTML = `
    <input type="text" class="form-control me-2 item-name" placeholder="Item name" value="${name}">
    <input type="number" class="form-control me-2 item-qty" style="width:90px" min="1" value="${qty}">
    <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(div);
}

async function renderRequests() {
  const tableBody = document.getElementById('requestsTableBody');
  if (!tableBody || !window.currentAccount) return;

  const actionHeader = document.getElementById('requestActionHeader');
  if (window.currentAccount.role === 'Admin') actionHeader.classList.remove('d-none');
  else actionHeader.classList.add('d-none');

  try {
    let requests;
    if (window.currentAccount.role === 'Admin') {
      requests = await apiGet('/requests');
    } else {
      requests = await apiGet(`/requests/my/${encodeURIComponent(window.currentAccount.email)}`);
    }

    if (requests.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No requests yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = requests.map(req => {
      const items = typeof req.items === 'string' ? JSON.parse(req.items) : req.items;
      const itemsText = items.map(i => `${i.name} (${i.qty})`).join(', ');
      const badgeMap = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };
      const badge = badgeMap[req.status] || 'secondary';
      return `
        <tr>
          <td>${req.date}</td>
          <td>${req.type}</td>
          <td>${itemsText}</td>
          <td><span class="badge bg-${badge}">${req.status}</span></td>
          ${window.currentAccount.role === 'Admin' ? `
            <td>
              <button class="btn btn-sm btn-success" onclick="approveRequest(${req.id})">Approve</button>
              <button class="btn btn-sm btn-danger" onclick="rejectRequest(${req.id})">Reject</button>
            </td>` : ''}
        </tr>`;
    }).join('');
  } catch (err) { tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err}</td></tr>`; }
}

async function approveRequest(id) {
  try { await apiPut(`/requests/${id}/approve`, {}); renderRequests(); } catch (err) { alert(err); }
}
async function rejectRequest(id) {
  try { await apiPut(`/requests/${id}/reject`, {}); renderRequests(); } catch (err) { alert(err); }
}

async function saveRequest(e) {
  e.preventDefault();
  if (!window.currentAccount) { alert('You must be logged in.'); return; }
  const type = document.getElementById('requestType').value;
  if (!type) { alert('Please select request type.'); return; }

  const itemNames = document.querySelectorAll('.item-name');
  const itemQtys = document.querySelectorAll('.item-qty');
  const items = [];
  for (let i = 0; i < itemNames.length; i++) {
    const name = itemNames[i].value.trim();
    const qty = parseInt(itemQtys[i].value);
    if (name && qty > 0) items.push({ name, qty });
  }
  if (items.length === 0) { alert('Please add at least one item.'); return; }

  try {
    await apiPost('/requests', { type, items, employeeEmail: window.currentAccount.email });
    renderRequests();
    document.getElementById('requestForm').reset();
    document.getElementById('itemsContainer').innerHTML = '';
    const modalEl = document.getElementById('requestModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    alert('Request submitted successfully!');
  } catch (err) { alert(err); }
}

/* ===== PASSWORD TOGGLE ===== */
function togglePassword(inputId, iconElement) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; iconElement.textContent = '⌣'; }
  else { input.type = 'password'; iconElement.textContent = '👁'; }
}

/* ===== DOM LOADED ===== */
document.addEventListener('DOMContentLoaded', () => {

  // Load initial data (departments for dropdown)
  apiGet('/departments').then(depts => updateDepartmentDropdown(depts)).catch(() => {});

  /* REGISTER */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const firstname = document.getElementById('firstname').value.trim();
      const lastname = document.getElementById('lastname').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      if (!firstname || !lastname || !email || !password) { alert('Please fill in all fields.'); return; }
      try {
        const result = await apiPost('/auth/register', { firstname, lastname, email, password });
        // Store the new account ID so we can verify it
        window.pendingVerifyId = result.id;
        navigateTo('verify-email');
      } catch (err) { alert(err); }
    });
  }

  /* EMAIL VERIFICATION */
  const verifyBtn = document.getElementById('verifyBtn');
  if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
      if (!window.pendingVerifyId) { alert('No account pending verification.'); return; }
      try {
        await apiPost(`/accounts/${window.pendingVerifyId}/verify`, {});
        window.pendingVerifyId = null;
        alert('Email successfully verified! You can now login.');
        const loginAlert = document.getElementById('loginAlert');
        if (loginAlert) loginAlert.classList.remove('d-none');
        navigateTo('login');
      } catch (err) { alert(err); }
    });
  }

  /* LOGIN */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      try {
        const account = await apiPost('/auth/login', { email, password });
        showUserDropdown(account);
        navigateTo('profile');
      } catch (err) { alert(err); }
    });
  }

  /* EDIT PROFILE */
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', async () => {
      if (!window.currentAccount) return;
      const newFirst = prompt('Enter new first name:', window.currentAccount.firstname);
      const newLast = prompt('Enter new last name:', window.currentAccount.lastname);
      if (newFirst && newLast) {
        try {
          await apiPut(`/accounts/${window.currentAccount.id}`, { firstname: newFirst, lastname: newLast });
          window.currentAccount.firstname = newFirst;
          window.currentAccount.lastname = newLast;
          navigateTo('profile');
        } catch (err) { alert(err); }
      }
    });
  }

  /* ACCOUNT FORM */
  const accountForm = document.getElementById('accountForm');
  if (accountForm) accountForm.addEventListener('submit', saveAccount);

  /* REQUEST FORM */
  const requestForm = document.getElementById('requestForm');
  if (requestForm) requestForm.addEventListener('submit', saveRequest);

  /* REQUEST MODAL - auto-add first item field */
  const requestModal = document.getElementById('requestModal');
  if (requestModal) {
    requestModal.addEventListener('shown.bs.modal', () => {
      const container = document.getElementById('itemsContainer');
      container.innerHTML = '';
      addItemField();
    });
  }

  /* EMPLOYEE FORM */
  const empForm = document.getElementById('empForm');
  if (empForm) {
    empForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveEmployee();
    });
  }
});
