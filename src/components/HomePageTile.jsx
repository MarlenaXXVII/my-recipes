function HomePageTile({imageSrc, imageLinkTo, imageAlt, title, subtitle}) {
    return (
        <div className="home-page-tile">
            <a href={imageLinkTo}>
                <article >
                    <img src={imageSrc} alt={imageAlt}/>
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                </article>
            </a>
        </div>
    );
}

export default HomePageTile;