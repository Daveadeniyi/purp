document.addEventListener("DOMContentLoaded", function() {
    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    const video = document.getElementById("logoVideo");
    const content = document.getElementById("content");
    const customCursor = document.getElementById("customCursor");
    const body = document.body; // Reference to the body

    // Disable scrolling initially
    body.classList.add("no-scroll");

    // Variables for easing
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    // Update cursor position based on mouse movement
    document.addEventListener("mousemove", (event) => {
        targetX = event.pageX;
        targetY = event.pageY;
    });

    // Function to animate the cursor
    function animateCursor() {
        cursorX += (targetX - cursorX) * 0.1; // Easing factor
        cursorY += (targetY - cursorY) * 0.1; // Easing factor

        customCursor.style.left = `${cursorX}px`;
        customCursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor); // Continue the animation
    }

    // Start the cursor animation
    requestAnimationFrame(animateCursor);

    // Fetch the video from the service worker
    fetch('media/logo.mp4')
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const videoURL = URL.createObjectURL(blob);
            video.src = videoURL;

            video.addEventListener("canplaythrough", function() {
                // Show the video container and play the video
                content.style.display = "flex";
                video.play();

                // Start a 2.5-second timer before triggering the scale animation
                setTimeout(() => {
                    // Add a class that triggers the scale animation
                    video.classList.add("scale-down");
                }, 2500); // 2.5-second timer

                setTimeout(() => {
                    document.querySelector('.navbar').style.opacity = '1';
                    body.classList.remove("no-scroll"); // Enable scrolling
                }, 3000); // 3-second timer
            });

            // Disable right-click on the video
            video.addEventListener("contextmenu", function(event) {
                event.preventDefault(); // Prevent the context menu from appearing
            });
        })
        .catch(error => {
            console.error('Error fetching the video:', error);
        });
});
