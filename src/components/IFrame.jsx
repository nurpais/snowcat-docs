function IFrame({ width, height, src, title = 'YouTube video player' }) {
  return (
    <iframe
      width="100%"
      height={height}
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullscreen
    ></iframe>
  )
}

export default IFrame
