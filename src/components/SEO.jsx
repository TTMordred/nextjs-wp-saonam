export default function SEO({ 
  title = 'Sao Nam TG', 
  description = 'STC LUÔN QUAN TÂM ĐẾN LỢI ÍCH KHÁCH HÀNG', 
  ogImage = '/og-image.jpg',
  canonicalUrl
}) {
  // Construct the full title
  const fullTitle = title === 'Sao Nam TG' ? title : `${title} | Sao Nam TG`;
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
