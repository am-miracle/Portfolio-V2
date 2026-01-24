// Endpoint loaded from config.js
const QUERY_POSTS = `
  query GetPosts {
    posts(orderBy: date_DESC) {
      slug
      title
      date
    }
  }
`;

const QUERY_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    post(where: {slug: $slug}) {
      title
      date
      tags
      coverImage {
        url
      }
      content {
        html
      }
    }
  }
`;

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

async function fetchHygraph(query, variables = {}) {
    try {
        const response = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const json = await response.json();

        if (json.errors) {
            console.error('Hygraph Errors:', json.errors);
            throw new Error('Failed to fetch from Hygraph');
        }

        return json.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function initBlogList() {
    const container = document.querySelector('.card-container');
    if (!container) {
        return;
    }

    const dynamicContainer = document.getElementById('dynamic-posts-container');
    if (!dynamicContainer) {
        return;
    }

    const data = await fetchHygraph(QUERY_POSTS);

    if (!data || !data.posts) {
        dynamicContainer.innerHTML = '<p class="padd-15">Failed to load articles.</p>';
        return;
    }

    dynamicContainer.innerHTML = '';

    data.posts.forEach((post, index) => {
        const articleDiv = document.createElement('div');
        const firstTag = post.tags && post.tags.length > 0 ? post.tags[0] : 'General';

        articleDiv.className = `filterDiv ${firstTag} animate-section show in-view`;

        articleDiv.style.display = 'block';
        articleDiv.style.opacity = '1';
        articleDiv.style.transform = 'translateY(0)';

        articleDiv.innerHTML = `
            <a href="article-detail.html?slug=${post.slug}">
                <h1 class="article-title">${post.title}</h1>
            </a>
            <div class="article-details">
                <p>${formatDate(post.date)}</p>
            </div>
            <hr>
        `;
        dynamicContainer.appendChild(articleDiv);
    });
}

async function initBlogPost() {
    const titleEl = document.getElementById('article-title');
    if (!titleEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        document.getElementById('loading-indicator').innerText = 'Article not found.';
        return;
    }

    const data = await fetchHygraph(QUERY_POST_BY_SLUG, { slug });

    if (!data || !data.post) {
        window.location.href = '/404.html';
        return;
    }

    const post = data.post;

    document.title = `${post.title}`;

    document.getElementById('loading-indicator').style.display = 'none';
    const articleContainer = document.getElementById('article-container');
    articleContainer.style.display = 'block';

    titleEl.innerText = post.title;
    document.getElementById('article-date').innerText = formatDate(post.date);
    document.getElementById('article-tags').innerText = post.tags.join(', ');

    if (post.coverImage && post.coverImage.url) {
        const img = document.getElementById('article-cover');
        img.src = post.coverImage.url;
        img.style.display = 'block';
    }

    requestAnimationFrame(() => {
        articleContainer.classList.add('in-view');
    });

    document.getElementById('article-body').innerHTML = post.content.html;
}

function init() {
    if (document.getElementById('dynamic-posts-container')) {
        initBlogList();
    } else if (document.getElementById('article-title')) {
        initBlogPost();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
