/* =========================================================
   Ufinite
   script.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initGallery();

    initMemoryTimeline();

    initLoveTimer();

    initWelcomeCover();

    initMusicPlayer();

    initGalleryInteraction();

    initImageModal();

});


/* =========================================================
   1. 生成相册
========================================================= */

function initGallery() {

    const gallery = document.getElementById("gallery");

    if (!gallery) return;

    gallery.innerHTML = "";

    photos.forEach(function (photo, index) {

        const card = document.createElement("div");

        if (photo.type === "landscape") {
            card.className = "photo landscape";
        } else {
            card.className = "photo";
        }

        const imagePath =
            siteConfig.imagePath + photo.file;

        card.innerHTML = `
            <img
                src="${imagePath}"
                alt="${escapeHTML(photo.title)}"
                draggable="false"
                loading="${index < 3 ? "eager" : "lazy"}"
            >

            <p>${escapeHTML(photo.date)}</p>

            <p>${escapeHTML(photo.title)}</p>
        `;

        gallery.appendChild(card);

    });

}


/* =========================================================
   2. 生成回忆录
========================================================= */

function initMemoryTimeline() {

    const timeline =
        document.getElementById("memoryTimeline");

    if (!timeline) return;

    timeline.innerHTML = "";

    memories.forEach(function (memory) {

        const item =
            document.createElement("div");

        item.className = "memory-item";

        item.innerHTML = `
            <div class="memory-date">
                ${escapeHTML(memory.date)}
            </div>

            <div class="memory-content">

                <div class="memory-title">
                    ${escapeHTML(memory.title)}
                </div>

                <div class="memory-text">
                    ${escapeHTML(memory.text)}
                </div>

            </div>
        `;

        timeline.appendChild(item);

    });

}


/* =========================================================
   3. 爱情计时器
========================================================= */

function initLoveTimer() {

    const timer =
        document.getElementById("loveTimer");

    if (!timer) return;

    const startDate =
        new Date(siteConfig.loveStartDate);

    function updateLoveTimer() {

        const now = new Date();

        const diff =
            now.getTime() -
            startDate.getTime();

        if (diff < 0) {

            timer.innerHTML =
                "童洲同舟即将开始";

            return;

        }

        const days =
            Math.floor(
                diff /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (diff %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (diff %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );

        const seconds =
            Math.floor(
                (diff %
                    (1000 * 60)) /
                1000
            );

        timer.innerHTML = `
            童洲同舟的第
            <span class="highlight">${days}</span>
            天
            <span class="highlight">${hours}</span>
            时
            <span class="highlight">${minutes}</span>
            分
            <span class="highlight">${seconds}</span>
            秒
        `;
    }

    updateLoveTimer();

    setInterval(updateLoveTimer, 1000);

}


/* =========================================================
   4. 欢迎封面
========================================================= */

function initWelcomeCover() {

    const enterBtn =
        document.getElementById("enterBtn");

    const welcomeCover =
        document.getElementById("welcomeCover");

    if (!enterBtn || !welcomeCover) return;


    enterBtn.addEventListener("click", async function () {

        /*
         * 这里的 click 是用户主动操作，
         * 因此可以尝试启动音乐。
         */
        await playMusic();


        /*
         * 隐藏欢迎封面
         */
        welcomeCover.classList.add("hidden");

        document.body.classList.remove(
            "welcome-active"
        );

    });

}


/* =========================================================
   5. 音乐播放器
========================================================= */

function initMusicPlayer() {

    const audio =
        document.getElementById("bgMusic");

    const musicBtn =
        document.getElementById("musicBtn");

    if (!audio || !musicBtn) return;


    /*
     * 点击音乐按钮
     */
    musicBtn.addEventListener(
        "click",
        async function () {

            if (audio.paused) {

                await playMusic();

            } else {

                pauseMusic();

            }

        }
    );


    /*
     * 音乐开始播放
     */
    audio.addEventListener(
        "play",
        function () {

            updateMusicButton(true);

        }
    );


    /*
     * 音乐暂停
     */
    audio.addEventListener(
        "pause",
        function () {

            updateMusicButton(false);

        }
    );


    /*
     * 音频加载错误
     */
    audio.addEventListener(
        "error",
        function () {

            console.error(
                "Ufinite 音乐加载失败：",
                audio.error
            );

            musicBtn.innerHTML =
                "⚠ Music Error";

        }
    );


    /*
     * 音频加载成功
     */
    audio.addEventListener(
        "canplay",
        function () {

            console.log(
                "Ufinite 音乐文件加载成功"
            );

        }
    );

}


/* =========================================================
   真正执行播放
========================================================= */

async function playMusic() {

    const audio =
        document.getElementById("bgMusic");

    const musicBtn =
        document.getElementById("musicBtn");

    if (!audio) return;


    try {

        /*
         * 确保浏览器已经加载音频
         */
        if (audio.readyState === 0) {

            audio.load();

        }


        await audio.play();


        updateMusicButton(true);


        console.log(
            "Ufinite 音乐开始播放"
        );


    } catch (error) {

        console.error(
            "Ufinite 音乐播放失败：",
            error
        );


        /*
         * 如果是浏览器禁止播放，
         * 给用户明确提示
         */
        if (musicBtn) {

            musicBtn.innerHTML =
                "🎵 点击播放音乐";

        }

    }

}


/* =========================================================
   暂停音乐
========================================================= */

function pauseMusic() {

    const audio =
        document.getElementById("bgMusic");

    if (!audio) return;

    audio.pause();

    updateMusicButton(false);

}


/* =========================================================
   更新音乐按钮
========================================================= */

function updateMusicButton(isPlaying) {

    const musicBtn =
        document.getElementById("musicBtn");

    if (!musicBtn) return;


    if (isPlaying) {

        musicBtn.innerHTML =
            "⏸ Pause Music";

        musicBtn.classList.add(
            "playing"
        );

    } else {

        musicBtn.innerHTML =
            "🎵 Play Music";

        musicBtn.classList.remove(
            "playing"
        );

    }

}


/* =========================================================
   6. 相册交互
========================================================= */

function initGalleryInteraction() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) return;


    let isDragging = false;

    let startX = 0;

    let startScrollLeft = 0;

    let lastX = 0;

    let velocity = 0;

    let momentumFrame = null;

    let wasDragged = false;


    /* -----------------------------------------------------
       判断是否存在横向滚动空间
    ----------------------------------------------------- */

    function canScroll() {

        return (
            gallery.scrollWidth >
            gallery.clientWidth + 2
        );

    }


    /* -----------------------------------------------------
       自动滚动
    ----------------------------------------------------- */
// 新增：使用独立变量保存精确的滚动值
let exactScrollLeft = gallery.scrollLeft;

    function autoScroll() {

        if (
            siteConfig.autoScroll &&
            !isDragging &&
            canScroll()
        ) {
            
            // 如果用户手动滑动了相册，将 exactScrollLeft 与实际 scrollLeft 同步
            if (Math.abs(gallery.scrollLeft - exactScrollLeft) > 1) {
                exactScrollLeft = gallery.scrollLeft;
            }

            // 在独立变量上累加小数速度
            exactScrollLeft += siteConfig.autoScrollSpeed;

            /*
             * 到达最右侧以后回到最左侧
             */
            if (
                exactScrollLeft >=
                gallery.scrollWidth -
                gallery.clientWidth -
                1
            ) {
                exactScrollLeft = 0;
            }
            
            // 将累加后的精确值赋给滚动条
            gallery.scrollLeft = exactScrollLeft;

        }

        requestAnimationFrame(autoScroll);

    }


        requestAnimationFrame(autoScroll);

    }


    /*
     * 启动自动滚动
     */
    requestAnimationFrame(autoScroll);


    /* -----------------------------------------------------
       惯性滚动
    ----------------------------------------------------- */

    function momentumScroll() {

        if (isDragging) return;


        if (Math.abs(velocity) > 0.15) {

            gallery.scrollLeft -= velocity;

            velocity *= 0.94;

            momentumFrame =
                requestAnimationFrame(
                    momentumScroll
                );

        } else {

            velocity = 0;

        }

    }


    /* -----------------------------------------------------
       开始拖动
    ----------------------------------------------------- */

    gallery.addEventListener(
        "pointerdown",
        function (event) {

            /*
             * 鼠标只响应左键
             */
            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {

                return;

            }


            isDragging = true;

            wasDragged = false;


            startX =
                event.clientX;

            lastX =
                event.clientX;


            startScrollLeft =
                gallery.scrollLeft;


            velocity = 0;


            cancelAnimationFrame(
                momentumFrame
            );


            gallery.classList.add(
                "active"
            );


            /*
             * 捕获触摸指针
             */
            try {

                gallery.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}

        }
    );


    /* -----------------------------------------------------
       拖动
    ----------------------------------------------------- */

    gallery.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) return;


            const currentX =
                event.clientX;


            const deltaX =
                currentX - startX;


            /*
             * 超过 6px 才认为是真正拖动
             */
            if (
                Math.abs(deltaX) > 6
            ) {

                wasDragged = true;

            }


            gallery.scrollLeft =
                startScrollLeft -
                deltaX * 1.8;


            velocity =
                (currentX - lastX) * 1.8;


            lastX =
                currentX;


            /*
             * 阻止浏览器原生手势
             */
            if (wasDragged) {

                event.preventDefault();

            }

        }
    );


    /* -----------------------------------------------------
       结束拖动
    ----------------------------------------------------- */

    function endDrag(event) {

        if (!isDragging) return;


        isDragging = false;


        gallery.classList.remove(
            "active"
        );


        try {

            gallery.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}


        /*
         * 启动惯性
         */
        momentumFrame =
            requestAnimationFrame(
                momentumScroll
            );


        /*
         * 稍微延迟清除，
         * 防止拖动结束立即触发 click
         */
        setTimeout(
            function () {

                wasDragged = false;

            },
            80
        );

    }


    gallery.addEventListener(
        "pointerup",
        endDrag
    );


    gallery.addEventListener(
        "pointercancel",
        endDrag
    );


    /*
     * 防止图片拖动
     */
    gallery.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * 拖动时禁止图片 click
     */
    gallery.addEventListener(
        "click",
        function (event) {

            if (wasDragged) {

                event.preventDefault();

                event.stopPropagation();

            }

        },
        true
    );

}


/* =========================================================
   7. 图片预览
========================================================= */

function initImageModal() {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const modalImg =
        document.getElementById(
            "modalImage"
        );

    const modalCaption =
        document.getElementById(
            "modalCaption"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const gallery =
        document.getElementById(
            "gallery"
        );


    if (
        !modal ||
        !modalImg ||
        !modalCaption ||
        !modalClose ||
        !gallery
    ) {

        return;

    }


    /*
     * 使用事件委托
     */
    gallery.addEventListener(
        "click",
        function (event) {

            const img =
                event.target.closest(
                    ".photo img"
                );


            if (!img) return;


            const card =
                img.closest(".photo");


            if (!card) return;


            const paragraphs =
                card.querySelectorAll("p");


            let caption = "";


            paragraphs.forEach(
                function (p, index) {

                    if (index > 0) {

                        caption += " ";

                    }

                    caption +=
                        p.textContent;

                }
            );


            modalImg.src =
                img.src;

            modalImg.alt =
                img.alt;

            modalCaption.textContent =
                caption;


            modal.classList.add(
                "show"
            );


            document.body.classList.add(
                "modal-open"
            );

        }
    );


    /*
     * 关闭
     */
    modalClose.addEventListener(
        "click",
        closeModal
    );


    /*
     * 点击背景关闭
     */
    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );


    /*
     * ESC 关闭
     */
    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    function closeModal() {

        modal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   8. HTML 字符转义
========================================================= */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
