import axios from 'axios'

const urls = [
    'https://bato.to/series/132934/firefly-wedding',
    'https://bato.to/series/132934/firefly-wedding',
    'https://harimanga.com/manga/for-my-abandoned-love/',
    'https://harimanga.com/manga/how-to-get-my-husband-on-my-side/',
    'https://harimanga.com/manga/lillian-of-turin/',
    'https://harimanga.com/manga/the-second-male-lead-is-actually-a-girl/',
    'https://harimanga.com/manga/into-the-light-once-again/',
    'https://harimanga.com/manga/i-became-the-male-leads-adopted-daughter/',
    'https://harimanga.com/manga/i-became-the-wife-of-the-male-lead/',
    'https://harimanga.com/manga/death-is-the-only-ending-for-the-villainess/',
    'https://harimanga.com/manga/the-abandoned-bachelorette-enjoys-her-simple-life/',
    'https://harimanga.com/manga/i-will-change-the-genre/',
    'https://batotoo.com/series/160852',
    'https://batotoo.com/series/125589/the-fragrant-flower-blooms-with-dignity-official-simulpub',
    'https://batotoo.com/series/77447/secret-love',
    'https://harimanga.com/manga/a-red-knight-does-not-blindly-follow-money/',
    'https://harimanga.com/manga/please-dont-come-to-the-villainess-stationery-store/',
    'https://batotoo.com/series/113046',
    'https://batotoo.com/series/74597',
    'https://batotoo.com/series/134022',
    'https://bato.to/series/113392',
    'https://bato.to/series/88017',
    'https://batotoo.com/series/150957',
    'https://harimanga.com/manga/princess-shu/',
    'https://harimanga.com/manga/princess-shu/',
    'https://harimanga.com/manga/i-thought-i-didnt-have-long-to-live/',
    'https://batotoo.com/series/152946',
    'https://harimanga.me/manga/into-the-light-once-again/',
    'https://harimanga.me/manga/lady-baby/',
    'https://harimanga.me/manga/pure-villain/',
    'https://harimanga.me/manga/ill-just-live-on-as-a-villainess/',
]

// Checks a single URL and returns the updated URL if accessible (using response.request.res.responseUrl)
const fetchUpdatedUrl = async (url) => {
    try {
        const response = await axios.head(url)
        if (response.status === 200) {
            return response.request.res.responseUrl
        }
        return url
    } catch (error) {
        return url
    }
}

// Goes through each URL, updates it if necessary, and returns a new list with the final URLs.
const updateUrlsWithResponseUrl = async (urls) => {
    const updatedUrls = await Promise.all(
        urls.map((url) => fetchUpdatedUrl(url)),
    )
    return updatedUrls
}

// Run the update and log the new list of URLs.
updateUrlsWithResponseUrl(urls)
    .then((updated) => {
        console.log('Updated URLs:', updated)
    })
    .catch(console.error)
