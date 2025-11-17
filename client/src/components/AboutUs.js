import React from "react";
import {
  AboutHeaderAndIntro,
  AboutUsCardsDiv,
  AboutUsStyled,
} from "./AboutUs.styled";
import AboutUsCard from "./common/AboutUsCard";
import { Container } from "react-bootstrap";
import car from "../assets/img/car.jpeg";

const AboutUs = () => {
  return (
    <Container>
      <AboutUsStyled>
        <AboutHeaderAndIntro>
          <h1>Aboutus</h1>
          <div>
            <p>
              United Cleaning & Trolley Services was established in 2007 to
              fulfil the needs of contract cleaning and trolley management
              services in the private and government sectors in South Africa. In
              each aspect of our business, we strive to maintain the highest
              service levels. We offer contract cleaning services within a
              variety of industries including commercial, retail, hotels and
              resorts, office space, construction, the government, industrial,
              educational institutions, car parks and pressure cleaning
              services. We also specialise in Trolley Management Services and
              Waste Management Services. We have a national footprint and
              operate throughout all 9 provinces of South Africa, as well as
              growing into Africa.
            </p>
          </div>
        </AboutHeaderAndIntro>
        <AboutUsCardsDiv>
          <AboutUsCard
            image={car}
            title={"Values"}
            description={
              "Customer commitment: We develop lasting relationships through building trust and confidence. Quality: We offer outstanding service delivery.Integrity: We maintain a transparent relationship with both our clients and employees.Care: We care for our partners, employees and environment.Innovative: We constantly seek new ways to bring innovation."
            }
          />
          <AboutUsCard
            image={car}
            title={"Goals"}
            description={
              "To be the preferred contract cleaning and trolley management service provider in Africa.To ensure the highest standard of quality.To build trusting, lasting relationships with our partners."
            }
          />
          <AboutUsCard
            image={car}
            title={"As Cleaning Specialists,Our Responsibilities Are"}
            description={
              "To maintain health and safety requirements.To ensure surfaces, fittings and finishes are preserved.To preserve appearance.To strengthen the image of the partners’ organisations through our work, our teams and our attitude."
            }
          />
        </AboutUsCardsDiv>
      </AboutUsStyled>
    </Container>
  );
};

export default AboutUs;
