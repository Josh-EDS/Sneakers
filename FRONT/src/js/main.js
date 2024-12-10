const updateImageSource = () => {
    const image = document.querySelector('#root > div > div.flex.justify-between.items-center.p-4.bg-gray-100 > div > a > img');
    if (image) {
      if (window.innerWidth < 500) {
        image.src = "/src/assets/P.png";
      } else {
        image.src = "/src/assets/Patissier.png";
      }
    }
  };
  
  updateImageSource();
  window.addEventListener('resize', updateImageSource);
