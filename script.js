const jokeDisplay = document.getElementById('joke-display');
const getJokeButton = document.getElementById('get-joke');
const shareTweetButton = document.getElementById('share-twitter');
const settingsBtn = document.getElementById('settings-btn');
const aboutBtn = document.getElementById('about-btn');
const settingsModal = document.getElementById('settings-modal');
const aboutModal = document.getElementById('about-modal');
const colorSchemeSelect = document.getElementById('color-scheme');
const saveSettingsBtn = document.getElementById('save-settings');

let currentJoke = '';
let jokes = [];
let jokesLoaded = false;

// Replace with your Google Sheet ID
const SHEET_ID = '1znOd86ReplVsujtcLi4cpPPNpvLaxGymqfjbYdp6T7s';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

getJokeButton.addEventListener('click', getRandomJoke);
shareTweetButton.addEventListener('click', shareOnTwitter);
settingsBtn.addEventListener('click', openSettingsModal);
aboutBtn.addEventListener('click', openAboutModal);
saveSettingsBtn.addEventListener('click', saveSettings);

window.addEventListener('click', closeModals);
window.addEventListener('keydown', handleKeyPress);

// Initial welcome message
jokeDisplay.textContent = "Welcome to the Dad Joke Generator! Click 'Get Joke' to start groaning.";

fetch(SHEET_URL)
    .then(response => response.text())
    .then(data => {
        jokes = data.split('\n').slice(1).map(row => {
            const [, joke] = row.split('",');
            return joke.replace(/"$/, '').replace(/^"/, '');
        });
        jokesLoaded = true;
        getJokeButton.disabled = false;
    })
    .catch(error => {
        console.error('Error loading jokes:', error);
        jokeDisplay.textContent = "Oops! We're having trouble loading jokes right now. Please try again later.";
        getJokeButton.disabled = true;
    });

function getRandomJoke() {
    if (!jokesLoaded) {
        jokeDisplay.textContent = "Jokes are still loading. Please wait a moment and try again.";
        return;
    }
    
    if (jokes.length === 0) {
        jokeDisplay.textContent = "We've run out of jokes! Please check back later for more.";
        return;
    }
    
    currentJoke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeDisplay.textContent = currentJoke;
    shareTweetButton.style.display = 'inline-block';
}

function shareOnTwitter() {
    const tweetJoke = currentJoke.length > 200 
        ? currentJoke.substring(0, 197) + '...' 
        : currentJoke;
    
    const tweetText = encodeURIComponent(`"${tweetJoke}"\n\n🤣 Get more dad jokes at:`);
    const appUrl = encodeURIComponent('https://djokes.netlify.app');
    const hashtags = encodeURIComponent('DadJokes,Humor');
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${appUrl}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
}

function openSettingsModal() {
    settingsModal.style.display = 'block';
    settingsModal.setAttribute('aria-hidden', 'false');
    colorSchemeSelect.focus();
}

function openAboutModal() {
    aboutModal.style.display = 'block';
    aboutModal.setAttribute('aria-hidden', 'false');
}

function closeModals(event) {
    if (event.target === settingsModal || event.target === aboutModal) {
        settingsModal.style.display = 'none';
        aboutModal.style.display = 'none';
        settingsModal.setAttribute('aria-hidden', 'true');
        aboutModal.setAttribute('aria-hidden', 'true');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Escape') {
        settingsModal.style.display = 'none';
        aboutModal.style.display = 'none';
        settingsModal.setAttribute('aria-hidden', 'true');
        aboutModal.setAttribute('aria-hidden', 'true');
    }
}

function saveSettings() {
    const selectedScheme = colorSchemeSelect.value;
    localStorage.setItem('colorScheme', selectedScheme);
    applyColorScheme(selectedScheme);
    settingsModal.style.display = 'none';
    settingsModal.setAttribute('aria-hidden', 'true');
}

function applyColorScheme(scheme) {
    document.body.className = scheme + '-theme';
}

// Load saved color scheme
const savedScheme = localStorage.getItem('colorScheme');
if (savedScheme) {
    colorSchemeSelect.value = savedScheme;
    applyColorScheme(savedScheme);
}

// Initially disable the Get Joke button until jokes are loaded
getJokeButton.disabled = true;
