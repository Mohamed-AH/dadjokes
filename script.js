const jokeDisplay = document.getElementById('joke-display');
const generateBtn = document.getElementById('generate-btn');
const shareBtn = document.getElementById('share-btn');

async function generateDadJoke() {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}` // OPENAI_API_KEY will be replaced during build
        },
        body: JSON.stringify({
            prompt: "Generate a dad joke:",
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.7,
        })
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

generateBtn.addEventListener('click', async () => {
    jokeDisplay.textContent = "Generating joke...";
    try {
        const joke = await generateDadJoke();
        jokeDisplay.textContent = joke;
    } catch (error) {
        console.error('Error:', error);
        jokeDisplay.textContent = "Oops! Failed to generate a joke. Please try again.";
    }
});

shareBtn.addEventListener('click', () => {
    const joke = jokeDisplay.textContent;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(joke)}&hashtags=DadJoke`;
    window.open(twitterUrl, '_blank');
});
