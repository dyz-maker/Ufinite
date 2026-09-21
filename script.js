/* =========================================================
   Ufinite 主程序
   script.js

   功能：
   1. 初始化页面
   2. 生成相册
   3. 生成回忆录
   4. 爱情计时器
   5. 欢迎封面
   6. 音乐播放器
   7. 相册自动滚动
   8. 相册拖拽
   9. 图片预览
========================================================= */


/* =========================================================
   页面初始化
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

        /*
         * 根据 type 判断照片类型
         */
        card.className =
            photo.type === "landscape"
                ? "photo landscape"
                : "photo";


        /*
         * 图片路径
         */
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


    /*
     * 使用 data.js 中的日期
     */
    const startDate =
        new Date(siteConfig.loveStartDate);


    function updateLoveTimer() {

        const now = new Date();

        const diff =
            now.getTime() - startDate.getTime();


        /*
         * 如果系统时间早于开始时间
         */
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

            <span class="highlight">
                ${days}
            </span>

            天

            <span class="highlight">
                ${hours}
            </span>

            时

            <span class="highlight">
                ${minutes}
            </span>

            分

            <span class="highlight">
                ${seconds}
            </span>

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

    const audio =
        document.getElementById("bgMusic");


    if (!enterBtn || !welcomeCover) return;


    enterBtn.addEventListener(
        "click",
        function () {


            /*
             * 点击进入主页时尝试播放音乐
             *
             * 因为这是用户主动点击，
             * 移动端浏览器通常允许播放。
             */
            if (audio) {

                audio.play()
                    .then(function () {

                        updateMusicButton(true);

                    })
                    .catch(function (error) {

                        console.log(
                            "音乐播放失败：",
                            error
                        );

                    });

            }


            /*
             * 隐藏欢迎封面
             */
            welcomeCover.classList.add("hidden");


            /*
             * 恢复页面滚动
             */
            document.body.classList.remove(
                "welcome-active"
            );

        }
    );

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


    musicBtn.addEventListener(
        "click",
        function () {

            if (audio.paused) {

                audio.play()
                    .then(function () {

                        updateMusicButton(true);

                    })
                    .catch(function (error) {

                        console.log(
                            "音乐播放失败：",
                            error
                        );

                    });

            } else {

                audio.pause();

                updateMusicButton(false);

            }

        }
    );


    /*
     * 音乐自然结束 / 被暂停时同步按钮状态
     */
    audio.addEventListener(
        "play",
        function () {

            updateMusicButton(true);

        }
    );


    audio.addEventListener(
        "pause",
        function () {

            updateMusicButton(false);

        }
    );

}


/*
 * 更新音乐按钮
 */

function updateMusicButton(isPlaying) {

    const musicBtn =
        document.getElementById("musicBtn");

    if (!musicBtn) return;


    if (isPlaying) {

        musicBtn.innerHTML =
            "⏸ Pause Music";

        musicBtn.classList.add("playing");

    } else {

        musicBtn.innerHTML =
            "🎵 Play Music";

        musicBtn.classList.remove("playing");

    }

}


/* =========================================================
   6. 相册交互
========================================================= */

function initGalleryInteraction() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) return;


    let isPointerDown = false;

    let startX = 0;

    let startScrollLeft = 0;

    let lastX = 0;

    let velocity = 0;

    let momentumAnimation = null;

    let hasDragged = false;


    /*
     * 判断当前是否真正可以横向滚动
     */
    function canScroll() {

        return (
            gallery.scrollWidth >
            gallery.clientWidth + 1
        );

    }


    /* =========================================
       自动滚动
    ========================================= */

    function autoScroll() {

        /*
         * 只有在没有拖拽时自动滚动
         */
        if (
            siteConfig.autoScroll &&
            !isPointerDown &&
            canScroll()
        ) {

            gallery.scrollLeft +=
                siteConfig.autoScrollSpeed;


            /*
             * 到达最右端后回到最左端
             */
            if (
                gallery.scrollLeft >=
                gallery.scrollWidth -
                gallery.clientWidth -
                1
            ) {

                gallery.scrollLeft = 0;

            }

        }


        requestAnimationFrame(autoScroll);

    }


    requestAnimationFrame(autoScroll);


    /* =========================================
       惯性滚动
    ========================================= */

    function applyMomentum() {

        if (isPointerDown) return;


        if (Math.abs(velocity) > 0.2) {

            gallery.scrollLeft -= velocity;

            velocity *= 0.94;

            momentumAnimation =
                requestAnimationFrame(
                    applyMomentum
                );

        } else {

            velocity = 0;

        }

    }


    /* =========================================
       Pointer Down
    ========================================= */

    gallery.addEventListener(
        "pointerdown",
        function (event) {

            /*
             * 只处理鼠标左键
             */
            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {

                return;

            }


            isPointerDown = true;

            hasDragged = false;

            startX = event.clientX;

            lastX = event.clientX;

            startScrollLeft =
                gallery.scrollLeft;

            velocity = 0;


            cancelAnimationFrame(
                momentumAnimation
            );


            gallery.classList.add("active");


            /*
             * 捕获 pointer，
             * 防止手指/鼠标移出 gallery 后事件丢失
             */
            try {

                gallery.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}

        }
    );


    /* =========================================
       Pointer Move
    ========================================= */

    gallery.addEventListener(
        "pointermove",
        function (event) {

            if (!isPointerDown) return;


            const currentX =
                event.clientX;


            const deltaX =
                currentX - startX;


            /*
             * 超过 5px 才认为是真正拖动
             */
            if (Math.abs(deltaX) > 5) {

                hasDragged = true;

            }


            /*
             * 拖动距离
             */
            gallery.scrollLeft =
                startScrollLeft - deltaX * 2;


            /*
             * 计算速度
             */
            velocity =
                (currentX - lastX) * 2;


            lastX = currentX;


            /*
             * 阻止浏览器原生拖拽
             */
            if (hasDragged) {

                event.preventDefault();

            }

        }
    );


    /* =========================================
       Pointer Up
    ========================================= */

    function endPointer(event) {

        if (!isPointerDown) return;


        isPointerDown = false;


        gallery.classList.remove("active");


        try {

            gallery.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}


        /*
         * 开始惯性滚动
         */
        momentumAnimation =
            requestAnimationFrame(
                applyMomentum
            );


        /*
         * 延迟清除拖动状态
         *
         * 防止拖动结束后立刻触发图片点击。
         */
        setTimeout(function () {

            hasDragged = false;

        }, 50);

    }


    gallery.addEventListener(
        "pointerup",
        endPointer
    );


    gallery.addEventListener(
        "pointercancel",
        endPointer
    );


    gallery.addEventListener(
        "lostpointercapture",
        function () {

            if (isPointerDown) {

                isPointerDown = false;

                gallery.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =========================================
       防止拖动时点击图片
    ========================================= */

    gallery.addEventListener(
        "click",
        function (event) {

            /*
             * 如果刚刚发生过拖动，
             * 阻止 click。
             */
            if (hasDragged) {

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
        document.getElementById("imageModal");

    const modalImg =
        document.getElementById("modalImage");

    const modalCaption =
        document.getElementById("modalCaption");

    const modalClose =
        document.getElementById("modalClose");

    const gallery =
        document.getElementById("gallery");


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
     * 使用事件委托。
     *
     * 因为照片是由 JS 动态生成的，
     * 所以不能在初始化时直接给每一张图片绑定事件。
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


            const textElements =
                card.querySelectorAll("p");


            let caption = "";


            textElements.forEach(
                function (element, index) {

                    if (index > 0) {

                        caption += " ";

                    }

                    caption +=
                        element.textContent;

                }
            );


            modalImg.src = img.src;

            modalImg.alt = img.alt;

            modalCaption.textContent =
                caption;


            modal.classList.add("show");


            /*
             * 防止弹窗打开后背景页面继续滚动
             */
            document.body.classList.add(
                "modal-open"
            );

        }
    );


    /*
     * 点击关闭
     */
    modalClose.addEventListener(
        "click",
        closeModal
    );


    /*
     * 点击黑色背景关闭
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
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );


    function closeModal() {

        modal.classList.remove("show");

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   8. HTML 安全处理
========================================================= */

/*
 * 因为 data.js 中的内容最终会进入 innerHTML，
 * 所以对文字进行简单转义。
 */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}