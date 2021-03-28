
exports.clean = (anime) => {
    anime = anime.substring(anime.indexOf("<a title=3D\"")+12);
    anime = anime.substring(0, anime.indexOf("\""));
    anime = anime.split("amp;").join("").split("&quot;").join( "\"").split("/a").join("").split("=").join("").split("E28099").join("\'");
    return anime
}