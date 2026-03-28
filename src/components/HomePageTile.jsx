function HomePageTile({imageSrc, imageAlt, title, subtitle}) {
    return (
        <article className="home-page-tile">
            <img src={imageSrc} alt={imageAlt}/>
            <h3>{title}</h3>
            <p>{subtitle}</p>
        </article>
    );
}

export default HomePageTile;