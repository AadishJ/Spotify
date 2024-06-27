//Global variables
let isPlaying = 0;
let isCreated = 0;
let currentSong;
let isPaused = 0;
let currentSongIndex;
let songInterval;
let songDuration;
let timeInSec = 0;
//coldplay bruno edsheeren 
//This function fetches the song from the server
async function getSongs ( folder )
{
    let x = await fetch( folder );
    let response = await x.text();
    let div = document.createElement( "div" );
    div.innerHTML = response;
    let as = div.getElementsByTagName( "a" );
    let songs = [];
    for ( let index = 0;index < as.length;index++ )
    {
        const element = as[ index ];
        if ( element.href.endsWith( ".mp3" ) )
        {
            songs.push( element.href );
        }
    }
    return songs;
}

async function creation ( songs )
{
    let albums = document.querySelector( ".albums" );
    return new Promise( ( resolve ) =>
    {

        if ( isCreated == 1 )
        {
            albums.innerHTML = "";
            isCreated = 0;
        } else 
        {
            for ( let index = 0;index < songs.length;index++ )
            {
                const element = songs[ index ];
                let songName = ( element.slice( 74 ) ).replaceAll( "%20", " " ).slice( "0", "-4" );
                albums.innerHTML += `<div class="album ${ songName.replaceAll( ( " " ), ( "" ) ) }">
                                        <img src="Assets/SVG/AfterHours.jpeg" alt="">
                                        <div class="songo">
                                            <span>${ songName }</span>
                                            <ul>
                                                <li>The Weeknd</li>
                                                <li>After Hours</li>
                                            </ul>
                                        </div>
                                    </div>`;
            }
            isCreated = 1;
        }
        resolve();

    } );

}




async function mediaCreator ( selectedSong, songs )
{
    let media = document.querySelector( ".musicplayer" );
    let songName = ( selectedSong.slice( 74 ) ).replaceAll( "%20", " " ).slice( "0", "-4" );
    media.innerHTML += `<div class="songinfo">
    <img src="Assets/SVG/AfterHours.jpeg" alt="">
    <div>
        <span>${ songName }</span>
        <span>The Weeknd</span>
    </div>
</div>
<div class="tools">
    <div class="playpause">
        <img class="previousSongSvg" src="Assets/SVG/previoussong.svg" alt="">
        <img class ="playPauseSvg" src="Assets/SVG/pause.svg" alt="">
        <img class="nextSongSvg" src="Assets/SVG/nextsong.svg" alt="">
    </div>
    <div class="time">
        <span class="songTime"></span>
        <div class="slider">
        <div class="circle"></div>
        </div>
        <span class="songLength"></span>
    </div>
</div>`;
    mediaManager( selectedSong, songs );
}

async function mediaDestroy ()
{
    let media = document.querySelector( ".musicplayer" );
    media.innerHTML = "";
}





async function playSong ( songs, songName )
{
    if ( isPlaying == 0 )
    {
        return new Promise( ( resolve ) =>
        {
            for ( let index = 0;index < songs.length;index++ ) 
            {
                const element = songs[ index ];
                if ( songName == ( element.slice( 74 ) ).replaceAll( "%20", "" ).slice( "0", "-4" ) )
                {
                    let assa = new Audio( element );
                    mediaCreator( element, songs );
                    currentSong = assa;
                    currentSongIndex = index;
                    assa.play();
                    isPlaying = 1;
                    isPaused = 0;
                    resolve();
                    break;
                }
            }
        } );
    } else
    {
        currentSong.pause();
        mediaDestroy();
        isPlaying = 0;
        isPaused = 1;
        playSong( songs, songName );
    }
}




async function playSongByIndex ( songs, index )
{
    if ( isPlaying == 0 )
    {

        return new Promise( ( resolve ) =>
        {
            let songx = songs[ index ];
            let xssa = new Audio( songx );
            mediaCreator( songx );
            currentSong = xssa;
            currentSongIndex = index;
            xssa.play();
            isPlaying = 1;
            isPaused = 0;
            resolve();
        } );
    } else
    {
        mediaDestroy();
        isPlaying = 0;
        isPaused = 1;
        playSongByIndex( songs, index );
    }
}




async function mediaManager ( selectedSong, songs )
{
    let songPlay = new Audio( selectedSong );
    let songLength = document.querySelector( ".songLength" );
    songPlay.addEventListener( 'loadedmetadata', function ()
    {
        songDuration = songPlay.duration;
        songasdasd = songPlay.currentTime;
        let minutes = Math.floor( songDuration / 60 );
        let seconds = Math.floor( songDuration % 60 );
        if ( minutes < 10 )
        {
            minutes = "0" + minutes;
        }
        if ( seconds < 10 )
        {
            seconds = "0" + seconds;
        }
        songLength.innerHTML = `${ minutes }:${ seconds }`;
        songTimeTracker( songDuration, songs );
    } );

}



async function songTimeTracker ( songDuration, songs )
{
    let songTime = document.querySelector( ".songTime" );
    songInterval = setInterval( () =>
    {

        if ( timeInSec / 60 < 10 && timeInSec % 60 < 10 )
        {
            songTime.innerHTML = `0${ Math.floor( timeInSec / 60 ) }:0${ Math.floor( timeInSec % 60 ) }`;
        } else if ( timeInSec / 60 < 10 )
        {
            songTime.innerHTML = `0${ Math.floor( timeInSec / 60 ) }:${ Math.floor( timeInSec % 60 ) }`;
        }
        else if ( timeInSec % 60 < 10 )
        {
            songTime.innerHTML = `${ Math.floor( timeInSec / 60 ) }:0${ Math.floor( timeInSec % 60 ) }`;
        } else
        {
            songTime.innerHTML = `${ Math.floor( timeInSec / 60 ) }:${ Math.floor( timeInSec % 60 ) }`;

        }
        timeInSec++;
        if ( timeInSec >= songDuration )
        {
            playNextSong( songs );
        }
        let slider = document.querySelector( ".circle" );
        slider.style.left = ( timeInSec / songDuration ) * 100 + "%";
        let slideon = document.querySelector( ".slider" );
        slideon.style.backgroundImage = `linear-gradient(to right, white ${ ( ( timeInSec / songDuration ) * 100 ) }%, #a7a7a7 ${ ( ( timeInSec / songDuration ) * 100 ) }%)`;
    }, 1000 );
}




async function playPauseSong ()
{
    let svgelem = document.querySelector( ".playPauseSvg" );
    if ( isPaused )
    {
        currentSong.play();
        isPaused = 0;
        svgelem.src = "Assets/SVG/pause.svg";
        clearInterval( songInterval );
        songTimeTracker( songDuration );
    } else
    {
        currentSong.pause();
        isPaused = 1;
        svgelem.src = "Assets/SVG/playbutton.svg";
        clearInterval( songInterval );
    }
}




async function stopCurrentSong ()
{
    timeInSec = 0;
    isPaused = 0;
    playPauseSong();
}





async function playNextSong ( songs )
{
    stopCurrentSong();
    if ( currentSongIndex == songs.length - 1 )
    {
        currentSongIndex = 0;
        await playSongByIndex( songs, currentSongIndex );
    } else
        await playSongByIndex( songs, currentSongIndex + 1 );
}




async function playPreviousSong ( songs )
{
    stopCurrentSong();
    if ( currentSongIndex == 0 )
    {
        currentSongIndex = songs.length - 1;
        await playSongByIndex( songs, currentSongIndex );
    } else
        await playSongByIndex( songs, currentSongIndex - 1 );
}
async function sidealbumCreator ( albumName, albumType, Artist )
{
    let a = document.querySelector( ".sidealbum" );
    return new Promise( ( resolve ) =>
    {
        a.innerHTML += `<div class="albumna">
                        <img src="Assets/SVG/AfterHours.jpeg" alt="" height="50px">
                        <div>
                            <span class="sideAlbumName">${ albumName }</span>
                            <ul>
                                <li class="sideAlbumName">${ albumType }</li>
                                <li class="sideAlbumName">${ Artist }</li>
                            </ul>
                        </div>
                    </div>`
        resolve();
    } );
}
async function main ()
{
    await sidealbumCreator( "After Hours", "Album", "The Weeknd" );
    let folder = "Assets/Albums/AfterHours/"
    let songs = await getSongs( folder );
    let sidealbum = document.querySelector( ".sidealbum" );
    sidealbum.addEventListener( "click", async () =>
    {
        await creation( songs );
        let songCards = Array.from( document.querySelectorAll( ".album" ) );
        songCards.forEach( songCard =>
        {
            songCard.addEventListener( "click", async () =>
            {
                if ( isPlaying )
                {
                    stopCurrentSong();
                }
                let songName = songCard.classList[ 1 ];
                await playSong( songs, songName );
            } );
        } );
    }
    );
    document.addEventListener( 'keydown', async ( event ) =>
    {
        if ( event.code === "Space" && isPlaying )
        {
            playPauseSong();
        }
    } );
    document.querySelector( '.musicplayer' ).addEventListener( 'click', async ( event ) =>
    {
        if ( event.target.classList.contains( 'nextSongSvg' ) )
        {
            playNextSong( songs );
        }
        if ( event.target.classList.contains( 'previousSongSvg' ) )
        {
            playPreviousSong( songs );
        }
        if ( event.target.classList.contains( 'playPauseSvg' ) )
        {
            playPauseSong();
        }
    } );
    document.querySelector( ".musicplayer" ).addEventListener( "click", async ( event ) =>
    {
        if ( event.target.classList.contains( "slider" ) )
        {
            timeInSec = event.offsetX / event.target.getBoundingClientRect().width * songDuration;
            currentSong.currentTime = timeInSec;
        }
    } );
}
function mediaQuery ()
{
    let x = window.matchMedia( "(max-width: 1400px)" );
    if ( x.matches )
    {
        // document.querySelector( ".yl" ).innerHTML = `<img class="libsvg" src="Assets/SVG/library.svg" alt="">`;
        // let span = document.querySelectorAll( ".Homey" );
        // Array.from(span).forEach(element => {
        //     element.innerHTML = "";
        // } );
        let p = document.createElement( "li" );
        const img = document.createElement( "img" );
        img.src = "Assets/SVG/burger.svg"
        img.className = "libsvg burger";
        p.appendChild( img );
        let list = document.querySelector( ".hlist" );
        list.insertBefore( p, list.children[ 0 ] );
    } else
    {
        return;
    }
}
main();
mediaQuery();


