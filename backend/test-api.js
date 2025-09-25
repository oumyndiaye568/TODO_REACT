import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Test login and get delegated tasks
async function testAPI() {
  try {
    console.log('=== LOGIN ===');
    const loginResponse = await api.post('/auth', { login: 'admin', password: 'admin' });
    console.log('Login response:', loginResponse.data);

    const token = loginResponse.data.token;
    console.log('Token:', token);

    // Set token for subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('\n=== GET DELEGATED TASKS ===');
    const delegatedResponse = await api.get('/tasks/delegated');
    console.log('Delegated tasks:', delegatedResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();