// ১. হোম পেজে কন্টেন্ট লোড করার ফাংশন
async function loadHomePageContents() {
    try {
        const response = await fetch('contents.json');
        const contents = await response.json();
        
        const grid = document.getElementById('content-grid');
        grid.innerHTML = ''; // ক্লিয়ার লোডিং টেক্সট

        contents.forEach(item => {
            const cardHTML = `
                <div class="card">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-desc">${item.short_desc}</p>
                        <!-- ID দিয়ে details পেজে পাঠাবে -->
                        <a href="details.html?id=${item.id}" class="read-more">Read More →</a>
                    </div>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Error loading contents:", error);
        document.getElementById('content-grid').innerHTML = "<p>Data লোড করতে সমস্যা হয়েছে।</p>";
    }
}

// ২. ডিটেইলস পেজে আর্টিকেল এবং ভিন্ন রিলেটেড কন্টেন্ট লোড করার ফাংশন
async function loadDetailsPageContent() {
    try {
        // URL থেকে ID সংগ্রহ করা (যেমন: details.html?id=2)
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = parseInt(urlParams.get('id'));

        if (!contentId) {
            window.location.href = 'index.html'; // ID না থাকলে হোমে পাঠাবে
            return;
        }

        const response = await fetch('contents.json');
        const contents = await response.json();

        // নির্দিষ্ট কন্টেন্ট খোঁজা
        const currentContent = contents.find(item => item.id === contentId);

        if (currentContent) {
            // আর্টিকেলের ডাটা বসানো
            const articleDiv = document.getElementById('article-content');
            articleDiv.innerHTML = `
                <h1 class="article-title">${currentContent.title}</h1>
                <img src="${currentContent.image}" alt="Article Image" class="article-img">
                <div class="article-body">
                    <p>${currentContent.full_content}</p>
                </div>
            `;

            // CPA বাটন লিংক আপডেট করা
            document.getElementById('cpa-offer-btn').href = currentContent.offer_link;
            document.getElementById('sticky-cpa-btn').href = currentContent.offer_link;

            // ৩. রিলেটেড কন্টেন্ট লোড করা (বর্তমান ID বাদে একই ক্যাটাগরির ভিন্ন কন্টেন্ট)
            const relatedGrid = document.getElementById('related-grid');
            
            // ফিল্টার করা: ক্যাটাগরি একই কিন্তু বর্তমান কন্টেন্টটি বাদ
            let relatedItems = contents.filter(item => item.category === currentContent.category && item.id !== contentId);
            
            // যদি একই ক্যাটাগরির কন্টেন্ট কম থাকে, তবে অন্য ক্যাটাগরি থেকেও নিয়ে ৩টা পূরণ করবে
            if (relatedItems.length < 3) {
                const otherItems = contents.filter(item => item.id !== contentId && !relatedItems.includes(item));
                relatedItems = relatedItems.concat(otherItems);
            }

            // প্রথম ৩টি ভিন্ন কন্টেন্ট দেখানো
            const displayRelated = relatedItems.slice(0, 3);
            
            relatedGrid.innerHTML = '';
            displayRelated.forEach(item => {
                const relatedHTML = `
                    <a href="details.html?id=${item.id}" class="related-card">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="related-title">${item.title}</div>
                    </a>
                `;
                relatedGrid.innerHTML += relatedHTML;
            });

        } else {
            document.getElementById('article-content').innerHTML = "<p>Content not found.</p>";
        }
    } catch (error) {
        console.error("Error loading article:", error);
    }
}