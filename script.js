<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "name": "بلوغر",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/images/logo.png",
  "description": "موقع متخصص في بث المباريات المباشرة وأخبار كرة القدم العالمية"
}
</script>
document.addEventListener('DOMContentLoaded', function() {
    // تواريخ العرض
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('today-date').textContent = formatDate(today);
    document.getElementById('tomorrow-date').textContent = formatDate(tomorrow);
    
    // بيانات المباريات (يمكن استبدالها ببيانات حقيقية من API)
    const matchesData = {
        today: [
            {
                id: 1,
                league: "الدوري السعودي",
                time: "20:00",
                status: "live",
                team1: { name: "النصر", logo: "images/teams/alnassr.png" },
                team2: { name: "الهلال", logo: "images/teams/alhilal.png" },
                channel: "KSA Sports"
            },
            {
                id: 2,
                league: "الدوري الإنجليزي",
                time: "22:00",
                status: "upcoming",
                team1: { name: "مانشستر يونايتد", logo: "images/teams/manutd.png" },
                team2: { name: "ليفربول", logo: "images/teams/liverpool.png" },
                channel: "beIN Sports 1"
            },
            {
                id: 3,
                league: "الدوري الإسباني",
                time: "23:00",
                status: "upcoming",
                team1: { name: "برشلونة", logo: "images/teams/barca.png" },
                team2: { name: "ريال مدريد", logo: "images/teams/realmadrid.png" },
                channel: "beIN Sports 2"
            }
        ],
        tomorrow: [
            {
                id: 4,
                league: "الدوري الإيطالي",
                time: "20:45",
                status: "upcoming",
                team1: { name: "يوفنتوس", logo: "images/teams/juventus.png" },
                team2: { name: "إنتر ميلان", logo: "images/teams/inter.png" },
                channel: "beIN Sports 3"
            },
            {
                id: 5,
                league: "الدوري الفرنسي",
                time: "21:00",
                status: "upcoming",
                team1: { name: "باريس سان جيرمان", logo: "images/teams/psg.png" },
                team2: { name: "مارسيليا", logo: "images/teams/marseille.png" },
                channel: "beIN Sports 4"
            }
        ]
    };
    
    // بيانات الملخصات
    const highlightsData = [
        {
            id: 1,
            title: "ملخص مباراة النصر والهلال - الدوري السعودي",
            videoId: "dQw4w9WgXcQ"
        },
        {
            id: 2,
            title: "ملخص مباراة برشلونة وريال مدريد - الكلاسيكو",
            videoId: "dQw4w9WgXcQ"
        },
        {
            id: 3,
            title: "ملخص مباراة مانشستر يونايتد وليفربول - الدوري الإنجليزي",
            videoId: "dQw4w9WgXcQ"
        },
        {
            id: 4,
            title: "أهداف مباراة بايرن ميونخ ودورتموند - الدوري الألماني",
            videoId: "dQw4w9WgXcQ"
        }
    ];
    
    // عرض المباريات
    renderMatches('today-matches-container', matchesData.today);
    renderMatches('tomorrow-matches-container', matchesData.tomorrow);
    
    // عرض الملخصات
    renderHighlights('highlights-container', highlightsData);
    
    // تحديث حالة المباريات كل دقيقة
    setInterval(updateMatchesStatus, 60000);
    
    // إعداد القائمة المتنقلة
    setupMobileMenu();
    
    // إعداد مشغل الفيديو
    setupVideoPlayer();
    
    // وظائف مساعدة
    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ar-EG', options);
    }
    
    function renderMatches(containerId, matches) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        matches.forEach(match => {
const matchElement = document.createElement('div');
            matchElement.className = 'match-card';
            matchElement.innerHTML = 
                <div class="match-header">
                    <span class="league-name">${match.league}</span>
                    <span class="match-time">${match.time}</span>
                </div>
                <div class="match-teams">
                    <div class="team">
                        <img src="${match.team1.logo}" alt="${match.team1.name}" class="team-logo">
                        <span class="team-name">${match.team1.name}</span>
                    </div>
                    <span class="vs">vs</span>
                    <div class="team">
                        <img src="${match.team2.logo}" alt="${match.team2.name}" class="team-logo">
                        <span class="team-name">${match.team2.name}</span>
                    </div>
                </div>
                <div class="match-info">
                    <span class="match-status ${match.status}">${match.status === 'live' ? 'مباشر' : 'لم تبدأ بعد'}</span>
                    <span class="match-channel">${match.channel}</span>
                </div>
            ;
            container.appendChild(matchElement);
        });
    }
    
    function renderHighlights(containerId, highlights) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        highlights.forEach(highlight => {
            const highlightElement = document.createElement('div');
            highlightElement.className = 'highlight-card';
            highlightElement.dataset.videoId = highlight.videoId;
            highlightElement.innerHTML = 
                <img src="https://img.youtube.com/vi/${highlight.videoId}/mqdefault.jpg" alt="${highlight.title}" class="highlight-thumbnail">
                <i class="fas fa-play play-icon"></i>
                <div class="highlight-title">${highlight.title}</div>
            ;
            container.appendChild(highlightElement);
        });
    }
    
    function updateMatchesStatus() {
        // في تطبيق حقيقي، سيتم التحقق من الوقت الفعلي لتحديث الحالة
        console.log('Updating matches status...');
    }
    
    function setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
    
    function setupVideoPlayer() {
        const modal = document.getElementById('videoModal');
        const closeBtn = document.querySelector('.close-modal');
        const videoFrame = document.getElementById('videoFrame');
        const highlightCards = document.querySelectorAll('.highlight-card');
        
        highlightCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.videoId;
                videoFrame.src = https://www.youtube.com/embed/${videoId}?autoplay=1;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', () => {
            videoFrame.src = '';
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                videoFrame.src = '';
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
