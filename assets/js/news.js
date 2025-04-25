document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('newsContainer');
    
    // في الواقع هنا ستجلب البيانات من API
    const newsData = [
        {
            title: "رونالدو يسجل هدفين في مرمى الهلال",
            image: "assets/images/news/ronaldo.jpg",
            date: "2023-11-01",
            summary: "قاد كريستيانو رونالدو فريقه النصر للفوز على الهلال بثلاثية نظيفة",
            source: "كورة 365"
        },
        {
            title: "الاتحاد يعلن عن تعاقد جديد",
            image: "assets/images/news/ittihad.jpg",
            date: "2023-10-30",
            summary: "الاتحاد يوقع مع لاعب خط وسط منتخب فرنسا",
            source: "سبورت"
        }
    ];

    newsData.forEach(news => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = 
            <img src="${news.image}" alt="${news.title}" class="news-image">
            <div class="news-content">
                <span class="news-date">${news.date}</span>
                <h3 class="news-title">${news.title}</h3>
                <p>${news.summary}</p>
                <span class="news-source">المصدر: ${news.source}</span>
            </div>
        ;
        newsContainer.appendChild(card);
    });
});
