import { getLaunch, searchLaunches } from './api.js';
import { el } from './elements.js';

/**
 * Býr til leitarform.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarstrengur.
 * @returns {HTMLElement} Leitarform.
 */
export function renderSearchForm(searchHandler, query = undefined) {
  const form = el(
    'form',
    {},
    el('input', { value: query ?? '', name: 'query' }),
    el('button', {}, 'Leita')
  );

  form.addEventListener('submit', searchHandler);

  return form;
  /* TODO útfæra */
}

/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(parentElement, searchForm = undefined) {
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }

  if (!searchForm) {
    return;
  }

  const button = searchForm.querySelector('button');

  if (button) {
    button.setAttribute('disabled', 'disabled');
  }
  /* EKKI SNERTA!!! */
}

/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(parentElement, searchForm = undefined) {
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }

  if (!searchForm) {
    return;
  }

  const disabledButton = searchForm.querySelector('button[disabled]');

  if (disabledButton) {
    disabledButton.removeAttribute('disabled');
  }
  /* EKKI SNERTA!!! */
}

/**
 * Birta niðurstöður úr leit.
 * @param {import('./api.types.js').Launch[] | null} results Niðurstöður úr leit
 * @param {string} query Leitarstrengur.
 */
function createSearchResults(results, query) {
  const list = el('ul', { class: 'results' });
  if (!results) {
    const noResultsElement = el('li', {}, `Villa við leit að ${query}`);
    list.appendChild(noResultsElement);
    return list;
  }
  if (results.length === 0) {
    const noResultsElement = el(
      'li',
      {},
      `Engar niðurstöður við leit að ${query}`
    );
    list.appendChild(noResultsElement);
    return list;
  }

  for (const result of results) {
    const resultMission = result.mission;
    const resultElement = el(
      'li',
      { class: 'result' },
      el('a', { href: `/?id=${result.id}` }, result.name),
      el('span', { class: 'mission' }, `Geimferð: ${ resultMission }`)
    );

    list.appendChild(resultElement);
  }
  return list;
  /* TODO útfæra */
}

/**
 *
 * @param {HTMLElement} parentElement Element sem á að birta niðurstöður í.
 * @param {Element} searchForm Form sem á að gera óvirkt.
 * @param {string} query Leitarstrengur.
 */
export async function searchAndRender(parentElement, searchForm, query) {
  const mainElement = parentElement.querySelector('main');

  if (!mainElement) {
    console.warn('fann ekki <main> element');
    return;
  }

  // Fjarlægja fyrri niðurstöður
  const resultsElement = mainElement.querySelector('.results');
  if (resultsElement) {
    resultsElement.remove();
  }

  setLoading(mainElement, searchForm);
  const results = await searchLaunches(query);
  setNotLoading(mainElement, searchForm);

  const resultsEl = createSearchResults(results, query);

  mainElement.appendChild(resultsEl);
  /* TODO útfæra */
}

/**
 * Sýna forsíðu, hugsanlega með leitarniðurstöðum.
 * @param {HTMLElement} parentElement Element sem á að innihalda forsíðu.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {string | undefined} query Leitarorð, ef eitthvað, til að sýna niðurstöður fyrir.
 */
export function renderFrontpage(
  parentElement,
  searchHandler,
  query = undefined
) {
  const heading = el(
    'h1',
    { class: 'heading', 'data-foo': 'bar' },
    'Geimskotaleitin 🚀'
  );
  const searchForm = renderSearchForm(searchHandler, query);
  const container = el('main', {}, heading, searchForm);
  parentElement.appendChild(container);

  if (!query) {
    return;
  }

  searchAndRender(parentElement, searchForm, query);
}

/**
 * Sýna geimskot.
 * @param {HTMLElement} parentElement Element sem á að innihalda geimskot.
 * @param {string} id Auðkenni geimskots.
 */
export async function renderDetails(parentElement, id) {
  const container = el('main', {});
  const backElement = el(
    'div',
    { class: 'back' },
    el('a', { href: '/' }, 'Til baka')
  );

  parentElement.appendChild(container);
  /* TODO setja loading state og sækja gögn */


  
  const launchJSON = await (getLaunch(id));
  
  const windowStart = launchJSON?.window_start;
  const windowEnd = launchJSON?.window_end;
  const statusName = launchJSON?.status.name;
  const missionName = launchJSON?.mission.name;
  const launchListName = launchJSON?.name;
  const statDescription = launchJSON?.status.description;
  const mDescription = launchJSON?.mission.description;
  const launchListImage = launchJSON?.image;
  
  // Sækja gögn og birta þau á skjáinn...
  const launchList = el('ul', { class: 'launchList' });
  container.appendChild(launchList);
  const launchListNameForm = el('h1', { class: 'feitletrad' }, `${ launchListName }`);
  launchList.appendChild(launchListNameForm);
  const windowStartForm = el('li', { class: 'windowStart' }, `Gluggi opnast: ${ windowStart }`);
  launchList.appendChild(windowStartForm);
  const windowEndForm = el('li', { class: 'marginBottom' }, `Gluggi lokast: ${ windowEnd }`);
  launchList.appendChild(windowEndForm);


  const statusNameForm = el('li', { class: 'feitletrad' }, `Staða: ${ statusName }`);
  launchList.appendChild(statusNameForm);
  const statDescriptionForm = el('li', { class: 'marginBottom' }, `${ statDescription }`);
  launchList.appendChild(statDescriptionForm);

  const missionNameForm = el('li', { class: 'feitletrad' }, `Geimferð: ${ missionName }`);
  launchList.appendChild(missionNameForm);
  const mDescriptionForm = el('li', { class: 'marginBottom' }, `${ mDescription }`);
  launchList.appendChild(mDescriptionForm);

  const launchListImageForm = el('img', { src: `${ launchListImage }`, alt: '' });
  launchList.appendChild(launchListImageForm);

  

  container.appendChild(backElement);



  // Tómt og villu state, við gerum ekki greinarmun á þessu tvennu, ef við
  // myndum vilja gera það þyrftum við að skilgreina stöðu fyrir niðurstöðu
 

  /* TODO útfæra ef gögn */
}