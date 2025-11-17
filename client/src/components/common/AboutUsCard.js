import React from "react";
import {
  AboutUsCardContainer,
  CardImage,
  CardText,
} from "./AboutUsCard.styled";

const AboutUsCard = ({ image, title, description }) => {
  return (
    <AboutUsCardContainer>
      <CardImage>
        <img src={image} alt={title} />
      </CardImage>
      <CardText>
        <h3>{title}</h3>
        <p>{description}</p>
      </CardText>
    </AboutUsCardContainer>
  );
};

export default AboutUsCard;
