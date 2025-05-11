const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const sendBtn = document.getElementById('sendBtn');
const recordingAnim = document.getElementById('recording-animation');
const previewBox = document.getElementById('preview');
const audioPlayback = document.getElementById('audioPlayback');
function toggleComments(postId) {
    const commentsModal = document.getElementById(`comments-modal-${postId}`);
    commentsModal.style.display = (commentsModal.style.display === "none" || commentsModal.style.display === "") ? "flex" : "none";
}

function closeComments(postId) {
    const commentsModal = document.getElementById(`comments-modal-${postId}`);
    commentsModal.style.display = "none"; // Close modal
}
function likePost(postId) {
    fetch(`/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const likeIcon = document.getElementById(`like-icon-${postId}`);
      const likeCount = document.getElementById(`like-count-${postId}`);

      if (likeIcon.classList.contains("fa-solid")) {
        likeIcon.classList.remove("fa-solid");
        likeIcon.classList.add("fa-regular");
      } else {
        likeIcon.classList.remove("fa-regular");
        likeIcon.classList.add("fa-solid");
      }

      likeCount.innerText = data.likes;
    })
    .catch(error => console.error('Error liking post:', error));
  }

function toggleCommentType(postId, type) {
    const textCommentInput = document.getElementById(`text-comment-input-${postId}`);
    const voiceCommentControls = document.getElementById(`voice-comment-controls-${postId}`);
    const previewBox = document.querySelector(`#comments-modal-${postId} #preview`);
    const audioPlayback = document.querySelector(`#comments-modal-${postId} #audioPlayback`);
    const recordingAnim = document.querySelector(`#comments-modal-${postId} #recording-animation`);
    const sendBtn = document.querySelector(`#comments-modal-${postId} #sendBtn`);
    const startBtn = document.querySelector(`#comments-modal-${postId} #startBtn`);
    const stopBtn = document.querySelector(`#comments-modal-${postId} #stopBtn`);

    // Show/Hide inputs
    textCommentInput.style.display = (type === 'text') ? "block" : "none";
    voiceCommentControls.style.display = (type === 'voice') ? "block" : "none";
    previewBox.style.display = (type === 'voice') ? "block" : "none";

    if (type === 'voice') {
        let mediaRecorder;
        let audioChunks = [];
        let audioBlob;

        startBtn.onclick = async () => {
            recordingAnim.style.display = "block";
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            audioChunks = [];
            recordingAnim.classList.remove('hidden');

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioURL = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioURL;

                previewBox.classList.remove('hidden');
                recordingAnim.classList.add('hidden');
            };

            stopBtn.disabled = false;
            startBtn.disabled = true;
        };

        stopBtn.onclick = () => {
            sendBtn.style.display = "flex";
            recordingAnim.style.display = "none";
            mediaRecorder.stop();
            stopBtn.disabled = true;
            startBtn.disabled = false;
        };

        window.sendFunction = async (postId, e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice.webm');

            const res = await fetch(`/posts/upload-voice/${postId}`, {
                method: 'POST',
                body: formData
            });

            const result = await res.json();
            alert(result.message);
            window.location.reload();
        };
    }
}
