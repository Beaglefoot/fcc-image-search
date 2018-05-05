const normalize = ({ data: { data } }) =>
  data.reduce(
    (result, { title, link, images }) =>
      title && link && images
        ? [...result, { text: title, page: link, image: images[0].link }]
        : result,
    []
  );

module.exports = normalize;
