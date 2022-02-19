import './sass/main.scss';
import { fetchData } from './js /crud';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';

//-----REFS----//
const formRef = document.querySelector('#search-form');
const inputRef = document.querySelector('[name="searchQuery"]');
const searchBtnRef = document.querySelector('[type="submit"]');
const galleryRef = document.querySelector('.gallery');
const loadBtnRef = document.querySelector('.load-more');

let inputValue = '';
let page = 1;

formRef.addEventListener('submit', onSearch);
loadBtnRef.addEventListener('click', onLoad);

async function onSearch(e) {
  e.preventDefault();
  page = 1;
  clearMarkup();

  inputValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!inputValue) {
    return;
  }
  try {
    const data = await fetchData(inputValue, page);

    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }
    renderMarkup(data.hits);
    loadMoreActive();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    if (data.hits.length < 40) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      loadMoreHidden();
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, something went wrong. Please try again.');
  }
  // loadMoreActive();
}

function createMarkup(data) {
  console.log(data);
  return data
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      console.log(webformatURL);
      return `
        <div class="photo-card">
        <a class"photo-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
       <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
       <span>${downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
}

function renderMarkup(data) {
  loadMoreHidden();
  const markup = createMarkup(data);
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  loadMoreActive();
}

function clearMarkup() {
  galleryRef.innerHTML = '';
}

function loadMoreActive() {
  loadBtnRef.classList.remove('is-hidden');
  loadBtnRef.disabled = false;
}

function loadMoreHidden() {
  loadBtnRef.classList.add('is-hidden');
  loadBtnRef.disabled = true;
}

async function onLoad() {
  page += 1;
  try {
    const data = await fetchData(inputValue, page);
    renderMarkup(data.hits);
    if (data.hits.length < 40) {
      loadMoreHidden();
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionsData: 'alt',
  captionDelay: 250,
});
