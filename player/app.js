// 쿼리 파라미터 파서
const q = new URLSearchParams(location.search);
const title   = q.get('title')   || 'Video';
const poster  = q.get('poster')  || '';
const hls     = q.get('hls');          // 예: /assets/video/are_you_sure/master.m3u8
const mp4     = q.get('mp4');          // 예: /assets/video/are_you_sure.mp4
const autoplay= q.get('autoplay') === '1';
const muted   = q.get('muted')   !== '0'; // 기본 true(모바일 자동재생 호환)
const loop    = q.get('loop')    === '1';

document.title = title;

const videoEl = document.getElementById('shoviPlayer');
if (poster) videoEl.setAttribute('poster', poster);
if (loop)   videoEl.setAttribute('loop', '');
if (autoplay) {
  videoEl.setAttribute('autoplay', '');
  // 모바일 정책상 muted 필요
  videoEl.muted = true;
}

// Video.js 인스턴스
const player = videojs('shoviPlayer', {
  fluid: true,
  controls: true,
  controlBar: {
    volumePanel: { inline: false }
  },
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
});

// 소스 로드
(function loadSource() {
  if (hls && window.Hls && Hls.isSupported()) {
    const tech = player.tech().el(); // <video> element
    const hlsPlayer = new Hls({ enableWorker: true });
    hlsPlayer.loadSource(hls);
    hlsPlayer.attachMedia(tech);
    hlsPlayer.on(Hls.Events.ERROR, (_, data) => console.warn('HLS error', data));
  } else if (hls) {
    // Safari는 video 태그 자체가 HLS 재생 가능
    player.src({ src: hls, type: 'application/x-mpegURL' });
  } else if (mp4) {
    player.src({ src: mp4, type: 'video/mp4' });
  } else {
    console.error('No video source. Provide ?hls= or ?mp4=');
    const msg = document.createElement('p');
    msg.style.cssText = 'color:#e9eef5;text-align:center';
    msg.textContent = 'No video source. Append ?hls=/path/master.m3u8 or ?mp4=/path/video.mp4';
    document.body.appendChild(msg);
  }

  if (muted) player.muted(true);
  if (autoplay) player.autoplay('muted'); // 모바일 호환
})();
