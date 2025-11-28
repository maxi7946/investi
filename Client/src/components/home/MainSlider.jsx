import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sliderBg1 from '../../assets/images/slider/bg1.jpg';

/**
 * MainSlider component that displays the carousel/slider on the home page
 */
const MainSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 0,
      className: 'item active bg-parallax item-1',
      title: (
        <h3 className="slide-title">
          <span>Profitable</span> Crypto <span>Trading </span> Investment Solutions
        </h3>
      ),
      buttonText: 'Get Started',
      buttonLink: '/signup'
    },
    {
      id: 1,
      className: 'item bg-parallax item-2',
      title: (
        <h3 className="slide-title">
          <span>Crypto</span> Investment <br/>You can <span>Trust</span>
        </h3>
      ),
      buttonText: 'our Plans',
      buttonLink: '#plans'
    }
  ];
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const goToSlide = (index) => {
    setActiveSlide(index);
  };
  
  return (
    <div id="main-slide" className="carousel slide carousel-fade" data-ride="carousel">
      {/* Indicators */}
      <ol className="carousel-indicators visible-lg visible-md">
        {slides.map((slide, index) => (
          <li 
            key={slide.id}
            data-target="#main-slide" 
            data-slide-to={index} 
            className={activeSlide === index ? 'active' : ''}
            onClick={() => goToSlide(index)}
          ></li>
        ))}
      </ol>
      
      {/* Carousel Inner */}
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`item ${activeSlide === index ? 'active' : ''} bg-parallax ${index === 0 ? 'item-1' : 'item-2'}`}
          >
            <div className="slider-content">
              <div className="container">
                <div className="slider-text text-center">
                  {slide.title}
                  <p>
                    <a href={slide.buttonLink} className="slider btn btn-primary">
                      {slide.buttonText}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <a className="left carousel-control" href="#main-slide" data-slide="prev" onClick={prevSlide}>
        <span><i className="fa fa-angle-left"></i></span>
      </a>
      <a className="right carousel-control" href="#main-slide" data-slide="next" onClick={nextSlide}>
        <span><i className="fa fa-angle-right"></i></span>
      </a>
    </div>
  );
};

export default MainSlider;