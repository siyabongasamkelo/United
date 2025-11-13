import React from "react";
import {
  HeroSection,
  HomeCover,
  LeftHero,
  LeftSidePhotoContainer,
  RightHero,
  SocialMedia,
} from "./Home.styled";
import { Instagram, Whatsapp, TwitterX, Facebook } from "react-bootstrap-icons";
import { Container } from "react-bootstrap";
import Header from "../components/common/Header";
import home from "../assets/img/home.jpeg";
import rasta from "../assets/img/rasta.jpeg";
import car from "../assets/img/car.jpeg";
import Button from "../components/common/Button";

const Home = () => {
  return (
    <Container>
      <HomeCover>
        <Header />
        <HeroSection>
          <LeftHero>
            <LeftSidePhotoContainer>
              <div className="left-side-photos">
                <div className="upper-photos">
                  <img src={rasta} alt="rasta" />
                </div>
                <div className="lower-photos">
                  <img src={home} alt="home" />
                </div>
              </div>
              <div className="right-side-photos">
                <img src={car} alt="home" />
              </div>
            </LeftSidePhotoContainer>
          </LeftHero>
          <RightHero>
            <div className="upper-text"></div>
            <div className="middle-text">
              <div>
                <p>
                  your trusted partner in professional trolley maintenance,
                  repairs, and support. We specialize in providing durable,
                  efficient, and well-maintained trolleys that keep your
                  business running smoothly. With a focus on quality service and
                  customer satisfaction, we ensure every trolley is in top
                  condition — ready to perform when you need it most.
                </p>
              </div>
            </div>
            <div className="lower-text">
              <h1>The Best Trolley Service Company</h1>
              <Button>Get Started</Button>
            </div>
          </RightHero>
        </HeroSection>
        <SocialMedia>
          <div>
            <Facebook />
            <Instagram />
            <TwitterX />
            <Whatsapp />
          </div>
        </SocialMedia>
      </HomeCover>
    </Container>
  );
};

export default Home;
