import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '25755810-79c0d608541c856dcb4548d70';

//https://pixabay.com/api/?key=25755810-79c0d608541c856dcb4548d70&q=yellow+flowers&image_type=photo
function fetchData(q, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '40',
    page,
  });
  return axios.get(`?${params}`).then(res => res.data);
}

export { fetchData };
