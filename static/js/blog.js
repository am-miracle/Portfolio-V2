// Endpoint loaded from config.js
const QUERY_POSTS = `
  query GetPosts {
    posts(orderBy: date_DESC) {
      slug
      title
      date
      excerpt
      tags
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
        text
      }
    }
  }
`;

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const readingTime = (text) => {
    if (!text) return null;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (!words) return null;
    return Math.max(1, Math.round(words / 200));
};

const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

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
    const dynamicContainer = document.getElementById('dynamic-posts-container');
    if (!dynamicContainer) {
        return;
    }

    const skeletonCard = `
        <div class="post-card" aria-hidden="true">
            <div class="post-card__link">
                <div class="skeleton skeleton-tag"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line skeleton-line--short"></div>
            </div>
        </div>`;
    dynamicContainer.innerHTML = skeletonCard.repeat(4);

    const data = await fetchHygraph(QUERY_POSTS);

    if (!data || !data.posts) {
        dynamicContainer.innerHTML = '<p class="padd-15">Failed to load articles.</p>';
        return;
    }

    dynamicContainer.innerHTML = '';

    data.posts.forEach((post) => {
        const iso = new Date(post.date).toISOString().split('T')[0];

        const card = document.createElement('article');
        card.className = 'post-card animate-section in-view';

        card.innerHTML = `
            <a href="/articles/${encodeURIComponent(post.slug)}.html" class="post-card__link">
                <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
                ${post.excerpt ? `<p class="post-card__excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
                <div class="post-card__meta">
                    <time datetime="${iso}">${formatDate(post.date)}</time>
                </div>
            </a>`;
        dynamicContainer.appendChild(card);
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
    const mins = readingTime(post.content && post.content.text);
    const readingTimeEl = document.getElementById('article-reading-time');
    if (readingTimeEl && mins) {
        readingTimeEl.innerText = `${mins} min read`;
    }

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
