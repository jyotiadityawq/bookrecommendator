document.getElementById('book-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const language = document.getElementById('language').value;
    const genre = document.getElementById('genre').value;
    const length = document.getElementById('length').value;

    fetchBooks(genre, language, length);
});

async function fetchBooks(genre, language, length) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&langRestrict=${language}&maxResults=20`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        const filteredBooks = filterBooksByLength(data.items, length);
        displayBooks(filteredBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function filterBooksByLength(books, length) {
    return books.filter(book => {
        const pageCount = book.volumeInfo.pageCount;
        if (length === 'short') {
            return pageCount <= 200;
        } else if (length === 'medium') {
            return pageCount > 200 && pageCount <= 500;
        } else if (length === 'long') {
            return pageCount > 500;
        }
        return true; 
    });
}

function displayBooks(books) {
    const recommendations = document.getElementById('book-recommendations');
    recommendations.innerHTML = '';

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <h3>${bookInfo.title}</h3>
            <p>Author: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
            <p>Pages: ${bookInfo.pageCount ? bookInfo.pageCount : 'N/A'}</p>
        `;
        recommendations.appendChild(bookElement);
    });
}
