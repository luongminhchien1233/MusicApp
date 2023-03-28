const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const heading = $('header h2');
const cdthumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playbtn = $('.btn-toggle-play');      
const player = $('.player');
const progress = $('#progress');
const btnnext = $('.btn-next');
const btnprev = $('.btn-prev');
const btnrandom = $('.btn-random');
const btnrepeat = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setconfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Vùng kí ức',
            singer: 'Chilles',
            path: './music/song1.mp3',
            img: './img/img1.jpg'
        },
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            path: './music/song2.mp3',
            img: './img/img2.jpg'
        },
        {
            name: 'Mascara',
            singer: 'Chilles',
            path: './music/song3.mp3',
            img: './img/img3.jpg'
        },
        {
            name: 'Gia Nhu / Ma Thoi',
            singer: 'Tunz',
            path: './music/song4.mp3',
            img: './img/img4.jpg'
        },
        {
            name: 'Ghé Qua',
            singer: 'Dick',
            path: './music/song5.mp3',
            img: './img/img5.jpg'
        },
        {
            name: 'Xe Đạp',
            singer: 'lee',
            path: './music/song6.mp3',
            img: './img/img6.jpg'
        },
        {
            name: 'Có em',
            singer: 'Mahidu',
            path: './music/song7.mp3',
            img: './img/img7.jpg'
        },
        {
            name: 'Ngày đầu tiên',
            singer: 'Đức Phúc',
            path: './music/song8.mp3',
            img: './img/img8.jpg'
        },
        {
            name: 'Mây lang thang',
            singer: 'PC',
            path: './music/song9.mp3',
            img: './img/img9.jpg'
        },
        {
            name: '10 Ngàn Năm',
            singer: 'PC',
            path: './music/song10.mp3',
            img: './img/img10.jpg'
        }
    ],

    
    render : function () {
        const htmls = this.songs.map((song, index) => {
            return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handlerEvents: function (){
        const cdwidth = cd.offsetWidth;
        const _this = this;


        // Xử lý cd roll, pause
        const cdthumbAnimate = cdthumb.animate([
            { transform : 'rotate(360deg)'}
        ],{
            duration : 10000,
            iterations: Infinity,
        })
        cdthumbAnimate.pause();

        
        // Xử lý phóng to thu nhỏ cd
        document.onscroll = function (){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdwidth = cdwidth - scrollTop;
            if(newcdwidth > 0){
                cd.style.width = newcdwidth + 'px';
            } else{
                cd.style.width = 0;
            }
            cd.style.opacity = newcdwidth / cdwidth ;
        }
        // Play Pasue Music
        playbtn.addEventListener('click', function(){
            player.classList.toggle('playing');
            if(player.classList.contains('playing')){
                audio.play();
                cdthumbAnimate.play();
            }
            else {
                audio.pause();
                cdthumbAnimate.pause();
            }
        });

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);
            }
        };

        // Lắng nghe progess
        progress.onchange = function(e){
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        };

        // Khi Next Song
        btnnext.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            } else{
                _this.nextSong();
            }
            player.classList.add('playing');
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        }

        // Khi Previous Song
        btnprev.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            player.classList.add('playing');
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        }

        // Xử lý random bật tắt random
        btnrandom.onclick = function(e){
            if(btnrepeat.classList.contains('active')){
                btnrepeat.classList.remove('active');
                _this.isRandom = !_this.isRandom;
                btnrandom.classList.toggle('active', _this.isRandom);
            }else{
                _this.isRandom = !_this.isRandom;
                btnrandom.classList.toggle('active', _this.isRandom);
            }   
            _this.setconfig('isRepeat', false);
            _this.setconfig('isRandom', _this.isRandom);
        }

        // Xử lý nextSong khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            } else{
                btnnext.click();
            }
        }

        // Xử lý bật tắt repeat
        btnrepeat.onclick = function(e){
            if(btnrandom.classList.contains('active')){
                btnrandom.classList.remove('active');
                _this.isRepeat =!_this.isRepeat;
                btnrepeat.classList.toggle('active', _this.isRepeat);
            } else{
                _this.isRepeat =!_this.isRepeat;
                btnrepeat.classList.toggle('active', _this.isRepeat);
            }
            _this.setconfig('isRandom', false);
            _this.setconfig('isRepeat', _this.isRepeat);
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songelement = e.target.closest('.song:not(.active)');
            if(songelement || e.target.closest('.option')){
                // Xử lý khi click vào song
                if(songelement){
                    _this.currentIndex = Number(songelement.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    player.classList.add('playing');
                } 
                // Xử lý click vào option
            }
        }
        
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        this.setconfig('currentIndex', this.currentIndex);
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrolltoActiveSong: function(){
        if(this.currentIndex < 3){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }, 300)
        }else{
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 300);
        } 
    },

    loadconfig: function(){
        if(this.config.isRandom){
            this.isRandom = this.config.isRandom;
        }
        else{
            this.isRandom = false;
        }
        if(this.config.isRepeat){
            this.isRepeat = this.config.isRepeat;
        }
        if(this.config.currentIndex){
            this.currentIndex = this.config.currentIndex;
        }
        else{
            this.currentIndex = 0;
        }
    },


    start : function (){
        // Load config
        this.loadconfig();

        // Định nghĩa thuộc tính object
        this.defineProperties();

        // Lắng nghe và xử lý sự kiến
        this.handlerEvents();

        // Load currentSong
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        // Hiển thị trạng thái ban đầu cảu button repeat và random
        btnrepeat.classList.toggle('active', this.isRepeat);
        btnrandom.classList.toggle('active', this.isRandom);
    },

}

app.start();
