document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('matches-container');
    
    try {
        // 1. جلب البيانات مع إضافة timestamp لتجنب الكاش
        const timestamp = new Date().getTime();
        const response = await fetch(`data/matches.json?t=${timestamp}`);
        
        console.log("حالة الاستجابة:", response.status); // للتتبع
        
        if (response.status === 403) {
            throw new Error("403 Forbidden - تحقق من صلاحيات الملف");
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 2. عرض البيانات
        if (!data.response || data.response.length === 0) {
            container.innerHTML = '<p class="error">لا توجد بيانات مباريات</p>';
            return;
        }
        
        displayMatches(data.response);
        
    } catch (error) {
        console.error("حدث خطأ:", error);
        container.innerHTML = `
            <div class="error">
                <p>⚠️ خطأ في تحميل البيانات</p>
                <small>${error.message}</small>
                <p>تحقق من وحدة التحكم (Console) للمزيد</p>
            </div>
        `;
    }
});

function displayMatches(matches) {
    // ... (نفس الدالة السابقة)
}
