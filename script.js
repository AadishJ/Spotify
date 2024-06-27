let currAlbum;
let albumInfo;
let currSongInd;
let currSong = new Audio;
let currSongs;
let currSongDuration;
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
async function getAlbums ()
{
    let x = await fetch( "./Assets/Albums" );
    let y = await x.text();
    let div = document.createElement( "div" );
    div.innerHTML = y;
    let a = div.getElementsByTagName( "a" );
    return new Promise( ( resolve ) =>
    {
        let albumPromises = Array.from( a ).map( async ( e ) => 
        {
            if ( e.href.includes( "/Albums/" ) )
            {
                let currFolder = e.href.split( "/" )[ 5 ];
                x = await fetch( `./Assets/Albums/${ currFolder }/info.json` );
                y = await x.json();
                albumInfo = y;
                createAlbum();
            }
        } );
        Promise.all( albumPromises ).then( resolve );
    } )


}
async function createAlbum ()
{
    let a = document.querySelector( ".sidealbum" );
    return new Promise( ( resolve ) =>
    {
        a.innerHTML += `<div class="albumna ${ albumInfo.name.replace( " ", "" ) }">
                        <img src="${ albumInfo.cover }" alt="" height="50px">
                        <div>
                            <span class="sideAlbumName">${ albumInfo.name }</span>
                            <ul>
                                <li class="sideAlbumName">${ albumInfo.type }</li>
                                <li class="sideAlbumName">${ albumInfo.artist }</li>
                            </ul>
                        </div>
                    </div>`
        resolve();
    } );


}
async function expandAlbum ()
{
    currSongs = await getSongs( `./Assets/Albums/${ currAlbum }` )
    let albums = document.querySelector( ".albums" );
    return new Promise( ( resolve ) =>
    {
        albums.innerHTML = "";
        for ( let index = 0;index < currSongs.length;index++ )
        {
            const element = currSongs[ index ];
            let songName = ( decodeURI( element ).split( "/" )[ 6 ].slice( 0, -4 ) );
            albums.innerHTML += `<div class="album ind${ index }">
                                        <img src=${ albumInfo.cover } alt="">
                                        <div class="songo">
                                            <span>${ songName }</span>
                                            <ul>
                                                <li>${ albumInfo.artist }</li>
                                                <li>${ albumInfo.name }</li>
                                            </ul>
                                        </div>
                                    </div>`;

        }
        let album = document.querySelectorAll( ".album" );
        album.forEach( element =>
        {
            element.addEventListener( "click", () =>
            {
                currSongInd = element.classList[ 1 ].slice( 3 );
                playSong();
            } )
        } );
        resolve();

    } );
}
async function playSong ()
{
    if ( currSong )
    {
        currSong.pause();
    }
    currSong = new Audio( currSongs[ currSongInd ] );
    currSong.play();
    toolCreator();
}
async function toolCreator ()
{
    let media = document.querySelector( ".musicplayer" );
    media.innerHTML = "";
    console.log();
    let songName = decodeURI( currSongs[ currSongInd ] ).split( "/" )[ 6 ].slice( 0, -4 );
    currSong.addEventListener( "loadedmetadata", () =>
    {
        currSongDuration = currSong.duration;
        media.innerHTML += `<div class="songinfo">
                        <img src="${ albumInfo.cover }" alt="">
                        <div>
                            <span>${ songName }</span>
                            <span>${ albumInfo.artist }</span>
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
                            <span class="songLength">${ secondHandler( currSong.duration ) }</span>
                        </div>
                    </div>`;
        let songTime = document.querySelector( ".songTime" );
        currSong.ontimeupdate = () =>
        {
            songTime.innerHTML = secondHandler( currSong.currentTime )
            let slider = document.querySelector( ".circle" );
            slider.style.left = ( currSong.currentTime / currSongDuration ) * 100 + "%";
            let slideon = document.querySelector( ".slider" );
            slideon.style.backgroundImage = `linear-gradient(to right, white ${ ( ( currSong.currentTime / currSongDuration ) * 100 ) }%, #a7a7a7 ${ ( ( currSong.currentTime / currSongDuration ) * 100 ) }%)`;
            if ( currSong.currentTime >= currSongDuration )
            {
                playNextSong();
            }
        }
    } );
}
function secondHandler ( seconds )
{
    let hours = seconds / 3600;
    seconds %= 3600;
    let mins = seconds / 60;
    let secs = seconds % 60;
    hours = Math.floor( hours );
    mins = Math.floor( mins );
    secs = Math.floor( secs );
    if ( secs < 10 )
    {
        secs = "0" + secs;
    }
    if ( mins < 10 )
    {
        mins = "0" + mins;
    }
    if ( hours < 10 )
    {
        hours = "0" + hours;
    }
    if ( hours == 0 )
    {
        return `${ mins }:${ secs }`;
    } else
    {
        return `${ hours }:${ mins }:${ secs }`;

    }

}
function playNextSong ()
{
    currSongInd++;
    if ( currSongInd >= currSongs.length )
    {
        currSongInd = 0;
    }
    playSong();
}
function playPreviousSong ()
{
    currSongInd--;
    if ( currSongInd == -1 )
    {
        currSongInd = currSongs.length - 1;
    }
    playSong();
}
async function main ()
{
    await getAlbums();
    let albumna = document.querySelectorAll( ".albumna" );
    albumna.forEach( element =>
    {
        element.addEventListener( "click", async ( event ) =>
        {
            currAlbum = element.classList[ 1 ]
            x = await fetch( `./Assets/Albums/${ currAlbum }/info.json` );
            y = await x.json();
            albumInfo = y;
            expandAlbum();
        } );
    } );
    document.querySelector( '.musicplayer' ).addEventListener( 'click', async ( event ) =>
    {
        if ( event.target.classList.contains( 'nextSongSvg' ) )
        {
            playNextSong();
        }
        if ( event.target.classList.contains( 'previousSongSvg' ) )
        {
            playPreviousSong();
        }
        if ( event.target.classList.contains( 'playPauseSvg' ) )
        {
            let svgelem = document.querySelector( ".playPauseSvg" );
            if ( !currSong.paused )
            {
                currSong.pause();
                svgelem.src = "Assets/SVG/playbutton.svg";
            } else
            {
                currSong.play();
                svgelem.src = "Assets/SVG/pause.svg";
            }
        }
        if ( event.target.classList.contains( "slider" ) )
        {
            currSong.currentTime = event.offsetX / event.target.getBoundingClientRect().width * currSongDuration;
        }
    } );
    document.addEventListener( 'keydown', async ( event ) =>
    {
        if ( event.code === "Space" )
        {
            let svgelem = document.querySelector( ".playPauseSvg" );
            if ( !currSong.paused )
            {
                currSong.pause();
                svgelem.src = "Assets/SVG/playbutton.svg";
            } else
            {
                currSong.play();
                svgelem.src = "Assets/SVG/pause.svg";
            }
        }
    } );
}
main();